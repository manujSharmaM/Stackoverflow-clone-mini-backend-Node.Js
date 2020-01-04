const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//LinuxQuestion Schema
const LinuxQuestionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },

  //There are three parts of a linux based question and they are
  //DESC , CODE and ERR
  description: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  error: {
    type: String,
    required: true
  },

  upvotes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "myPerson"
      }
    }
  ],

  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "myPerson"
      },
      name: {
        type: String,
        required: true
      },
      commentstext: {
        type: String,
        required: true
      }
    }
  ],

  love: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "myPerson"
      }
    }
  ],
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
        type: String
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ],

  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = LinuxQuestion = mongoose.model(
  "myLinuxQuestion",
  LinuxQuestionSchema
);
