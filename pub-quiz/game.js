// Grab DOM elements
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const pictureType = document.getElementById("pictureType");
const audioType = document.getElementById("audioType");
// const mapType = document.getElementById("mapType");
const truthType = document.getElementsByClassName("jsTruthType");

//CONSTANTS
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 20;

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

var imgElement = document.createElement('img');
let imgSource = "/pub-quiz/img/";

var audioElement = document.createElement('audio');
let audioSource = "/pub-quiz/audio/";

// var mapElement = document.createElement('map');
// let mapSource = "/pub-quiz/map/";

let questions = [];

function showProps(obj, objName) {
    var result = ``;
    for (var i in obj) {
      // obj.hasOwnProperty() is used to filter out properties from the object's prototype chain
      if (obj.hasOwnProperty(i)) {
        result += `${objName}.${i} = ${obj[i]}\n`;
      }
    }
    return result;
  }

fetch(
    "/pub-quiz/questions-today.json"
    )
    .then( res => {
        return res.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions.results.map( loadedQuestion => {
           const formattedQuestion = {
               question: loadedQuestion.question,
               metaType: loadedQuestion.meta,
               metaSrc: loadedQuestion.metaSrc,
               questionType: loadedQuestion.type
           };
           const answerChoices = [...loadedQuestion.incorrect_answers];

           formattedQuestion.answer = Math.floor(Math.random()*3) + 1;
            if (formattedQuestion.questionType === "truth") {
                formattedQuestion.answer = Math.floor(Math.random()*2) + 1;
            }

           answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

           answerChoices.forEach((choice, index) => {
               formattedQuestion["choice" + (index+1)] = choice;
           })
           
           return formattedQuestion;
       })
       startGame();
    })
    .catch(err => {
        console.error(err);
    });

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    // console.log(questions);
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem("mostRecentScore", score);
        //go to the end page
        return window.location.assign("/pub-quiz/end.html");
    }
    questionCounter++;
    
    //update the progress bars
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;

    //Set truth type question
    if(currentQuestion.questionType === "truth"){
        // Hide containers C and D
        Array.from(truthType).forEach(elem => {
            elem.classList.add("hidden");
            elem.classList.remove("choice-container");
        });
    } else {
        // Display all containers
        Array.from(truthType).forEach(elem => {
            elem.classList.remove("hidden");
            elem.classList.add("choice-container");
        });
    }

    //Set picture type question
    if(currentQuestion.metaType === "Picture"){
        audioType.classList.add("hidden");
        imgElement.setAttribute("src", imgSource.concat(currentQuestion.metaSrc));
        imgElement.setAttribute("alt", currentQuestion.metaSrc);
        document.getElementById("pictureType").appendChild(imgElement);
        pictureType.classList.remove("hidden");
    } 
    // Set audio type question
    else if(currentQuestion.metaType === "Audio") {
        pictureType.classList.add("hidden");        
        audioElement.setAttribute("src", audioSource.concat(currentQuestion.metaSrc));
        audioElement.setAttribute("controls", "controls");
        audioElement.setAttribute("controlsList", "nodownload");
        document.getElementById("audioType").appendChild(audioElement);
        audioType.classList.remove("hidden");
    }
    // Set basic question
     else {
        pictureType.classList.add("hidden");
        audioType.classList.add("hidden");
    }

    // console.log("Current Q Answer is: " + currentQuestion.answer);
    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerHTML = currentQuestion["choice" + number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;

        // Pause audio
        if(currentQuestion.metaType === "Audio") {
            audioElement.pause();
        }

        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply =
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if(classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        selectedChoice.parentElement.classList.add("no-hover");
        
        setTimeout(() => {

            selectedChoice.parentElement.classList.remove(classToApply);

            if(classToApply === "incorrect") {
                choices[currentQuestion.answer - 1].classList.add("answer");
                
                setTimeout(() => {
                    choices[currentQuestion.answer - 1].classList.remove("answer")
                    getNewQuestion();
                }, 2000);
            } else {
                selectedChoice.parentElement.classList.remove("no-hover");
                getNewQuestion();
            }            

        }, 500);

    });
})

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}