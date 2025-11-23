const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  date: {
    type: Date,
    required: true,
    default: () => new Date().setHours(0, 0, 0, 0) // stores only the day
  },

  checkIn: {
    type: Date,
    required: true
  },

  checkOut: {
    type: Date,
    default: null
  },

  totalHours: {
    type: Number,
    default: 0 // calculated as (checkOut - checkIn) in hours
  },

  status: {
    type: String,
    enum: ['present', 'absent', 'half-day'],
    default: 'present'
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
