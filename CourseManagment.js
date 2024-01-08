// app.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session');
const app = express();
// Connect to MongoDB
mongoose.connect('mongodb://localhost/your_database_name', {
 useNewUrlParser: true,
 useUnifiedTopology: true,
});
// User Schema
const User = mongoose.model('User', {
 username: String,
 email: String,
Dhanush Intern Project 5
 password: String,
 role: String, // You can expand this to roles array for multip
 lastActivity: Date,
});
// Express Session
app.use(session({
 secret: 'your_secret_key',
 resave: true,
 saveUninitialized: true,
}));
// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
// Passport Local Strategy for authentication
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Routes
app.get('/', (req, res) => {
 res.send('Welcome to User Management System');
});
// Register a new user
app.post('/register', async (req, res) => {
 const { username, email, password } = req.body;
 // Hash password before saving it
 const hashedPassword = await bcrypt.hash(password, 10);
 const newUser = new User({
 username,
 email,
 password: hashedPassword,
 role: 'user',
 lastActivity: new Date(),
 });
 newUser.save((err) => {
 if (err) {
 res.status(500).send('Error registering new user');
 } else {
 res.status(200).send('User registered successfully');
 }
 });
});
// Login endpoint
app.post('/login', passport.authenticate('local'), (req, res) =>
 res.send('Logged in successfully');
});
// Logout endpoint
app.get('/logout', (req, res) => {
 req.logout();
 res.send('Logged out successfully');
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});
