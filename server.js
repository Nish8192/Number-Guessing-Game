// require express
var express = require("express");
// path module
var path = require("path");
// create the express app
var app = express();
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.urlencoded({ extended: true }));
// static content
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//Sets initial value of number to -1
var number_to_guess = -1;
//Creates empty array to store guess log
var guess_history = [];
//Array of prime numbers 1 - 100 to test against for prime number question
var prime_numbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

// root route to render the index.ejs view
app.get('/', (req, res) => {
    res.render("index");
})

//Starts game and chooses random number from 1 - 100
app.get('/start', (req, res) => {
    guess_history = [];
    number_to_guess = Math.floor(Math.random() * (100 - 1 + 1) + 1);
    console.log(number_to_guess);
    return res.render('main', {guess_history: guess_history});
})

app.post('/ask_question', (req, res) => {
    //Ensures that a question type is selected or displays error in guess log
    if (!req.body.question_type) {
        guess_history.push(`Please choose a question type!`);
        return res.render('main', { guess_history: guess_history });
    }

    //Ensures that a valid number is entered if less than or greater than is selected
    if ((req.body.question_type == 'less_than' && isNaN(req.body.less_val)) || (req.body.question_type == 'greater_than' && isNaN(req.body.greater_val)) ){
        guess_history.push(`Please enter a valid number!`);
        return res.render('main', { guess_history: guess_history });
    }

    //Checks if entered value is less than number and adds the result to the guess log
    if (req.body.question_type == 'less_than') {
        if (number_to_guess < req.body.less_val) {
            guess_history.push(`Less than ${req.body.less_val}? TRUE`);
        } else {
            guess_history.push(`Less than ${req.body.less_val}? FALSE`);
        }
    }

    //Checks if entered value is greater than number and adds the result to the guess log
    else if (req.body.question_type == 'greater_than') {
        if (number_to_guess > req.body.greater_val) {
            guess_history.push(`Greater than ${req.body.greater_val}? TRUE`);
        } else {
            guess_history.push(`Greater than ${req.body.greater_val}? FALSE`);
        }
    }

    //Checks if number is even and adds the result to the guess log
    else if (req.body.question_type == 'even') {
        if (number_to_guess % 2 == 0) {
            guess_history.push(`Even? TRUE`);
        } else {
            guess_history.push(`Even? FALSE`);
        }
    }

    //Checks if number is odd and adds the result to the guess log
    else if (req.body.question_type == 'odd') {
        if (number_to_guess % 2 == 1) {
            guess_history.push(`Odd? TRUE`);
        } else {
            guess_history.push(`Odd? FALSE`);
        }
    }

    //Checks if number is divisible by 3 and adds the result to the guess log
    else if (req.body.question_type == 'div_by_three') {
        if (number_to_guess % 3 == 0) {
            guess_history.push(`Divisible by 3? TRUE`);
        } else {
            guess_history.push(`Divisible by 3? FALSE`);
        }
    }

    //Checks if number is prime and adds the result to the guess log
    else if (req.body.question_type == 'prime') {
        if (prime_numbers.includes(parseInt(number_to_guess))) {
            guess_history.push(`Prime? TRUE`);
        } else {
            guess_history.push(`Prime? FALSE`);
        }
    }
    return res.render('main', { guess_history: guess_history });
})

//Checks entered value against number and either displays You WON!! or You LOST :( on new page
app.post('/guess', (req, res) => {
    var result = '';
    if (req.body.guess_val == number_to_guess) {
        result = "You WON!!";
    } else {
        result = "You LOST :(";
    }
    return res.render('result', {result: result});
})

// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("Listening on port 8000");
});


