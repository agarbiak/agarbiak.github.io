const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const pictureType = document.getElementById("pictureType");
const audioType = document.getElementById("audioType");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

var imgElement = document.createElement('img');
let imgSource = "/pub-quiz/img/";

var audioElement = document.createElement('audio');
let audioSource = "/pub-quiz/audio/";

let questions = [];

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
               metaSrc: loadedQuestion.metaSrc
           };
           const answerChoices = [...loadedQuestion.incorrect_answers];
           formattedQuestion.answer = Math.floor(Math.random()*3) + 1;
           answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

           answerChoices.forEach((choice, index) => {
               formattedQuestion["choice" + (index+1)] = choice;
           })
        //    console.log(formattedQuestion);   
           return formattedQuestion;
       })
       startGame();
    })
    .catch(err => {
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 20;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem("mostRecentScore", score)
        //go to the end page
        return window.location.assign("/pub-quiz/end.html");
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;

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
        console.log("Question is a non-picture round");
        // document.getElementById("pictureType").removeChild(imgElement);
        pictureType.classList.add("hidden");
        audioType.classList.add("hidden");
    }
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
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply =
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if(classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 500);
    });
})

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}