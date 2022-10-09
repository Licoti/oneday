const { User } = require('../models');
const debug = process.env.NODE_ENV === 'dev';

async function _putElement (req, res) {
  if (debug) console.log('_updateElement',req.params.id);

  const body = req.body;
  const user = new User();

  if (!user) {
    return res.status(400).json({ success: false, error: err })
  }
  if (body.add) {
    if (debug) console.log('_updateElement : body ', body);
    User.findOneAndUpdate({ _id: req.params.id, 'names.id': body.nameId }, {
      $push: {
        "names.$.numbers": body.numbers
      }
    }, function (err, result) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(result);
    });
  }
}

module.exports = _putElement;
