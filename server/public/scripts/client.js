function onReady() {
}

onReady()
let winnerTitle = document.getElementById("winner");
let errorValidation = document.querySelector('#error-range');
let tomsInput = document.getElementById('toms-input');
let bensInput = document.getElementById('ben-input');
let ResetBtn = document.getElementById('reset-btn');
let valid = true;
let match = true;
let roundNum = 0;
let min = 1;
let max = 25;

function createRound(event) {
event.preventDefault();
let tomsGuess = document.getElementById('toms-input').value;
let bensGuess = document.getElementById('ben-input').value;  

  if (!isValidGuess(tomsGuess, bensGuess)) {
    valid = false;
  } else {
    valid = true;
  }

  if (!isNotMatch(tomsGuess, bensGuess)) {
    match = false;
  } else {
    match = true;
  }

  if (valid === false || match === false) {
    return;
  }

    let newRound = {
      tomsGuess: tomsGuess,
      tomsResult: 'guess',
      bensGuess: bensGuess,
      bensResult: 'guess'
    }
    
    axios({
      method: 'POST',
      url: '/round',
      data: newRound
    })
    .then ((response) => {
      fetchRound();
    })
}

function fetchRound() {

  axios({
    method: 'GET',
    url:'/round'
  })
  .then((response) => {
    const theRounds = response.data;
let roundTable = document.getElementById('round-results');

roundTable.innerHTML = '';
roundNum = 0;
for(let anObject of theRounds) {
  roundNum++;

  roundTable.innerHTML += `
  <tr>
    <td>${roundNum}</td>
    <td>${anObject.tomsGuess}</td>
    <td class="toms-result">${anObject.tomsResult}</td>
    <td>${anObject.bensGuess}</td>
    <td class="bens-result">${anObject.bensResult}</td>
  </tr>
  `;
  if(anObject.tomsResult === 'exact') {
    winnerTitle.innerHTML += `
      <h2>Tom Wins!</h2>
    `
    ResetBtn.style.display = "block";
  }
  if(anObject.bensResult === 'exact') {
    winnerTitle.innerHTML += `
      <h2>Ben Wins!</h2>
    `
    ResetBtn.style.display = "block";
  }
  }
  
  let tomsTableResult = document.querySelectorAll('.toms-result');
  for (let i = 0; i < tomsTableResult.length; i++) {
    let text = tomsTableResult[i].innerText;
    //check for your target text
    if (text === "over") {
      //add your class to the element containing this text
      tomsTableResult[i].classList.add("over");
    } else if (text === "under") {
      //add your class to the element containing this text
      tomsTableResult[i].classList.add("under");
    } else if (text === "exact") {
      //add your class to the element containing this text
      tomsTableResult[i].classList.add("exact");
    }
  }
  let bensTableResult = document.querySelectorAll('.bens-result');
  for (let i = 0; i < bensTableResult.length; i++) {
    let text = bensTableResult[i].innerText;
    //check for your target text
    if (text === "over") {
      //add your class to the element containing this text
      bensTableResult[i].classList.add("over");
    } else if (text === "under") {
      //add your class to the element containing this text
      bensTableResult[i].classList.add("under");
    } else if (text === "exact") {
      //add your class to the element containing this text
      bensTableResult[i].classList.add("exact");
    }
  }
let guessForm = document.getElementById('guess-inputs');
guessForm.reset();
})

}

function resetRound(event) {
  axios({
    method: 'POST',
    url: '/reset',
    data: ''
  })
  .then ((response) => {
    fetchRound();
  })
}

function changeMinMax(event){
  event.preventDefault();
  let minNum = document.getElementById('random-min').value;
  let maxNum = document.getElementById('random-max').value;

  let newMinMax = {
    min: minNum,
    max: maxNum
  }

  axios({
    method: 'POST',
    url: '/newMinMax',
    data: newMinMax
  })
  .then ((response) => {
    fetchNewRange();
  })
  }

function fetchNewRange() {
  axios({
    method: 'GET',
    url:'/newMinMax'
  })
  .then((response) => {
    const newRange = response.data;
    min = newRange.min;
    max = newRange.max;

    let rangeMinDiv = document.getElementById('min-num');
    let rangeMaxDiv = document.getElementById('max-num');
    
    rangeMinDiv.innerText = `${min}`;
    rangeMaxDiv.innerText = `${max}`;
  })
}

function isValidGuess(tomsGuess, bensGuess) {
  let result = true;
  tomsInput.classList.remove('error');
  bensInput.classList.remove('error');
  errorValidation.innerText = " ";

  if (tomsGuess < min || tomsGuess > max) {
    tomsInput.classList.add('error');
    result = false;
  }

  if (bensGuess < min || bensGuess > max) {
    bensInput.classList.add('error')
    
    result = false;
  }
  if (result === false) {
    errorValidation.innerHTML += `
    <p>Please select a number within the range!</p>`;
  }
  return result;
}

function isNotMatch(tomsGuess, bensGuess) {
  let result = true;

  if (tomsGuess === bensGuess) {
    tomsInput.classList.add('error');
    bensInput.classList.add('error');
    errorValidation.innerHTML += `
    <p>Please pick different numbers!</p>
    `
    result = false;
  }
return result;
}