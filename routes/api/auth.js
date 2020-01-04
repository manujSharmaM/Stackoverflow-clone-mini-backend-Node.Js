const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/myurl");

router.get("/", (req, res) => {
  res.json({ test: "Auth is success" });
});

//IMMPORT schema for  Person to Register
const Person = require("../../models/Person");

//@type     : POST
//@route    /api/auth/register
//@desc     route for registration of users
//@access   PUBLIC
router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then(test => {
      //just a callback from the database. it can be named anything
      //like test or person which is used by hitesh.
      if (test) {
        return res
          .status(400)
          .json({ emailerror: "Email is already registered in our system" });
      } else {
        const newPerson = Person({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          gender: req.body.gender
        });
        //Encrypt password using bcrypt
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPerson.password, salt, (err, hash) => {
            if (err) throw err;
            newPerson.password = hash;
            // Store hash in your password DB.
            newPerson
              .save()
              .then(person => res.json(person))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
});

//@type     : POST
//@route    /api/auth/login
//@desc     route for login of users
//@access   PUBLIC
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Person.findOne({ email })
    //check whether is user is available in the database or not

    .then(person => {
      //The person here is a just a callback from the database
      //so we use callback function.
      if (!person) {
        return res
          .status(404)
          .json({ emailerror: "User is not found with this email" });
      }
      //If user is found then, compare the password
      bcrypt
        .compare(password, person.password) //the password is from user and person.password is from the database.
        .then(isCorrect => {
          if (isCorrect) {
            // res.json({ sucess: "User is logged in successfully" });
            //Use payload and credate token for user
            const payload = {
              id: person.id,
              name: person.name,
              email: person.email
            };
            jwt.sign(
              payload,
              key.secret,
              { expiresIn: "1hr" },
              (err, token) => {
                if (err) throw err;
                res.json({
                  sucess: true,
                  token: "Bearer " + token
                });
                res.json({
                  sucess: false,
                  token: "nothing"
                });
              }
            );
          } else {
            res.status(400).json({ passworderr: "Password is not correct" });
          }
        })
        .catch(err => console.log(err));
    })
    //iF some err
    .catch(err => console.log(err));
});

//@type     : GET
//@route    /api/auth/profile
//@desc     route for profile of users
//@access   PRIVATE
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //The jsonexctractor extracted all the things in a big gigantic jsonobject
    // and inside the user obj we have our req details.So using the user we get the details
    console.log(req);
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profilepic: req.user.profilepic,
      gender: req.user.gender
    });
  }
);

module.exports = router;
