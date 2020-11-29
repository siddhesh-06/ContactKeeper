const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
//init router
const router = express.Router();

//import model
const User = require('../models/User');
const Contacts = require('../models/Contacts');

//@route    GET api/contacts
//@desc     Get all users contacts
//@access   private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contacts.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route    POST api/contacts
//@desc     Add new contact
//@access   private
router.post(
  '/',
  [auth, [check('name', 'Name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }).send();
    }
    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contacts({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

//@route    PUT api/contacts/:id
//@desc     update contact
//@access   private
router.put('/:id', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, phone, type, user } = req.body;
  try {
    const contact = await Contacts.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          email,
          phone,
          type,
          user,
        },
      },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

//@route    DELETE api/contacts/:id
//@desc     delete contact
//@access   private
router.delete('/:id', async (req, res) => {
  try {
    await Contacts.findByIdAndDelete(req.params.id);
    res.send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
