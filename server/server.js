const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5001;

// This must be added before GET & POST routes.
app.use(bodyParser.urlencoded({extended:true}))

// Serve up static files (HTML, CSS, Client JS)
app.use(express.json());
app.use(express.static('server/public'));

let randomRoundNumber = randomNumber(1, 25);
let roundGuesses = [];

console.log('Random number is:', randomRoundNumber);
function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

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
  randomRoundNumber = randomNumber(1, 25);
  console.log('the new random number is:', randomRoundNumber);
  
  res.sendStatus(201);
  })

app.listen(PORT, () => {
  console.log ('Server is running on port', PORT)
})
