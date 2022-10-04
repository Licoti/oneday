const { Element } = require('../models');
const debug = process.env.NODE_ENV === 'dev';

async function _putElement (req, res) {
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
}

module.exports = _putElement;
