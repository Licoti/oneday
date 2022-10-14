const { User } = require('../models');
const moment = require('moment');
moment.locale('fr');
const debug = process.env.NODE_ENV === 'dev';

async function _getElementDetail (req, res) {
  if (debug) console.log('_getElementDetail', req.params.user, req.query.time);

  try {
    await User.findOne({ user: req.params.user }).exec(async function (err, result) {

    });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error' });
  }
}

module.exports = _getElementDetail;
