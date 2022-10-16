const { User } = require('../models');
const moment = require('moment');
moment.locale('fr');
const debug = process.env.NODE_ENV === 'dev';

async function _getElements (req, res) {
  if (debug) console.log('_getElements', req.params.user, req.query.time);

  try {
    await User.findOne({ user: req.params.user }).exec(async function (err, result) {
      const tb = result.names;
      const names = [];

      if (debug) console.log('result',result);

      tb.forEach((d, index, arr) => {
        const numbers = [];

        names.push({
          name: d.name,
          id: d.id,
          numbers
        });

        for (const element of d.numbers) {
          const now = moment(new Date());
          const week = now.startOf('week');

          const selectedDate = moment(element.date, 'YYYY-MM-DD');

          const thisMonth = moment(selectedDate).isSame(now, 'month');
          const thisWeek = moment(selectedDate).isBetween(week, undefined);
          const thisWeekInclusive = moment(selectedDate).isSame(week);

          if (req.query.time === 'week' && thisWeek || thisWeekInclusive) {
            numbers.push({
              date: element.date,
              id: element.id
            });
          }

          if (req.query.time === 'month' && thisMonth) {
            numbers.push({
              date: element.date,
              id: element.id
            });
          }
        }
      });

      if (err) {
        return res.status(400).json({ success: false, error: err })
      }

      if (!User) {
        if (debug) console.log('!User');
        return res
          .status(401)
          .json({ success: false, error: `User not found` })
      }

      //Si aucun user de connu au démarrage
      if (result === null) {
        return res.status(401).send({result: 'redirect', url:'/'})
      }

      if (req.query.time) {
        const data = {
          _id: result._id,
          names
        }
        res.send(data);
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    if (debug) console.log('err :', err);
    res.json({ status: 'error' });
  }
}

module.exports = _getElements;
