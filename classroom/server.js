const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

// const users = require("./routes/user");
// const posts = require("./routes/post");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session middleware
const sessionOption = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
  };
app.use(session(sessionOption));
app.use(flash());
// app.use("/users", users);
// app.use("/posts", posts);
app.use((req, res, next) =>{
  res.locals.successMsg = req.flash("success")
  res.locals.errorMsg = req.flash("Error")
  next() 
});

app.get("/register", (req, res) => {
  let {name = "anonymous" } = req.query;
  req.session.name = name;
  if(name == "anonymous"){
    req.flash("Error","You  not register!!")
  }else{
  req.flash("success","You register successfullly!!")
  }
  res.redirect("/hello");
});
app.get("/hello", (req, res) => {
  res.render("page.ejs", {name:req.session.name });
});

app.listen(8080, () => {
  console.log("🚀 Server running at http://localhost:8080");
});
