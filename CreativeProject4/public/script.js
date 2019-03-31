var app = new Vue({
  el: '#app',
  data: {
    addedClass: '',
    addedGrade: 'Select Grade',
    addedMajor: 'Part of Major?',
    editClass: '',
    editGrade: '',
    editMajor: '',
    error: '',
    grades: {},
    editID: '',
  },
  created() {
    this.getGrades();
  },
  computed: {
    show_error() {
      return this.error != '';
    },
    gpa() {
      let total = 0.0;
      let num = 0;
      this.grades.forEach(element => {
        total += this.grade_value(element.grade);
        num += 1;
      });
      if(num === 0) {
        return 0.0;
      }
      else {
        return (total/num).toPrecision(3);
      }
    },
    major_gpa() {
      let total = 0.0;
      let num = 0;
      this.grades.forEach(element => {
        if(element.major == "Yes") {
          total += this.grade_value(element.grade);
          num += 1;
        }
      });
      if(num === 0) {
        return 'NA';
      }
      else {
        return (total/num).toPrecision(3);
      }
    },
  },
  methods: {
    grade_value(letter) {
      if(letter === "A") {return 4.0;}
      else if(letter === "A-") {return 3.7;}
      else if(letter === "B+") {return 3.3;}
      else if(letter === "B") {return 3.0;}
      else if(letter === "B-") {return 2.7;}
      else if(letter === "C+") {return 2.3;}
      else if(letter === "C") {return 2.0;}
      else if(letter === "C-") {return 1.7;}
      else if(letter === "D+") {return 1.3;}
      else if(letter === "D") {return 1.0;}
      else if(letter === "D-") {return 0.7;}
      else if(letter === "F") {return 0.0;}
    },
    startEdit(grade) {
      this.editID = grade._id;
      this.editClass = grade.class;
      this.editGrade = grade.grade;
      this.editMajor = grade.major;
      console.log(this.grades.length);
    },
    async saveEdits() {
      try {
        let response = await axios.put("/api/grades/" + this.editID, {
          class: this.editClass,
          grade: this.editGrade,
          major: this.editMajor
        });
        this.editID = '';
        this.editClass = '';
        this.editGrade = '';
        this.editMajor = '';
        this.getGrades();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async getGrades() {
      try {
        let response = await axios.get("/api/grades");
        this.grades = response.data;
        var editing = [];
        this.grades.forEach(function(element) {
          editing.push(false);
        });
        this.editing = editing;
      } catch (error) {
        console.log(error);
      }
    },
    async addGrade() {
      if(this.addedClass === '') {
        this.error = 'Error: Input a Class Name!'
      }
      else if(this.addedGrade === 'Select Grade') {
        this.error = 'Error: Select a Grade!'
      }
      else if(this.addedMajor === 'Part of Major?') {
        this.error = 'Error: Choose if this class is part of your major!'
      }
      else {
        this.error = ''
        try {
          let response = await axios.post("/api/grades", {
            class: this.addedClass,
            grade: this.addedGrade,
            major: this.addedMajor
          });
          this.addedClass = "";
          this.addedGrade = "Select Grade";
          this.addedMajor = "Part of Major?";
          this.getGrades();
        } catch (error) {
          console.log(error);
        }
      }
    },
    async deleteGrade(grade) {
      try {
        let response = axios.delete("/api/grades/" + grade._id);
        this.getGrades();
      } catch (error) {
        console.log(error);
      }
    }
  }
});
