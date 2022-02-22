require('dotenv').config({ path: 'config/config.env' });

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');
const auth = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

// for checking user
router.get("/", 
  auth, 
  async(req, res) => {
    try{
      const user = await User.findOne( 
        {emailAddress: req.user.emailAddress}
      ).select("-password");
      return res.status(200).json({user:user});
    }catch(err) {
      return res.status(500).json({
        error: err
      });
    };
  }
);

//for logging in to account
router.post("/", 
  [
    check('username', 'Username is required')
      .not()
      .isEmpty(),
    check('password', 'Password is required')
      .not()
      .isEmpty(),  
  ],
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ emailAddress: username });
      if (!user) {
        return res.status(400).json({
          msg: "Invalid credentials",
        })
      }

      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(400).json({
          msg:  "Invalid credentials",
        })
      }
  
      const payload = {
        user: {
          emailAddress: user.emailAddress,
        },
      };

      delete user.password;
      
      jwt.sign(
        payload,
        process.env.JWTSECRET,
        (err, token) => {
          if (err) throw err;
          res.json({token});
        }
      );
    } catch (err) {
      return res.status(500).json({
        error: "Server Error2 " + err,
      });
    }
  }
);


router.post("/create", 
  async(req, res) => {
    try{
      const {
        firstName,
        middleName,
        lastName,
        nameSuffix,
        birthDate,
        type,
        emailAddress,
        password,
        gender,
        mobileNumber
      } = req.body;

      const isExistingUser = await User.findOne({
        firstName,
        middleName,
        lastName,
        birthDate,
        gender
      });

      const isExistingEmail = await User.findOne({emailAddress});

      if(isExistingEmail){
        return res
          .status(400)
          .json(
            {
              success: false,
              message: "Email address already in use"
            }
          );
      } else if(isExistingUser) {
        return res
          .status(400)
          .json(
            {
              success: false,
              message: "User already exists"
            }
          )
      }

      const passwordSalt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt
        .hash(
          req.body.password, 
          passwordSalt
        );
      const user = await User.create(req.body);
      return res
          .status(201)
          .json({
            success: true,
            user
          });
    } catch (err) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Server error: " + err
        })
    };
  }
);

module.exports = router;