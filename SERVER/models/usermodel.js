const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true},

  email: {  type: String, required: true, unique: true,  lowercase: true },

  password: {type: String,  required: true  },

  role: {type: String,enum: ['user','manager','admin'], default: 'user' },

  // Cloudinary Image URL
  profilePhoto: { type: String,
     default: ""
  },

  // Employee position
  position: { type: String,default: "Remote Employee"
  },

  // Account Status
  isActive: { type: Boolean, default: true
  },

 
timeEntries: [
    {   type: mongoose.Schema.Types.ObjectId,ref: "TimeEntry"
    }
  ],

  createdAt: { type: Date, default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);
