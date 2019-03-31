const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

//
// Grades
//

const gradeSchema = new mongoose.Schema({
  class: String,
  grade: String,
  major: String
});

const Grade = mongoose.model('Grade', gradeSchema);

router.get('/', async (req, res) => {
  try {
    let grades = await Grade.find();
    return res.send(grades);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post('/', async (req, res) => {
  const grade = new Grade({
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

router.delete('/:id', async (req, res) => {
  try {
    await Grade.deleteOne({
      _id: req.params.id
    });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  try {
    let grade = await Grade.findOne({
      _id: req.params.id
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


module.exports = router;
