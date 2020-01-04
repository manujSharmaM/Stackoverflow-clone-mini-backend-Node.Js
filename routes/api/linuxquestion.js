//this route is simmply for assignment prrject purpopse
//In real work i dont think you should be using various types of question model
//Atleast in this case.

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Profile Model
const Profile = require("../../models/Profile");

//Load Question model
const LinuxQuestion = require("../../models/LinuxQuestion");

//@type     : GET
//@route    /api/linuxQuestions
//@desc     route for displaying all linux questions
//@access   PUBLIC
router.get("/", (req, res) => {
  LinuxQuestion.find()
    .sort({ date: "desc" })
    .then(question => res.json(question))
    .catch(err => res.json({ noquestion: "no questions to show" }));
});
//@type     : POST
//@route    /api/linuxQuestions/
//@desc     route for INSERING  linux questions
//@access   PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newquestion = new LinuxQuestion({
      description: req.body.description,
      code: req.body.code,
      error: req.body.error
    });
    newquestion
      .save()
      .then(question => res.json(question))
      .catch(err => console.log("unable to push question to database " + err));
  }
);
//@type     : POST
//@route    /api/linuxQuestions/answers/:id
//@desc     route for answering  linux questions
//@access   PRIVATE
router.post(
  "/answers/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    LinuxQuestion.findById(req.params.id)
      .then(question => {
        const newAnswer = {
          user: req.user.id,
          name: req.body.name,
          answertext: req.body.answertext
        };
        question.answers.unshift(newAnswer);

        question
          .save()
          .then(question => res.json(question))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);
//@type     : POST
//@route    /api/linuxQuestions/comments/:id
//@desc     route for answering  linux questions
//@access   PRIVATE
router.post(
  "/comments/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    LinuxQuestion.findById(req.params.id)
      .then(question => {
        const newComment = {
          user: req.user.id,
          name: req.body.name,
          commentstext: req.body.commentstext
        };
        question.comments.unshift(newComment);

        question
          .save()
          .then(question => res.json(question))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);
//@type     : POST
//@route    /api/linuxQuestions/love/:id
//@desc     route for answering  linux questions
//@access   PRIVATE
router.post(
  "/love/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    LinuxQuestion.findById(req.params.id)
      .then(question => {
        const newLove = {
          user: req.user.id
        };
        question.love.unshift(newLove);

        question
          .save()
          .then(question => res.json(question))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);
module.exports = router;
