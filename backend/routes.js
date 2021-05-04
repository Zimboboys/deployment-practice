const express = require('express');
const controllers = require('./controllers');
const { auth } = require('./auth');

const router = express.Router();

router.get('/click', async (req, res) => {
  const totalClicks = await controllers.totalClicks();
  const total = totalClicks[0].clicks;

  res.json({ count: total });
});

router.post('/click', auth, async (req, res) => {
  const { user } = req;

  if (!user) {
    res.sendStatus(401);
    return;
  }

  const id = user._id;
  await controllers.doClick(id);
  res.sendStatus(201);
});

router.get('/user', auth, async (req, res) => {
  const { user } = req;
  if (!user) {
    res.sendStatus(401);
    return;
  }

  const { clicks } = req.user;
  res.json({ count: clicks });
});

module.exports = router;
