const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const auth = require("./auth.js");

const users = require("./users.js");
const User = users.model;

const gradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  class: String,
  grade: String,
  major: String
});

const Grade = mongoose.model('Grade', gradeSchema);

//Add a grade
router.post('/', auth.verifyToken, User.verify, async (req, res) => {
  const grade = new Grade({
    user: req.user,
    class: req.body.class,
    grade: req.body.grade,
    major: req.body.major
  });
  try {
    await grade.save();
    return res.send(grade);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get my grades
router.get("/", auth.verifyToken, User.verify, async (req, res) => {
  try {
    let grades = await Grade.find({
      user: req.user
    });
    return res.send(grades);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get all grades
router.get("/all/", async (req, res) => {
  try {
    let grades = await Grade.find({});
    return res.send(grades);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// delete a grade
router.delete("/:id", auth.verifyToken, User.verify, async (req, res) => {
  // return photos
  try {
    await Grade.deleteOne({
      _id: req.params.id,
      user: req.user
    });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

//Update a grade
router.put('/:id', auth.verifyToken, User.verify, async (req, res) => {
  try {
    let grade = await Grade.findOne({
      _id: req.params.id,
      user: req.user
    });
    grade.class = req.body.class;
    grade.grade = req.body.grade;
    grade.major = req.body.major;
    grade.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = {
  model: Grade,
  routes: router,
}