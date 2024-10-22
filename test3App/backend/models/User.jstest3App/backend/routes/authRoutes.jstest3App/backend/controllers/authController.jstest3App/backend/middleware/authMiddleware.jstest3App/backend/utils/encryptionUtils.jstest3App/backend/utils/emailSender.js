// test3App/backend/models/User.js

const { Model, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static init(sequelize) {
    super.init({
      email: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        unique: true, 
        validate: { isEmail: true } 
      },
      password: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: false,
    });
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async validatePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

module.exports = User;

// test3App/backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;

// test3App/backend/controllers/authController.js

const User = require('../models/User');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('test3App', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await User.hashPassword(password);
    const user = await User.create({ email, password: hashedPassword });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// test3App/backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// test3App/backend/utils/encryptionUtils.js

const bcrypt = require('bcrypt');

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// test3App/backend/utils/emailSender.js

const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};
