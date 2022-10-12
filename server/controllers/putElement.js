const { User } = require('../models');
const debug = process.env.NODE_ENV === 'dev';

async function _putElement (req, res) {
  if (debug) console.log('_updateElement',req.params.id);

  const body = req.body;
  const user = new User();

  bodyNumberId = body.numbers.id;

  if (!user) {
    return res.status(400).json({ success: false, error: err })
  }

  try {
    if (body.add) {
      await User.findOneAndUpdate({ _id: req.params.id, 'names.id': body.nameId },
        { $push: {
          'names.$.numbers': body.numbers
          }
        }).exec(async function (err, result) {
          console.log('Result : ' , body.numbers);
        if (err) {
          return res.status(400).json({ success: false, error: err })
        } else {
          return res.status(200).json({ success: true, result: result })
        }
      });
    } else {
      await User.findOneAndUpdate({ _id: req.params.id, 'names.id': body.nameId },
        { $pull: {
          'names.$.numbers': { id: bodyNumberId }
          }
        }).exec(async function (err, result) {
        if (err) {
          return res.status(400).json({ success: false, error: err })
        } else {
          return res.status(200).json({ success: true, result: result })
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: 'error' });
  }
}

module.exports = _putElement;
