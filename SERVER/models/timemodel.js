const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  task: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task', 
    default: null
  },

  start: { 
    type: Date, 
    required: true 
  },

  end: { 
    type: Date, 
    default: null
  },

  durationMinutes: { 
    type: Number, 
    default: 0   // Computed automatically when stopped
  },

  notes: { 
    type: String, 
    default: "" 
  },

  // 🕒 Auto ping support
  lastPing: { 
    type: Date, 
    default: Date.now 
  },

  // 🔄 Status tracking
  status: { 
    type: String, 
    enum: ['active', 'idle', 'stopped'], 
    default: 'active' 
  }
}, 
{ 
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
