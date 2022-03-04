require('dotenv').config({ path: 'config/config.env' });

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');
const auth = require("../middleware/auth");
const User = require("../models/User");
const Project = require("../models/Project");
const Stage = require("../models/Stage");
const Form = require("../models/Form");
const FormItem = require('../models/FormItem');
const { update } = require('../models/User');
const router = express.Router();

router.post("/update/:formId",
  async(req, res) => {
    try{
      const {
        formTitle,
        formSubtitle,
        formItems,
        user
      } = req.body;

      const { formId } = req.params;

      const isExistingFormTitle = await Form.findOne({ formTitle });
      if (isExistingFormTitle) {
        return res
          .status(400)
          .json({
            success: false,
            message: "A form with the same name already exists"
          });
      }
      const form = await Form.findById(formId);

      formItems.forEach((formItem) => {

        formItem.acceptTypes = formItem.acceptTypes.length > 0
          ? formItem.acceptTypes.join(",")
          : "";
        formItem.choices = formItem.choices.length > 0
          ? formItem.choices
          : undefined;
        formItem.createdBy = user._id;
      });


      const newFormItems = await FormItem.insertMany(formItems);
      console.log(newFormItems);

      newFormItems.forEach(newFormItem => {
        form.formItems.push(newFormItem._id);
      });

      form.formTitle = formTitle;
      form.formSubtitle = formSubtitle;
      await form.save();
      return res
        .status(201)
        .json({
          success: true,
          form
        });
    } catch(err){
      return res
        .status(500)
        .json({
          success: false,
          message: "Server error: " + err
        });
    };
  }
);

router.get("/:formId",
  async(req, res) => {
    try{
      const formDetails = await Form.findById(req.params.formId).populate("formItems");
      return res.status(200).json({form:formDetails});
    } catch(err){
      console.log(err);
    }
  }
);



module.exports = router;
