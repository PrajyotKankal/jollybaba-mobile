const { customAlphabet } = require('nanoid');
const nano = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

async function ensureShortId(Model, doc) {
  if (doc.shortId) return doc.shortId;
  const id = nano();
  await Model.updateOne({ _id: doc._id }, { $set: { shortId: id } });
  return id;
}
module.exports = { ensureShortId };
