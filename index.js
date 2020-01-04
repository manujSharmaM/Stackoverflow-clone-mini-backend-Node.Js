const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");
const app = express();

//mimddleware for body-parser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//bring all routes
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const question = require("./routes/api/question");
const linuxquestion = require("./routes/api/linuxquestion");
const answer = require("./routes/api/answer");

//mongodb configuration
const db = require("./setup/myurl").mongoURL;

const port = process.env.PORT || 3000;
//test route
app.get("/", (req, res) => {
  res.send("Hellow world");
});

//attempt to connect to database
mongoose
  .connect(db)
  .then(() => console.log("momngo db connected succesfully"))
  .catch(err => console.log(err));

//Passportr middleware
app.use(passport.initialize());

//Config for  JWT Strategy
require("./strategies/jsonwtStrategy")(passport);

//actual route
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/question", question);
app.use("/api/linuxquestion", linuxquestion);
app.use("/api/answer", answer);

app.listen(port, () => console.log(`App is runnnign at ${port}`));
