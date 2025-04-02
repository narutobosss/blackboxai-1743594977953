require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Lottery = require('./models/Lottery');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Auth Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });
    
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

// Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { name, mobile, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ name, mobile, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) throw new Error('Invalid credentials');
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.get('/api/lotteries', async (req, res) => {
  try {
    const lotteries = await Lottery.find({});
    res.send(lotteries);
  } catch (e) {
    res.status(500).send();
  }
});

app.post('/api/join', auth, async (req, res) => {
  try {
    const { lotteryId } = req.body;
    const user = req.user;
    const lottery = await Lottery.findById(lotteryId);
    
    if (user.wallet < lottery.cost) {
      return res.status(400).send({ error: 'Insufficient balance' });
    }
    
    user.wallet -= lottery.cost;
    user.lotteryEntries.push(lotteryId);
    lottery.participants.push(user._id);
    
    await user.save();
    await lottery.save();
    res.send({ user, lottery });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/api/wallet', auth, async (req, res) => {
  res.send({ balance: req.user.wallet });
});

app.post('/api/topup', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = req.user;
    user.wallet += amount;
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Initialize sample lotteries
const initializeLotteries = async () => {
  const count = await Lottery.countDocuments();
  if (count === 0) {
    await Lottery.insertMany([
      { name: '₹1 Lottery', cost: 1 },
      { name: '₹3 Lottery', cost: 3 },
      { name: '₹5 Lottery', cost: 5 }
    ]);
    console.log('Sample lotteries created');
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeLotteries();
});