const { Element } = require('../models');
const debug = process.env.NODE_ENV === 'dev';

async function _getElements (req, res) {
  if (debug) console.log('_getElements',req.params.user);

  try {
    Element.findOne({ user: req.params.user }, function (err, data) {
      if (err) console.log('err : ', err);

      res.send(data);
    });
  } catch {
    console.log(err)
  }
}

module.exports = _getElements;
