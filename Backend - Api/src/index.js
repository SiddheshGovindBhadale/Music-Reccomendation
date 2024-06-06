const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(`mongodb+srv://Siddhesh:Siddhesh3341@cluster0.cn61z.mongodb.net/Hi?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
}).then(() => {
  console.log("connection succesful")
}).catch((e) => {
  console.log("No connection with Database !!!")
  console.log(e)
})

// User Model
const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  resetPasswordOTP: String,
});

// Middleware
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cors({
  origin: "*"
}))

// Registration Endpoint
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user with the same email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  // Save the user to the database
  try {
    await newUser.save();
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  // If user not found or password is incorrect
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Successful login
  res.status(200).json({ message: 'Login successful', userData: user });
});



// Generate OTP
const generateOTP = () => {
  return randomstring.generate({
    length: 6,
    charset: 'numeric'
  });
};

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ncddocverify@gmail.com',
    pass: 'xxkw ndrt kfrj xxiy',
  }
});

// Endpoint to initiate forgot password process
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log(email)

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    await user.save();

    const mailOptions = {
      from: 'ncddocverify@gmail.com',
      to: email,
      subject: 'Reset Password OTP',
      text: `Your OTP to reset the password is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send OTP' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to verify OTP and reset password
app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;



  try {
    const user = await User.findOne({ email });
    console.log(`sended otp : ${otp}`)
    console.log(`generated otp : ${user.resetPasswordOTP}`)

    if (!user || user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOTP = null; // Clear OTP after successful reset
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

