const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Person Mmodel
const Person = require("../../models/Person");

//Load Profile Model
const Profile = require("../../models/Profile");

//@type     : GET
//@route    /api/profile
//@desc     route for individual user profile
//@access   PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Here id is the anchor point
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.status(404).json({ profilenotfound: "no profile found" });
        }
        res.json(profile);
      })
      .catch(err => console.log("got some err in profile " + err));
  }
);
//@type     : POST
//@route    /api/profile
//@desc     route for updating and saving user profile
//@access   PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.username) profileValues.username = req.body.username;
    if (req.body.website) profileValues.website = req.body.website;
    if (req.body.country) profileValues.country = req.body.country;
    if (req.body.portfolio) profileValues.portfolio = req.body.portfolio;
    if (typeof req.body.languages != undefined) {
      profileValues.languages = req.body.languages.split(",");
    }
    //Get social links
    profileValues.social = {};
    if (req.body.youtube) profileValues.social.youtube = req.body.youtube;
    if (req.body.instagram) profileValues.social.instagram = req.body.instagram;
    if (req.body.facebook) profileValues.social.facebook = req.body.facebook;

    //Do database stuffs
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then(profile => res.json(profile))
            .catch(err => console.log("problem in update") + err);
        } else {
          Profile.findOne({ username: profileValues.username })
            .then(profile => {
              //Username already exists
              if (profile) {
                res.status(400).json({ username: "username already exists" });
              }
              //save user
              new Profile(profileValues)
                .save()
                .then(profile => res.json(profile))
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in fetching profile " + err));
  }
);

//@type     : GET
//@route    /api/profile/username/:username
//@desc     route for gettting user profile based on username
//@access   PUBLIC
router.get("/username/:username", (req, res) => {
  Profile.findOne({ username: req.params.username })

    //we are not able to load profilepic and user's name so,
    //Since the Person model and Profile model are interconnected and from user we can
    //fetch the name and profilepic by using the mongoose populate().

    .populate("user", ["name", "profilepic"])
    .then(profile => {
      if (!profile) {
        res.status(404).json({ usernotFound: "User not found" });
      }
      res.json(profile);
    })
    .catch(err => console.log("Error in fetching user profile " + err));
});

//@type     : GET
//@route    /api/profile/find/everyone
//@desc     route for gettting user profile based on id
//@access   PUBLIC
router.get("/find/everyone", (req, res) => {
  Profile.find()

    //we are not able to load profilepic and user's name so,
    //Since the Person model and Profile model are interconnected and from user we can
    //fetch the name and profilepic by using the mongoose populate().

    .populate("user", ["name", "profilepic"])
    .then(profile => {
      if (!profile) {
        res.status(404).json({ usersnotfound: "users not found" });
      }
      res.json(profile);
    })
    .catch(err => console.log("Error in fetching users " + err));
});

//@type     : GET
//@route    /api/profile/userid/:userid
//@desc     route for gettting user profile based on username
//@access   PUBLIC
router.get("/userid/:id", (req, res) => {
  Profile.findOne({ _id: req.params.id })

    //we are not able to load profilepic and user's name so,
    //Since the Person model and Profile model are interconnected and from user we can
    //fetch the name and profilepic by using the mongoose populate().

    .populate("user", ["name", "profilepic"])
    .then(profile => {
      if (!profile) {
        res.status(404).json({ useridnotFound: "Userid not found" });
      }
      res.json(profile);
    })
    .catch(err => console.log("Error in fetching user id " + err));
});

//@type     : DELETE
//@route    /api/profile/delete
//@desc     route for deleting user profile
//@access   PRIVATE
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id });
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        Person.findOneAndRemove({ _id: req.user.id })
          .then(() => res.json({ sucess: "Profile deleted succesfully" }))
          .catch(console.log(err));
      })
      .catch(err =>
        console.log("err in deleting the user maybe user not exsist" + err)
      );
  }
);
//@type     : POST
//@route    /api/profile/workrole
//@desc     route for adding work profile of a person
//@access   PRIVATE
router.post(
  "/workrole",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //if profile not found
        if (!profile) {
        }
        const newWork = {
          role: req.body.role,
          company: req.body.company,
          country: req.body.country,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          details: req.body.details
        };
        profile.workrole.push(newWork);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);
//@type     : DELETE
//@route    /api/profile/workrole/:w_id
//@desc     route for deleting worlrole of user profile
//@access   PRIVATE
router.delete(
  "/workrole/:w_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //assignemnt to check if we got a profile
        const removethis = profile.workrole
          .map(item => item.id)
          .indexOf(req.params.w_id);

        profile.workrole.splice(removethis, 1);

        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

module.exports = router;
