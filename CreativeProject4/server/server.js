const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// app.use(express.static('../public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/grades', {
  useNewUrlParser: true
});

const grades = require("./grades.js");
app.use("/api/grades", grades);

app.listen(3000, () => console.log('Server listening on port 3000!'));
