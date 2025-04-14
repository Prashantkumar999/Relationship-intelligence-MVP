const mongoose = require("mongoose");

const voiceLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  audioUrl: {
    type: String,
    required: true, // This will be the URL/path to the uploaded audio file
  },
  transcript: {
    type: String, // AI-generated or whisper-transcribed text
  },
  mood: {
    type: String, // e.g., "happy", "sad", "angry"
  },
  sentimentScore: {
    type: Number, // e.g., between -1 (negative) to 1 (positive)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("VoiceLog", voiceLogSchema);
