const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    postedById: {
      type: String,
      required: true,
    },
    postedByName: {
      type: String,
      required: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);