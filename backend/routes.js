const express = require('express');
const controllers = require('./controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const clicks = await controllers.getClicks();
  res.json(clicks);
});

router.post('/push', async (req, res) => {
  const { session } = req.body;
  const clicks = await controllers.addClick(session);
  res.json(clicks);
});

router.get('/sum', async (req, res) => {
  const clicks = await controllers.totalClicks();
  const sum = clicks[0].clicks;
  res.json({ sum });
});

module.exports = router;
