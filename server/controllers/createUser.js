const { User } = require('../models');
const debug = process.env.NODE_ENV === 'dev';

async function _createUser (req, res) {
  if (debug) console.log('_createUser', req.body);

  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'Error _createElement',
    })
  }

  const user = new User();

  try {
    await User.findOne({ user: body.name }).exec(function (err, result) {
      if (err) {
        return res.status(400).json({ success: false, error: err })
      }

      console.log('Result : ' , result);

      if (!User) {
        return res
          .status(404)
          .json({ success: false, error: `Book not found` })
      }

      //Si aucun user de connu au démarrage
      if (result === null) {
        user.user = body.name;

        user.save();
      }

      return res.status(200).json(result);
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error' });
  }
}

module.exports = _createUser;
