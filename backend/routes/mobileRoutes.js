require('dotenv').config();

const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const Mobile = require('../models/Mobile');
const verifyAdmin = require('../middlewares/verifyAdmin');
const Counter = require('../models/Counter');


// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer: In-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Helper: Upload single buffer to Cloudinary
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

// 🔢 Generate next unique mobile ID like MBL-0001
const getNextMobileId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'mobileId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return `MBL-${counter.value.toString().padStart(4, '0')}`;
};


// ✅ Upload Multiple Images Route
router.post('/upload', verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const { brand, model, ram, storage, price, color } = req.body;

    const imageUrls = [];
    const imagePublicIds = [];

    for (const file of req.files) {
      const { url, public_id } = await uploadToCloudinary(file.buffer);
      imageUrls.push(url);
      imagePublicIds.push(public_id);
    }

    const mobileId = await getNextMobileId(); // 🆕 Generate unique ID

    const newMobile = new Mobile({
      brand,
      model,
      ram,
      storage,
      price,
      color,
      imageUrls,
      imagePublicIds,
      mobileId, // 🆕 Save it
    });

    await newMobile.save();
    res.status(201).json(newMobile);
  } catch (err) {
    console.error('❌ Upload Route Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// ✅ Get All Mobiles
router.get('/', async (req, res) => {
  try {
    const mobiles = await Mobile.find().sort({ createdAt: -1 });
    res.json(mobiles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete Mobile with Cloudinary Cleanup
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id);
    if (!mobile) return res.status(404).json({ message: 'Mobile not found' });

    if (mobile.imagePublicIds && mobile.imagePublicIds.length > 0) {
      for (const publicId of mobile.imagePublicIds) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await mobile.deleteOne();
    res.json({ message: 'Mobile and images deleted successfully' });
  } catch (err) {
    console.error('❌ Delete Mobile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update Mobile (replace images if new provided)
router.put('/:id', verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const mobile = await Mobile.findById(id);
    if (!mobile) return res.status(404).json({ message: 'Mobile not found' });

    let {
      brand,
      model,
      ram,
      storage,
      price,
      color,
      imagesToDelete // this will be a JSON stringified array from frontend
    } = req.body;

    imagesToDelete = imagesToDelete ? JSON.parse(imagesToDelete) : [];

    // 1. Remove selected images
    if (imagesToDelete.length > 0) {
      const newImageUrls = [];
      const newImagePublicIds = [];

      mobile.imagePublicIds.forEach((id, index) => {
        if (!imagesToDelete.includes(id)) {
          newImagePublicIds.push(id);
          newImageUrls.push(mobile.imageUrls[index]);
        } else {
          cloudinary.uploader.destroy(id); // async cleanup
        }
      });

      mobile.imagePublicIds = newImagePublicIds;
      mobile.imageUrls = newImageUrls;
    }

    // 2. Upload new images if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { url, public_id } = await uploadToCloudinary(file.buffer);
        mobile.imageUrls.push(url);
        mobile.imagePublicIds.push(public_id);
      }
    }

    // 3. Update other fields
    mobile.brand = brand;
    mobile.model = model;
    mobile.ram = ram;
    mobile.storage = storage;
    mobile.price = price;
    mobile.color = color;

    const updatedMobile = await mobile.save();
    res.json(updatedMobile);
  } catch (err) {
    console.error('❌ Update Mobile Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



// ✅ Get Single Mobile by ID
router.get('/:id', async (req, res) => {
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
});

module.exports = router;



