const Mobile = require('../models/Mobile');
const Counter = require('../models/Counter');
const cloudinary = require('../utils/cloudinary'); // adjust the path if needed

// Generate next custom mobile ID
const getNextMobileId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'mobileId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return `MBL-${counter.value.toString().padStart(4, '0')}`;
};

// Upload new mobile (Admin only)
const uploadMobile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Image upload failed' });
    }

    // Upload to Cloudinary
    const uploaded = await Promise.all(
      req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: 'jollybaba/mobiles',
        })
      )
    );

    const imageUrls = uploaded.map((img) => img.secure_url);
    const imagePublicIds = uploaded.map((img) => img.public_id);

    const { brand, model, ram, storage, price, color, condition } = req.body;
    const mobileId = await getNextMobileId();

    const newMobile = new Mobile({
      imageUrls,
      imagePublicIds,
      brand,
      model,
      ram,
      storage,
      price,
      color,
      condition,
      mobileId,
    });

    const saved = await newMobile.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
};

// Get all mobiles (public)
const getMobiles = async (req, res) => {
  try {
    const { brand, model, ram, storage } = req.query;
    const query = {};

    if (brand) query.brand = brand;
    if (model) query.model = model;
    if (ram) query.ram = ram;
    if (storage) query.storage = storage;

    const mobiles = await Mobile.find(query).sort({ createdAt: -1 });
    res.status(200).json(mobiles);
  } catch (err) {
    console.error('Fetching error:', err);
    res.status(500).json({ message: 'Fetching mobiles failed' });
  }
};

module.exports = {
  uploadMobile,
  getMobiles,
};
