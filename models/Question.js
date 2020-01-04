const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Quesdstion Schema
const QuestionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },

  //1.question to be divided into two text
  //text 1 has a string and text 2 is the code part and also need to grab the username as well
  //2.Create an array fofr upvotes , in array put user id
  //3.Comment array in that also usere id to be put
  //4.date field

  textone: {
    type: String,
    required: true
  },

  texttwo: {
    type: String,
    required: true
  },
  name: {
    type: String
  },

  upvotes: [
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

module.exports = Question = mongoose.model("myQuestion", QuestionSchema);
