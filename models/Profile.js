const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//This profile section allows user to describe themselves by filling it.
const ProfileSchema = new Schema({
  //using anchor point
  //like we created routes previously for login , profile etc...\
  //and using the same we will create for profile,questions etc..

  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
  username: {
    type: String,
    required: true,
    max: 50
  },
  website: {
    type: String
  },
  country: {
    type: String
  },
  languages: {
    type: [String],
    required: true
  },
  portfolio: {
    type: String
  },
  workrole: [
    {
      role: {
        type: String,
        required: true
      },
      company: {
        type: String
      },
      country: {
        type: String
      },
      from: {
        type: Date
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      details: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("myProfile", ProfileSchema);
