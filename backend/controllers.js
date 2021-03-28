const mongoose = require('mongoose');
const { Click } = require('./models');

const getClicks = async () => await Click.find({});

const addClick = async (session) => (
  await Click.updateOne({ session }, { $inc: { count: 1 } }, { upsert: true })
);

const totalClicks = async () => (
  await Click.aggregate([{ $group: { _id: null, clicks: { $sum: "$count" } } }])
);

module.exports = { getClicks, addClick, totalClicks };
