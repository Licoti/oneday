const { User } = require('../models');
const debug = process.env.NODE_ENV === 'dev';

async function _createElement (req, res) {
  if (debug) console.log('_createElement', req.params.user, req.body.categories);

  const body = req.body;

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

  if (req.body.categories.length) {
    user.names = req.body.categories;

    User.findOneAndUpdate(
      {user: req.params.user}, { $set:{ names:req.body.categories } }, { new: true },
      (err, result) => {
        if (err) { return handleError(res, err); }
        return res.status(200).json(result);
      });
    }
}

module.exports = _createElement;
