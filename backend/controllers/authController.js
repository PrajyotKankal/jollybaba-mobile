const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    const role = ADMIN_EMAILS.includes(email) ? 'admin' : 'user';

    const token = jwt.sign(
      { email, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, role, email });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ message: 'Invalid Google Login' });
  }
};
