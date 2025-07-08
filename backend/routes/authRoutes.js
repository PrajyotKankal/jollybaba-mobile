const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    const allowedAdmins = process.env.ADMIN_EMAILS.split(",").map(e => e.trim());

    if (!allowedAdmins.includes(email)) {
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    }

    const token = jwt.sign({ email, role: "admin", name, picture }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Google Login Failed" });
  }
});

module.exports = router;
