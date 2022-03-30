require('dotenv').config({ path: 'config/config.env' });

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');
const Form = require("../models/Form");
const FormItem = require('../models/FormItem');
const FormEntry = require('../models/FormEntry');
const { update } = require('../models/User');
const router = express.Router();

router.post("/update/:formId",
  async(req, res) => {
    try {
      const {
        formTitle,
        formSubtitle,
        formItems,
        user
      } = req.body;
      console.log(user);
      const { formId } = req.params;
      const isExistingFormTitle = await Form.findOne({ formTitle });
      if (isExistingFormTitle && !isExistingFormTitle._id.equals(formId)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "A form with the same name already exists"
          });
      }
      const form = await Form.findById(formId);
      const newFormItems = await Promise.all(
        formItems.map(
          async(formItem) => {
            return await FormItem.findOneAndUpdate(
              { uuid : formItem.uuid },
              {
                ...formItem,
                acceptTypes: formItem.acceptTypes?.length > 0
                  ? formItem.acceptTypes
                  : undefined,
                choices: formItem.choices?.length > 0
                  ? formItem.choices
                  : undefined,
                createdBy: user._id,
              },
              {
                upsert: true,
                new: true,
              }
            )
          }
        )
      );
      console.log(newFormItems);
      form.formItems = newFormItems.map(formItem => formItem._id);
      form.formTitle = formTitle;
      form.formSubtitle = formSubtitle;
      await form.save();
      return res
        .status(201)
        .json({
          success: true,
          form
        });
    } catch(err) {
      console.log(err);
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
    try {
      const formDetails = await Form
        .findById(req.params.formId)
        .populate("formItems");
      return res
        .status(200)
        .json( {form:formDetails} );
    } catch(err) {
      console.log(err);
    }
  }
);


router.post("/answers/save/:formId",
  async(req, res) => {
    try {
      const { answers } = req.body;
      const formId = req.params.formId;

      const entryObj = {
        formId,
        answers: [...answers],
      };
      const newEntry = await FormEntry.create(entryObj);
      const existingForm = await Form.findById(formId);
      await existingForm.formEntries.push(newEntry._id);
      await existingForm.save();
      return res
        .status(201)
        .json({
          success: true,
          newEntry
        });
    } catch(err) {
      return res
        .status(500)
        .json({
          success:false,
          message: "Server error: " + err
        });
    }
  }
);

router.get("/toggle-publish/:formId",
  async(req, res) => {
    try {
      const form = await Form
        .findById(req.params.formId);
      form.isPublished = form.isPublished === "Yes" ? "No" : "Yes";
      await form.save();
      return res
        .status(200)
        .json( {form:form} );
    } catch(err) {
      console.log(err);
    }
  }
);

router.get("/publish/:formId",
  async(req, res) => {
    try {
      const form = await Form
        .findById(req.params.formId);
      form.isPublished = "Yes";
      await form.save();
      return res
        .status(200)
        .json( {form:form} );
    } catch(err) {
      console.log(err);
    }
  }
);

router.get("/unpublish/:formId",
  async(req, res) => {
    try {
      const form = await Form
        .findById(req.params.formId);
      form.isPublished = "No";
      await form.save();
      return res
        .status(200)
        .json( {form:form} );
    } catch(err) {
      console.log(err);
    }
  }
);

module.exports = router;
