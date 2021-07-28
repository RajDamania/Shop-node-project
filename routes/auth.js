const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a valid email")
      .normalizeEmail(),

    body("password", "Password not valid").isLength({ min: 3 }).trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please Enter a valid email")

      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email is already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Please enter a valid Password atleast 5 characters")
      .isLength({ min: 3 })
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password not matching");
        }
        return true;
      }),
  ],
  // .custom((value, { req }) => {
  //   if (value === "test@t.com") {
  //     throw new Error("This email address will not work");
  //   }
  //   return true;
  // }),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

// router.get("/new-password", authController.getNewPassword);

module.exports = router;
