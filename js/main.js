// Select Elements 
let spansCount = document.querySelector('.count span'), 
    bullets = document.querySelector('.bullets'), 
    bulletsContainer = document.querySelector('.bullets .spans'), 
    quizArea = document.querySelector('.quiz-area'),
    answersArea = document.querySelector('.answers-area'), 
    submitBtn = document.querySelector('.submit-button'), 
    resultsContainer = document.querySelector('.results'),
    countDownElement = document.querySelector('.countdown');

// set options 
let currentIndex = 0, 
    rightAnswers = 0, 
    countDownInterval; 

// get questions function 
function getQuestions() {
    
    let myRequest = new XMLHttpRequest();
    myRequest.open('GET', 'js/html_questions.json', true);
    myRequest.send();
    
    myRequest.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            
            // questions count
            let questionsCount = questionsObject.length;
            
            // trigger create bullets function
            createBullets(questionsCount);
            
            // add questions data
            qData(questionsObject[currentIndex], questionsCount);
            
            // trigger count down function 
            countDown(60,questionsCount);
            
            // submit button on click 
            submitBtn.onclick = () => {
                
                // get the right answer 
                let rightAnswer = questionsObject[currentIndex].right_answer;
                
                // increase current index
                currentIndex++;
                
                // trigger show answer function 
                checkAnswer(rightAnswer, questionsCount);
                
                // remove previous question
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                
                // add next question 
                qData(questionsObject[currentIndex], questionsCount);
                
                // trigger handle bullets function 
                handleBullets();
                
                // start countdown
                clearInterval(countDownInterval);
                countDown(60, questionsCount);
                
                // trigger show results function 
                showResults(questionsCount);
                
            };
        }
    };
    
}

// trigger get questions function 
getQuestions();

// create bullets function 
function createBullets(num) {
    
    // set spans count
    spansCount.innerHTML = num;
    
    // create bullets
    for(let i = 0; i < num; i++) {
        
        // create bullets 
        let theBullet = document.createElement('span');
        
        // check if it's the first bullet 
        if(i === 0) {
            theBullet.className = 'on';
        }
        
        // append bullets to bullets container 
        bulletsContainer.appendChild(theBullet);
        
    }
    
}

// create questions data function 
function qData(obj, count) {
    if(currentIndex < count) {
        
        let questionTitle = document.createElement('h2');
        let questionText = document.createTextNode(obj['title']);
        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle);
        
        // create answers
        for(let i = 1; i <= 4; i++) {
            
            // create main div (answer)
            let mainDiv = document.createElement('div');
            mainDiv.className = 'answer';
            
            // create the radio input
            let radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'question';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
            
            // make first answer checked
            if(i === 1) {
                radioInput.checked = true;
            }
            
            // create label 
            let theLabel = document.createElement('label');
            theLabel.htmlFor = `answer_${i}`;
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);
            theLabel.appendChild(theLabelText);
            
            // apend input & label to main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
            
            // apend main div to the answers area
            answersArea.appendChild(mainDiv);
            
        }
        
    } 
    
}

// check answer function 
function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName('question');
    let chosenAnswer;
    
    for(let i = 0; i < answers.length; i++) {
        if(answers[i].checked) {
            chosenAnswer = answers[i].dataset.answer;
        }
    }
    
    if(chosenAnswer === rAnswer) {
        rightAnswers++;
    }
}

// handle bullets function 
function handleBullets() {
    
    let bulletSpans = document.querySelectorAll('.bullets .spans span'), 
        arrayOfSpans = Array.from(bulletSpans);
    
    arrayOfSpans.forEach((span, index) => {
        if(index === currentIndex) {
            span.className = 'on';
        }
    });
}

// show results function 
function showResults(count) {
    
    let results;
    if(currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitBtn.remove();
        bullets.remove();
        
        if(rightAnswers > (count / 2) && rightAnswers < count) {
            results = `<span class="good">Good</span>, you answered ${rightAnswers} from ${count}`;    
        } else if (rightAnswers === count) {
            results = `<span class="perfect">Perfect</span>, you answered ${rightAnswers} from ${count}`;
        } else {
            results = `<span class="bad">Bad</span>, you answered ${rightAnswers} from ${count}`;
        }
        
        resultsContainer.innerHTML = results;
        
        // add some css styles 
        resultsContainer.style.cssText = 'padding:10px;margin-top:15px;background-color:#fff';
    } 
}

// count down function 
function countDown(duration, count) {
    
    if(currentIndex < count) {
        let minutes, seconds;
        
        countDownInterval = setInterval(function() {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            
            minutes = minutes < 10 ? `0${minutes}`: `${minutes}`;
            seconds = seconds < 10 ? `0${seconds}`: `${seconds}`;
            
            countDownElement.innerHTML = `${minutes} : ${seconds}`;
            
            if(--duration < 0) {
                clearInterval(countDownInterval);
                submitBtn.click();
            }
        }, 1000);
    }
    
}