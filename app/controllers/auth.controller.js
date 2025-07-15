const config = require("../config/auth.config");
const { ObjectId } = require('mongodb');
const db = require("../models");
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");



exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
  }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });
  res.cookie('auth_token', token, { httpOnly: true, secure: false, sameSite: 'strict' });
  res.json({
          id: user._id,
          username: user.username,
          email: user.email,
          profile_picture: user.profile_picture,
          message: 'Login successful'
        });
};

exports.signout = async (req, res) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Logged out' });
};
exports.profile = async (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      res.json({ message: 'Welcome!', userId: decoded.userId });
  });
};