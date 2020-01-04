const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Answer model
const Answer = require("../../models/Answer");

//@type     : POST
//@route    /api/answers/:id
//@desc     route for SUBMITTING question's answer
//@access   PRIVATE
router.post(
  "/linuxans/:id",
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
//@route    /api/answers/:id
//@desc     route for SUBMITTING question's answer
//@access   PRIVATE
router.post(
  "/quesans/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findById(req.params.id)
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

module.exports = router;
