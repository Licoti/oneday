var express = require('express');
var router = express.Router();
const debug = process.env.NODE_ENV === 'dev';

const { Element } = require('../../server/database/models');

router.get('/elements/:user', function (req, res) {
  if (debug) console.log('_getElements',req.params.user);

  try {
    Element.findOne({ user: req.params.user }, function (err, data) {
      if (err) console.log('err : ', err);

      res.send(data);
    });
  } catch {
    console.log(err)
  }
});

router.put('/element/:id', function (req, res) {
  if (debug) console.log('_updateElement',req.params.id);

  const body = req.body;
  const element = new Element();

  if (!element) {
    return res.status(400).json({ success: false, error: err })
  }

  Element.findOneAndUpdate({ _id: req.params.id, 'names.id': body.nameId }, {
    $set: {
      "names.$.number": body.number
    }
  }, function (err, result) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(result);
  });
});

router.delete('/element/:id', function (req, res) {
  if (debug) console.log('_deleteElement', req.params.id);

  const body = req.body;
  console.log('Body : ' , body.nameId);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'Error _addElement',
    })
  }

  const element = new Element();

  if (!element) {
    return res.status(400).json({ success: false, error: err })
  }

  Element.findOneAndUpdate(
    {_id: req.params.id}, { $pull: { "names": { id: body.nameId } } }, { safe: true, upsert: true },
    (err, result) => {
      if (err) { return handleError(res, err); }
      return res.status(200).json(result);
    });
});

router.post('/element/:user', function (req, res) {
  if (debug) console.log('_addElement', req.params.user);

  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'Error _addElement',
    })
  }

  const element = new Element();

  if (!element) {
    return res.status(400).json({ success: false, error: err })
  }

  if (req.body.categories.length) {
    element.names = req.body.categories;

    Element.findOneAndUpdate(
      {user: req.params.user}, { $set:{ names:req.body.categories } }, { new: true },
      (err, result) => {
        element.save().then(() => {
          if (err) { return handleError(result, err); }
          return res.status(200).json(result)
        });
    });
  }
});

module.exports = router;
