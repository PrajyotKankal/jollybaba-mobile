const Mobile = require('../models/Mobile');
const Counter = require('../models/Counter');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const streamifier = require('streamifier');

// Generate next custom mobile ID like MBL-0001
const getNextMobileId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'mobileId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return `MBL-${counter.value.toString().padStart(4, '0')}`;
};

// Upload buffer to Cloudinary
const uploadToCloudinary = async (buffer) => {
  const resized = await sharp(buffer)
    .resize({ width: 800 })
    .jpeg({ quality: 80 })
    .toBuffer();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'jollybaba_mobiles',
        transformation: [{ fetch_format: 'auto' }],
      },
      (error, result) => {
        if (result) resolve({ url: result.secure_url, public_id: result.public_id });
        else reject(error);
      }
    );
    streamifier.createReadStream(resized).pipe(stream);
  });
};

// ✅ Upload new mobile (Admin only)
const uploadMobile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const {
      brand,
      model,
      ram,
      storage,
      retailPrice,
      dealerPrice,
      color,
      condition,
      description, // ✅ extract description from request body
    } = req.body;

    const imageUrls = [];
    const imagePublicIds = [];

    for (const file of req.files) {
      const { url, public_id } = await uploadToCloudinary(file.buffer);
      imageUrls.push(url);
      imagePublicIds.push(public_id);
    }

    const mobileId = await getNextMobileId();

    const newMobile = new Mobile({
      brand,
      model,
      ram,
      storage,
      retailPrice,
      dealerPrice,
      color,
      condition,
      imageUrls,
      imagePublicIds,
      mobileId,
      description, 
    });

    await newMobile.save();
    res.status(201).json(newMobile);
  } catch (err) {
    console.error('❌ Upload Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// ✅ Get all mobiles (with filters)
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
    console.error('❌ Fetch Error:', err);
    res.status(500).json({ message: 'Fetching mobiles failed' });
  }
};

// ✅ Get single mobile by ID
const getMobileById = async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id);
    if (!mobile) {
      return res.status(404).json({ message: 'Mobile not found' });
    }
    res.json(mobile);
  } catch (err) {
    console.error('❌ Fetch Mobile Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  uploadMobile,
  getMobiles,
  getMobileById,
};
