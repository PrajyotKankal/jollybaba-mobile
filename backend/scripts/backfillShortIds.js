require('dotenv').config();
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const Mobile = require('../models/Mobile');

const nano = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'jollybaba_db' });
  const cursor = Mobile.find({ $or: [{ shortId: { $exists: false } }, { shortId: null }] }).cursor();
  let n = 0;
  for (let doc = await cursor.next(); doc; doc = await cursor.next()) {
    doc.shortId = nano();
    await doc.save();
    n++;
  }
  console.log(`Backfilled ${n} mobiles`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
