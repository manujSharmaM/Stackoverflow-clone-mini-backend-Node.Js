const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Person Mmodel
const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

//Load Question model
const Question = require("../../models/Question");

//@type     : GET
//@route    /api/questions
//@desc     route for displaying all questions
//@access   PUBLIC
router.get("/", (req, res) => {
  Question.find()
    .sort({ date: "desc" })
    .then(question => res.json(question))
    .catch(err => res.json({ noquestion: "no questions to show" }));
});

//@type     : POST
//@route    /api/questions/
//@desc     route for SUBMITTING questions
//@access   PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newQuestion = new Question({
      textone: req.body.textone,
      texttwo: req.body.texttwo,
      user: req.user.id,
      name: req.body.name
    });
    newQuestion
      .save()
      .then(question => res.json(question))
      .catch(err => console.log("unable to push question to database " + err));
  }
);

// //@type     : POST
// //@route    /api/answers/:id
// //@desc     route for SUBMITTING question's answer
// //@access   PRIVATE
// router.post(
//   "/answers/:id",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     Question.findById(req.params.id)
//       .then(question => {
//         const newAnswer = {
//           user: req.user.id,
//           name: req.body.name,
//           answertext: req.body.answertext
//         };
//         question.answers.unshift(newAnswer);

//         question
//           .save()
//           .then(question => res.json(question))
//           .catch(err => console.log(err));
//       })
//       .catch(err => console.log(err));
//   }
// );

// @type    POST
//@route    /api/question/upvote/:id
// @desc    route for for upvoting
// @access  PRIVATE
router.post(
  "/upvote/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Question.findById(req.params.id)
          .then(question => {
            if (
              question.upvotes.filter(
                upvote => upvote.user.toString() === req.user.id.toString()
              ).length > 0
            ) {
              //return res.status(400).json({ noupvote: "User already upvoted" });
              //remove the upvote if pressed again upvote// assignment no 1
              question.upvotes.pop({ user: req.user.id });
              question
                .save()
                .then(question => res.json(question))
                .catch(err => console.log(err));
            } else {
              //count the upvotes by user
              question.upvotes.push({ user: req.user.id });
              question
                .save()
                .then(question => res.json(question))
                .catch(err => console.log(err));
            }
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);
//@type     : DELETE
//@route    /api/question/:id
//@desc     route for deleting questions
//@access   PRIVATE
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findOneAndRemove({ _id: req.params.id })
      .then(question => res.json(question))
      .catch(err =>
        console.log("err in deleting the user maybe user not exsist" + err)
      );
  }
);
//@type     : DELETE
//@route    /api/question/
//@desc     route for deleting all questions
//@access   PRIVATE
//do it later as it's a bizzare feature to have.

//GONNA DO ENTIRE ROUTE FOR LINUX QUESTIONS
//Create a seperate route fot lunux questions
//Three parts of quesrions i.e desc , code and error.
//There should be question ,upvote,comment ,love and answers

module.exports = router;
