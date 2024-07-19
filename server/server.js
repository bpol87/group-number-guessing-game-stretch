const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5001;

// This must be added before GET & POST routes.
app.use(bodyParser.urlencoded({extended:true}))

// Serve up static files (HTML, CSS, Client JS)
app.use(express.json());
app.use(express.static('server/public'));

let randomNumber = require('./randomNumber.js');

let min = 1;
let max = 25;
let randomRange = {
  min: min,
  max: max
}
 
let randomRoundNumber = randomNumber(min, max);
let roundGuesses = [];

console.log('Random number is:', randomRoundNumber);

function roundCompare(req) {
  let tomsRoundGuess = Number(req.tomsGuess);
  let bensRoundGuess = Number(req.bensGuess);

  if (tomsRoundGuess > randomRoundNumber) {
req.tomsResult = 'over';
  } else if (tomsRoundGuess < randomRoundNumber) {
    req.tomsResult = 'under';
  } else if (tomsRoundGuess === randomRoundNumber) {
req.tomsResult = 'exact';
 } 

 if (bensRoundGuess > randomRoundNumber) {
  req.bensResult = 'over';
    } else if (bensRoundGuess < randomRoundNumber) {
      req.bensResult = 'under';
    } else if (bensRoundGuess === randomRoundNumber) {
  req.bensResult = 'exact';
   }

}

// GET & POST Routes go here
app.post('/round', (req, res) => {
console.log('\treq.body is:', req.body)

roundCompare(req.body);

roundGuesses.push(req.body);
console.log('roundGuesses is now:', roundGuesses);

res.sendStatus(201);
})

app.get('/round', (req, res) => {
  console.log('GET /round received a request!');
  res.send(roundGuesses);
})

app.post('/reset', (req, res) => {
  console.log('\treq.body is:', req.body)
  
  roundGuesses = [];
  console.log('random number is:', randomRoundNumber);
  randomRoundNumber = randomNumber(min, max);
  console.log('the new random number is:', randomRoundNumber);
  
  res.sendStatus(201);
  })

app.post('/newMinMax', (req, res) => {
  console.log(req.body)
  min = Number(req.body.min);
  max = Number(req.body.max);


  randomRange = {min: min, max: max};

  console.log('random number is:', randomRoundNumber);
  randomRoundNumber = randomNumber(min, max);
  console.log('the new random number is:', randomRoundNumber);
  
  res.sendStatus(201);
  })

app.get('/newMinMax', (req, res) => {
  console.log('GET /round received a request!');
  res.send(randomRange);
})

app.listen(PORT, () => {
  console.log ('Server is running on port', PORT)
})
