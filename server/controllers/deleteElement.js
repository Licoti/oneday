const { User } = require('../models');
const debug = process.env.NODE_ENV === 'dev';

async function _deleteElement (req, res) {
  if (debug) console.log('_deleteElement', req.params.id);

  const body = req.body;
  console.log('Body : ' , body.nameId);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'Error _addElement',
    })
  }

  const user = new User();

  if (!user) {
    return res.status(400).json({ success: false, error: err })
  }

  User.findOneAndUpdate(
    {_id: req.params.id}, { $pull: { "names": { id: body.nameId } } }, { safe: true, upsert: true },
    (err, result) => {
    if (err) { return handleError(res, err); }
    return res.status(200).json(result);
  });
}

module.exports = _deleteElement;
