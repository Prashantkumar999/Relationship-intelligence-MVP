const mongoose = require("mongoose");

const relationshipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // The owner of this relationship (the one logged in)
    required: true,
  },
  partnerName: {
    type: String,
    required: true, // Name of the other person in the relationship
  },
  relationshipType: {
    type: String,
    enum: ["friend", "partner", "family", "other"],
    default: "partner",
  },
  startDate: {
    type: Date,
  },
  relationshipNotes: {
    type: String, // General user-written notes about this relationship
  },
  moodHistory: [
    {
      date: { type: Date, default: Date.now },
      mood: String,
      sentimentScore: Number,
    },
  ],
});

module.exports = mongoose.model("Relationship", relationshipSchema);
