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
const router = express.Router();





router.post("/create",
  async(req, res) => {
    try{
      const {
        projectName,
        stages,
        user
      } = req.body;

      const isExistingProjectName = await Project.findOne({ projectName });
      if (isExistingProjectName) {
        return res
          .status(400)
          .json(
            {
              success: false,
              message: "A project with the same name already exists"
            }
          );
      }
      const form = await Form.create({
        createdBy: user._id
      });
      const project = await Project.create({
        projectName,
        formId: form._id,
        createdBy: user._id
      });
      const tempStages = stages.map(stage => {
        return {
          stageName: stage,
          projectId: project._id,
        }
      })
      const newStages = await Stage.insertMany(tempStages);
      newStages.forEach(newStage => {
        project.stages.push(newStage._id);
      });
      await project.save();
      return res
        .status(201)
        .json({
          success: true,
          project
        });
    } catch (err) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Server error: " + err
        });
    };
  }
);








module.exports = router;
