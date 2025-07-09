require('dotenv').config();

const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;
const Mobile = require('../models/Mobile');
const Counter = require('../models/Counter');
const verifyAdmin = require('../middlewares/verifyAdmin');

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// 🔧 Helper: Upload buffer to Cloudinary
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
      (err, result) => {
        if (result) resolve({ url: result.secure_url, public_id: result.public_id });
        else reject(err);
      }
    );
    streamifier.createReadStream(resized).pipe(stream);
  });
};

// 🔢 Generate mobile ID like MBL-0001
const getNextMobileId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'mobileId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return `MBL-${counter.value.toString().padStart(4, '0')}`;
};

// ✅ Upload Mobile
router.post('/upload', verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ message: 'No images uploaded' });

    const { brand, model, ram, storage, price, color, condition } = req.body;
    const mobileId = await getNextMobileId();

    const imageUrls = [];
    const imagePublicIds = [];

    for (const file of req.files) {
      const { url, public_id } = await uploadToCloudinary(file.buffer);
      imageUrls.push(url);
      imagePublicIds.push(public_id);
    }

    const newMobile = new Mobile({
      brand,
      model,
      ram,
      storage,
      price,
      color,
      condition,
      imageUrls,
      imagePublicIds,
      mobileId,
    });

    await newMobile.save();
    res.status(201).json(newMobile);
  } catch (err) {
    console.error('❌ Upload Error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// ✅ Get All Mobiles (optionally filtered by query)
router.get('/', async (req, res) => {
  try {
    const { brand, model, ram, storage } = req.query;
    const filter = {};

    if (brand) filter.brand = brand;
    if (model) filter.model = model;
    if (ram) filter.ram = ram;
    if (storage) filter.storage = storage;

    const mobiles = await Mobile.find(filter).sort({ createdAt: -1 });
    res.json(mobiles);
  } catch (err) {
    console.error('❌ Fetch Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get Single Mobile by ID
router.get('/:id', async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id);
    if (!mobile) return res.status(404).json({ message: 'Mobile not found' });
    res.json(mobile);
  } catch (err) {
    console.error('❌ Fetch One Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Delete Mobile with Cloudinary Cleanup
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id);
    if (!mobile) return res.status(404).json({ message: 'Mobile not found' });

    for (const publicId of mobile.imagePublicIds) {
      await cloudinary.uploader.destroy(publicId);
    }

    await mobile.deleteOne();
    res.json({ message: 'Mobile and images deleted successfully' });
  } catch (err) {
    console.error('❌ Delete Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update Mobile
router.put('/:id', verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id);
    if (!mobile) return res.status(404).json({ message: 'Mobile not found' });

    let {
      brand,
      model,
      ram,
      storage,
      price,
      color,
      condition,
      imagesToDelete,
    } = req.body;

    imagesToDelete = imagesToDelete ? JSON.parse(imagesToDelete) : [];

    // Delete selected images from Cloudinary
    if (imagesToDelete.length > 0) {
      const newImageUrls = [];
      const newImagePublicIds = [];

      mobile.imagePublicIds.forEach((id, i) => {
        if (!imagesToDelete.includes(id)) {
          newImageUrls.push(mobile.imageUrls[i]);
          newImagePublicIds.push(id);
        } else {
          cloudinary.uploader.destroy(id); // no await needed
        }
      });

      mobile.imageUrls = newImageUrls;
      mobile.imagePublicIds = newImagePublicIds;
    }

    // Upload new images
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const { url, public_id } = await uploadToCloudinary(file.buffer);
        mobile.imageUrls.push(url);
        mobile.imagePublicIds.push(public_id);
      }
    }

    // Update fields
    Object.assign(mobile, { brand, model, ram, storage, price, color, condition });

    const updated = await mobile.save();
    res.json(updated);
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
