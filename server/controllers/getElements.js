const { User } = require('../models');
const debug = process.env.NODE_ENV === 'dev';

async function _getElements (req, res) {
  if (debug) console.log('_getElements', req.params.user);

  try {
    await User.findOne({ user: req.params.user }).exec(function (err, result) {
      if (err) {
        return res.status(400).json({ success: false, error: err })
      }

      if (!User) {
        return res
          .status(401)
          .json({ success: false, error: `User not found` })
      }

      //Si aucun user de connu au démarrage
      if (result === null) {
        return res.status(401).send({result: 'redirect', url:'/'})
      }

      res.send(result);
    });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error' });
  }
}

module.exports = _getElements;
