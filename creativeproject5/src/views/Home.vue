<template>
<div class="home">
  <h2>Average Grades in Classes</h2>
  <p class="stylish">so you know which classes to avoid...</p>
  <div class="classSpot">
    <div class="name bold">
      Class
    </div>
    <div class="grade bold">
      Average Grade
    </div>
    <div class="major bold">
      Average Grade Among Majors
    </div>
    <div class="personal bold" v-show="user">
      Your Grade
    </div>

  </div>
  <div v-for="gpa in classesGPA" v-bind:key="gpa._id" class="classSpot" v-bind:class="{'red':gpa.warn}">
    <div class="name">
      {{gpa.name}}
    </div>
    <div class="grade">
      {{gpa.gpa}}
    </div>
    <div class="major">
      {{gpa.majorGPA}}
    </div>
    <div class="personal" v-show="user">
      {{gpa.personalGrade}}
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'home',
  computed: {
    user() {
      return this.$store.state.user;
    },
    personalGrades() {
      return this.$store.state.grades;
    },
    grades() {
      return this.$store.state.allGrades;
    },
    classesGPA() {
      const classes = this.grades.map(grade => grade.class);
      const distinctClasses = [...new Set(classes)];
      let gpas = [];
      let my_grades = this.personalGrades;
      let these_grades = this.grades;
      let grade_value = this.grade_value;
      let letter_grade = this.letter_grade;
      distinctClasses.sort()
      distinctClasses.forEach(function(class_) {
        var curr_classes = these_grades.filter(function(grade) {
          return grade.class === class_;
        });
        var major_classes = curr_classes.filter(function(grade) {
          return grade.major === "Yes";
        });
        const currGrades = curr_classes.map(class_ => grade_value(class_.grade));
        const majorGrades = major_classes.map(class_ => grade_value(class_.grade));
        var totalScore = currGrades.reduce(function(acc, score) {
          return acc + score;
        }, 0);
        var majorScore = majorGrades.reduce(function(acc, score) {
          return acc + score;
        }, 0);
        let gpa = letter_grade(totalScore / currGrades.length);
        if (majorGrades.length > 0) {
          var major_gpa = letter_grade(majorScore / majorGrades.length);
        } else {
          major_gpa = "N/A";
        }

        const my_class = my_grades.filter(function(grade) {
          return grade.class === class_;
        });
        if (my_class.length > 0) {
          var personal = my_class[0].grade;
        } else {
          personal = "N/A";
        }

        gpas.push({
          name: class_,
          gpa: gpa,
          majorGPA: major_gpa,
          personalGrade: personal,
          warn: totalScore / currGrades.length < 2.7
        })
      });

      return gpas;
    },
  },
  created() {
    this.$store.dispatch("getAllGrades");
    this.$store.dispatch("getUser");
    this.$store.dispatch("getGrades");
  },
  methods: {
    grade_value(letter) {
      if (letter === "A") {
        return 4.0;
      } else if (letter === "A-") {
        return 3.7;
      } else if (letter === "B+") {
        return 3.3;
      } else if (letter === "B") {
        return 3.0;
      } else if (letter === "B-") {
        return 2.7;
      } else if (letter === "C+") {
        return 2.3;
      } else if (letter === "C") {
        return 2.0;
      } else if (letter === "C-") {
        return 1.7;
      } else if (letter === "D+") {
        return 1.3;
      } else if (letter === "D") {
        return 1.0;
      } else if (letter === "D-") {
        return 0.7;
      } else if (letter === "F") {
        return 0.0;
      }
    },
    letter_grade(value) {
      if (value === 4.0) {
        return "A";
      } else if (value >= 3.7) {
        return "A-";
      } else if (value >= 3.3) {
        return "B+";
      } else if (value >= 3.0) {
        return "B";
      } else if (value >= 2.7) {
        return "B-";
      } else if (value >= 2.3) {
        return "C+";
      } else if (value >= 2.0) {
        return "C";
      } else if (value >= 1.7) {
        return "C-";
      } else if (value >= 1.3) {
        return "D+";
      } else if (value >= 1.0) {
        return "D";
      } else if (value >= 0.7) {
        return "D-";
      } else if (value >= 0.0) {
        return "F";
      }
    },

  }

}
</script>

<style scoped>
.bold {
  font-weight: bold;
  text-decoration: underline;
}

/* Grades */
.classSpot {
  display: flex;
}

.name {
  flex: 2;
  margin: 10px 10px 10px 10px;
}

.grade {
  flex: 2;
  margin: 10px 10px 10px 10px;
}

.major {
  flex: 2;
  margin: 10px 10px 10px 10px;
}

.personal {
  flex: 2;
  margin: 10px 10px 10px 10px;
}

.stylish {
  font-family: fantasy;
  font-style: italic;
  margin: 10px 10px 10px 10px;
}

.red {
  color: red;
}
</style>
