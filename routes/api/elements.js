var express = require('express');
var router = express.Router();
const debug = process.env.NODE_ENV === 'dev';

const { Element } = require('../../server/database/models');

router.get('/elements', function (req, res) {
  try {
    Element.find().exec(function (err, data) {
      if (err) console.log('err : ', err);

      res.send(data);
    });
  } catch {
    console.log(err)
  }
});

router.delete('/element/:id', function (req, res) {
  if (debug) console.log('_deleteElement',req.params.id);

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

  Element.findByIdAndUpdate(
    req.params.id, { $pull: { "names": { id: body.nameId } } }, { safe: true, upsert: true },
    function(err, node) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(node);
    });
});

router.post('/element', function (req, res) {
  if (debug) console.log('_addElement');

  const body = req.body;
  console.log('body : ' , req.body.categories);

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
    element.user = req.body.user;

    Element.findOneAndUpdate({user: req.body.user}, {$set:{names:req.body.categories}}, {new: true}, (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }

      if (doc === null) {
        console.log('Null !');
        element
          .save()
          .then(() => {
          return res.status(201).json({
            success: true,
            message: 'Created!',
          })
        })
        .catch(error => {
          return res.status(400).json({
            error,
            message: 'Not created!',
          })
        });
      }
    });
  }
});

module.exports = router;
