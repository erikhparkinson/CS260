<template>
<div>
  <div v-if="user">
    <div>
      <h2>
        {{user.name}} Grade Report
        <a href="#" @click="logout"><i class="fas fa-sign-out-alt"></i></a>
      </h2>
    </div>

    <div>
      <form @submit.prevent="addGrade">
        <input v-model="addedClass" placeholder="Class" class="inputform">
        <select v-model="addedGrade" name="jumpmenu" class="inputform">
          <option>Select Grade</option>
          <option value=A>A</option>
          <option value=A->A-</option>
          <option value=B+>B+</option>
          <option value=B>B</option>
          <option value=B->B-</option>
          <option value=C+>C+</option>
          <option value=C>C</option>
          <option value=C->C-</option>
          <option value=D+>D+</option>
          <option value=D>D</option>
          <option value=D->D-</option>
          <option value=F>F</option>
        </select>
        <select v-model="addedMajor" name="jumpmenu" class="inputform">
          <option>Part of Major?</option>
          <option value=Yes>Yes</option>
          <option value=No>No</option>
        </select>
        <button type="submit" class="inputform">Add Class</button>
        <p v-if="show_error">{{errorMesssage}}</p>
      </form>


      <h3>Class History</h3>
      <div v-for="grade in grades" v-bind:key="grade._id">
        <hr>

        <div v-if="grade._id === editID">
          <form @submit.prevent="saveEdits" class='editSpot'>
            <input v-model="editClass" class='edit_name'>
            <select v-model="editGrade" name="jumpmenu" class='edit_grade'>
              <option value=A>A</option>
              <option value=A->A-</option>
              <option value=B+>B+</option>
              <option value=B>B</option>
              <option value=B->B-</option>
              <option value=C+>C+</option>
              <option value=C>C</option>
              <option value=C->C-</option>
              <option value=D+>D+</option>
              <option value=D>D</option>
              <option value=D->D-</option>
              <option value=F>F</option>
            </select>
            <select v-model="editMajor" name="jumpmenu" class='edit_major'>
              <option value=Yes>Yes</option>
              <option value=No>No</option>
            </select>
            <button type="submit" class='edit_save'>Save Edits</button>
          </form>
        </div>

        <div v-else>
          <div class="gradeSpot">
            <div class="class_name">
              <p>{{grade.class}}</p>
            </div>
            <div class="grade">
              <p>{{grade.grade}}</p>
            </div>
            <div class="major">
              <p>{{grade.major}}</p>
            </div>
            <div class="delete">
              <button @click="deleteGrade(grade._id)" class="delete">Delete</button>
            </div>
            <div class="edit">
              <button @click="startEdit(grade)" class="edit">Edit</button>
            </div>
          </div>
        </div>
      </div>

      <div v-show="grades.length > 0">
        <hr>
        <p>GPA:{{gpa}}</p>
        <p>Major GPA:{{major_gpa}}</p>
      </div>

    </div>

  </div>
  <div v-else class="centered">
    <p>To store your grades, register for an account or login.</p>
    <router-link to="/register" class="pure-button">Register</router-link> or
    <router-link to="/login" class="pure-button">Login</router-link>
  </div>
</div>
</template>

<script>
export default {
  name: 'mygrades',
  data() {
    return {
      addedClass: '',
      addedGrade: 'Select Grade',
      addedMajor: 'Part of Major?',
      editClass: '',
      editGrade: '',
      editMajor: '',
      errorMesssage: '',
      error: '',
      editID: ''
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    grades() {
      return this.$store.state.grades;
    },
    show_error() {
      return this.errorMesssage != '';
    },
    gpa() {
      let total = 0.0;
      let num = 0;
      this.grades.forEach(element => {
        total += this.grade_value(element.grade);
        num += 1;
      });
      if (num === 0) {
        return 0.0;
      } else {
        return (total / num).toPrecision(3);
      }
    },
    major_gpa() {
      let total = 0.0;
      let num = 0;
      this.grades.forEach(element => {
        if (element.major == "Yes") {
          total += this.grade_value(element.grade);
          num += 1;
        }
      });
      if (num === 0) {
        return 'NA';
      } else {
        return (total / num).toPrecision(3);
      }
    },
  },
  created() {
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
    async logout() {
      try {
        this.error = await this.$store.dispatch("logout");
      } catch (error) {
        console.log(error);
      }
    },
    async addGrade() {
      if (this.addedClass === '') {
        this.errorMesssage = 'Error: Input a Class Name!'
      } else if (this.addedGrade === 'Select Grade') {
        this.errorMesssage = 'Error: Select a Grade!'
      } else if (this.addedMajor === 'Part of Major?') {
        this.errorMesssage = 'Error: Choose if this class is part of your major!'
      } else {
        this.errorMesssage = ''
        try {
          const formData = new FormData();
          formData.append('addedClass', this.addedClass);
          formData.append('addedGrade', this.addedGrade);
          formData.append('addedMajor', this.addedMajor);
          this.error = await this.$store.dispatch("addGrade", {
            class: this.addedClass,
            grade: this.addedGrade,
            major: this.addedMajor
          });
          if (!this.error) {
            this.addedClass = "";
            this.addedGrade = "Select Grade";
            this.addedMajor = "Part of Major?";
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    startEdit(grade) {
      this.editID = grade._id;
      this.editClass = grade.class;
      this.editGrade = grade.grade;
      this.editMajor = grade.major;
    },
    async saveEdits() {
      try {
        this.error = await this.$store.dispatch("editGrade", {
          id: this.editID,
          class: this.editClass,
          grade: this.editGrade,
          major: this.editMajor
        });
        if (!this.error) {
          this.editID = '';
          this.editClass = '';
          this.editGrade = '';
          this.editMajor = '';
        }
      } catch (error) {
        console.log(error);
      }
    },
    async deleteGrade(grade_id) {
      try {
        await this.$store.dispatch("deleteGrade", grade_id);
      } catch (error) {
        console.log(error);
      }
    },


  }
}
</script>

<style scoped>
.centered {
  text-align: center;
}

.inputform {
  margin: 20px 20px 20px 20px;
}

/* Grades */
.gradeSpot {
  display: flex;
}

.class_name {
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

.delete {
  flex: 1;
  margin: 10px 10px 10px 10px;
}

.edit {
  flex: 1;
  margin: 10px 10px 10px 10px;
}

/* Edits */
.editSpot {
  display: flex;
}

.edit_name {
  margin: 10px 10px 10px 10px;
  flex: 2;
}

.edit_grade {
  margin: 10px 10px 10px 10px;
  flex: 2;
}

.edit_major {
  margin: 10px 10px 10px 10px;
  flex: 2;
}

.edit_save {
  margin: 10px 10px 10px 10px;
  flex: 2;
}

.pure-button {
  color: red;
  margin: 0px 20px;
}

.header {
  display: flex;
}

.header .button {
  margin-left: 50px;
  order: 2;
}
</style>
