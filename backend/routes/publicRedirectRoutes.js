const express = require('express');
const Mobile = require('../models/Mobile');

const router = express.Router();
const CANONICAL_BASE_URL = process.env.CANONICAL_BASE_URL || 'https://jollybaba.in';

router.get('/m/:shortId', async (req, res) => {
  try {
    const mobile = await Mobile.findOne({ shortId: req.params.shortId }).lean();
    if (!mobile) return res.status(404).send('Not found');

    const url = `${CANONICAL_BASE_URL}/mobile/${mobile._id}`;
    res.set('Cache-Control', 'no-store');
    return res.redirect(302, url);
  } catch (e) {
    console.error('redirect error', e);
    res.status(500).send('Server error');
  }
});

module.exports = router;
