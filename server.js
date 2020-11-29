const express = require('express');
const connectDB = require('./config/db');
const users = require('./routes/users');
const contacts = require('./routes/contacts');
const auth = require('./routes/auth');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

//Connect database
connectDB();

//init middleware
app.use(express.json({ extended: false }));

//API routes

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/contacts', contacts);

//Serve Static assets in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolved(__dirname, 'client', 'client', 'build', 'index.html')
    )
  );
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
