const { Element } = require('../models');
const debug = process.env.NODE_ENV === 'dev';

async function _createElement (req, res) {
  if (debug) console.log('_createElement', req.params.user);

  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'Error _createElement',
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
}

module.exports = _createElement;
