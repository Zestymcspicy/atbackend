const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/users");
const tasks = require("./routes/tasks");

const app = express();

// body parser middleware
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

const db = require("./config/secret.js").mongoURI;

mongoose.connect(db, {
  useNewUrlParser:true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB successfully connected"))
.catch(err => console.log(err));

app.use(passport.initialize());
require("./config/passport")(passport);
app.use("/users", users)
app.use("/tasks", tasks)
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up on ${port}`));
