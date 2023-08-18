const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("./schema.cjs");

async function login(req, res) {
  const { email, password } = req.body;
  try {
    // const concernedUser = users.find((elm) => elm.email === email);
    const concernedUser = await User.findOne({ email });
    if (!concernedUser) throw new Error("Invalid Email or Password");

    //   throw new Error("Incorrect password");
    const dbPassword = concernedUser.password;
    bcrypt.compare(password, dbPassword, (err, result) => {
      // for some reason, throwing error did not go outside to the catch block
      if (err || !result)
        return res
          .status(400)
          .json({ status: "failure", message: "Incorrect Password" });
      // if no error, then make the token
      const token = jwt.sign({ email, password }, process.env.JWT_SECRET, {
        expiresIn: "1h", //
      });
      // mongoose query returns mongoose documents, they are not plain JS objects, so convert them using toObject() if you want to use spread operator
      return res.status(200).json({
        status: "success",
        data: { username: concernedUser.username, token },
      });
    });
  } catch (err) {
    res.status(400).json({ status: "failure", message: err.message });
  }
}

async function signup(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({
      username,
    });

    if (existingEmail) throw new Error("User with this email already exists");

    if (existingUsername) throw new Error("Username already exists");

    await User.create({ username, email, password });

    // make a token before sending the response
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      status: "success",
      message: "User signed up successfully.",
      // No use of sending email back
      data: { username, token },
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
}
function authorizeToken(req, res, next) {
  const requestToken = req.headers.authorization;
  if (!requestToken)
    return res.status(401).json({
      status: "failure",
      message: "You don't have access to chat",
    });
  try {
    jwt.verify(requestToken, process.env.JWT_SECRET);
    next();
  } catch (error) {
    // console.log(error);
    res.status(403).json({ status: "failure", message: "Invalid token" });
  }
}

module.exports = {
  login,
  signup,
  authorizeToken,
};
