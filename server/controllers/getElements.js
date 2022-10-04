const { User } = require('../models');
const debug = process.env.NODE_ENV === 'dev';

async function _getElements (req, res) {
  if (debug) console.log('_getElements', req.params.user);

  const user = new User();

  try {
    await User.findOne({ user: req.params.user }).exec(function (err, result) {
      if (err) {
        return res.status(400).json({ success: false, error: err })
      }

      if (!User) {
        return res
          .status(404)
          .json({ success: false, error: `Book not found` })
      }

      //Si aucun user de connu au démarrage
      if (result === null) {
        user.user = req.params.user;

        user.save();
      }

      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error' });
  }
}

module.exports = _getElements;
