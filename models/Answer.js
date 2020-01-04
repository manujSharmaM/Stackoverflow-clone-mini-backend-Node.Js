const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Answer Schema
const AnswerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
  answers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "myPerson"
      },
      answertext: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ]
});
module.exports = Answer = mongoose.model("myAnswer", AnswerSchema);
