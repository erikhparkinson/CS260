var app = new Vue({
  el: '#app',
  data: {
    answer: '',
    correct: 0,
    feedback: '',
    max_num: 12,
    number1: 0,
    number2: 0,
    symbol: 'x',
    start: false,
  },

  computed: {
    correct_answer() {
      if(this.symbol === 'x') {
        return (this.number1 * this.number2).toString();
      }
      else if(this.symbol === '+') {
        return (this.number1 + this.number2).toString();
      }
      else {
        return (this.number1 - this.number2).toString();
      }
    },
    notStarted() {
      return !this.start;
    },
  },
  methods: {
    startTest() {
      this.start = true;
      this.generateProblem();
    },
    nextQuestion() {
      this.correct = 0;
      this.feedback = '';
      this.answer = '';
      this.generateProblem();
    },
    checkAnswer() {
      if (this.answer === this.correct_answer) {
        this.correct = true;
        this.feedback = 'You got it!';
      }
      else {
        this.correct = false;
        this.feedback = 'Nope!';
      }
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * (Math.floor(max)+1));
    },
    getRandomSymbol() {
      var num = Math.random();
      if(num < 1/3) {
        return '+';
      }
      else if(num > 2/3) {
        return '-';
      }
      else {
        return 'x';
      }
    },
    generateProblem() {
      this.number1 = this.getRandomInt(this.max_num);
      this.number2 = this.getRandomInt(this.max_num);
      this.symbol = this.getRandomSymbol();
    },
  }
});
