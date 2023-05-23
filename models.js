const mongoose = require("mongoose");

const DiceOutcomeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  dice_value: {
    type: Number,
    required: true,
  },
  total_dice_value: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("dicegame", DiceOutcomeSchema);
