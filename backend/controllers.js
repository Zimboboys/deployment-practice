const mongoose = require('mongoose');
const { Click, User } = require('./models');

// absolutely no error checking needed. it will always work.

const totalClicks = async () => (
  await Click.aggregate([{ $group: { _id: null, clicks: { $sum: "$count" } } }])
);

const doClick = async (user_id) => {
  await Click.updateOne({ session: 0 }, { $inc: { count: 1 } }, { upsert: true });
  await User.findByIdAndUpdate(user_id, { $inc: { clicks: 1 } });
};

const getUser = async (id) => (
  await User.findById(id)
);

module.exports = { totalClicks, doClick, getUser };
