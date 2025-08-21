const express = require('express');
const mongoose = require('mongoose');
const Mobile = require('../models/Mobile');
const { ensureShortId } = require('../utils/ensureShortId');

const router = express.Router();
const SHORT_BASE_URL = process.env.SHORT_BASE_URL || 'https://jollybaba.in';

router.get('/mobiles/:id/link', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID' });
    const mobile = await Mobile.findById(id);
    if (!mobile) return res.status(404).json({ error: 'Mobile not found' });

    const shortId = await ensureShortId(Mobile, mobile);
    res.json({ link: `${SHORT_BASE_URL}/m/${shortId}` });
  } catch (e) {
    console.error('link error', e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
