const { User } = require('../models');
const debug = process.env.NODE_ENV === 'dev';

async function _createElement (req, res) {
  if (debug) console.log('_createElement', req.params.user);

  const body = req.body;
  if (debug) console.log('_createElement body : ', body);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'Error _createElement',
    })
  }

  const user = new User();

  if (!user) {
    return res.status(400).json({ success: false, error: err })
  }

  if (req.body.id.length) {
    User.findOneAndUpdate(
      {user: req.params.user}, { $push:{ names:req.body } }, { new: true },
      (err, result) => {
        if (err) { return handleError(res, err); }
        return res.status(200).json(result);
      });
  }
}

module.exports = _createElement;
