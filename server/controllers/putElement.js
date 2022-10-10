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
      User.findOneAndUpdate({ _id: req.params.id, 'names.id': body.nameId }, {
        $push: {
          'names.$.numbers': body.numbers
        }
      }, function (err, data) {
        if (err) console.log('err : ', err);
        if (debug) console.log(`_updateElement - data : ${data}`);
      });
    } else {
      User.findOneAndUpdate({ _id: req.params.id, 'names.id': body.nameId }, {
        $pull: {
          'names.$.numbers': { id: bodyNumberId }
        }
      }, function (err, data) {
        if (err) console.log('err : ', err);
        if (debug) console.log(`_updateElement - data : ${data}`);
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: 'error' });
  }
}

module.exports = _putElement;
