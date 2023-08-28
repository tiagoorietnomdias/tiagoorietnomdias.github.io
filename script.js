import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
    databaseURL: "https://porfolio-highscores-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const highscoresInDB = ref(database, "highscores");


const pswitchAudio = new Audio('./assets/pswitchthemefinal.mp3');


const elements = document.getElementsByClassName('animated-title');
const movementFactor = 0.3; //to control the parallax effect
const originalPositions = new Map();

var seconds = 0;
var tens = 0;
var appendTens = document.createElement('span');
appendTens.id = 'tens';
var appendSeconds = document.createElement('span');
appendSeconds.id = 'seconds';
var Interval;



const overlay = document.getElementById('overlay');

overlay.addEventListener('click', function () {
    const highscoreWindow = document.getElementById('highscore-window');
    highscoreWindow.classList.toggle('active');
    overlay.classList.toggle('active');
    console.log('I was clicked');
});


function handleScroll() {
    Array.from(elements).forEach(element => {
        const rect = element.getBoundingClientRect();
        const scrollY = window.scrollY;
        const totalScrollHeight = window.innerHeight;
        if (totalScrollHeight > 0) {

            const windowWidth = window.innerWidth;

            if (!originalPositions.has(element)) {
                originalPositions.set(element, windowWidth - rect.left);
            }
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                const startPosition = originalPositions.get(element);
                let scrollProgress = 0
                if (scrollY > 800) {
                    scrollProgress = (scrollY - (rect.bottom * 2.78)) / (scrollY);

                } else {
                    scrollProgress = (scrollY - rect.bottom) / 1000;

                }
                const leftPosition = startPosition * scrollProgress * movementFactor;
                if (leftPosition > 0) {
                    element.style.transform = `translateX(${leftPosition}px)`;
                } else {
                    element.style.transform = 'translateX(0)';
                }
            }
        }
    });
}

window.addEventListener('scroll', handleScroll);


function spawnCoin() {
    pswitchAudio.play();
    for (let j = 0; j < 6; j++) {
        const coinWrapper = document.createElement('div');
        coinWrapper.className = 'coin-wrapper';

        const coinDiv = document.createElement('div');
        const randomTranslateX = Math.random() * (window.innerWidth - 1000);
        const randomTranslateY = Math.random() * (window.innerHeight - 2000);

        coinWrapper.style.transform = `translate(${randomTranslateX}px, ${randomTranslateY}px)`;
        coinDiv.className = 'coin';

        const backArticle = document.createElement('article');
        backArticle.className = 'back coin-element';
        coinDiv.appendChild(backArticle);

        for (let i = 0; i < 9; i++) {
            const middleArticle = document.createElement('article');
            middleArticle.className = 'middle coin-element';
            coinDiv.appendChild(middleArticle);
        }

        const frontArticle = document.createElement('article');
        frontArticle.className = 'front coin-element';
        coinDiv.appendChild(frontArticle);

        coinWrapper.appendChild(coinDiv);
        document.body.appendChild(coinWrapper);
    }
}



var counter = 0;

function deleteCoin() {
    const coins = document.getElementsByClassName('coin');
    Array.from(coins).forEach(element => {
        counter = 0;
        element.style.transition = "opacity 1s";
        element.style.opacity = 0;
        element.addEventListener('transitionend', () => {
            element.remove();
        });
    });
}
function isUserScoreHigher(userScore, highscore) {
    const [userSeconds, userTens] = userScore.split(':');
    const [highscoreSeconds, highscoreTens] = highscore.split(':');

    return (Number(userSeconds) < Number(highscoreSeconds)) ||
        (Number(userSeconds) === Number(highscoreSeconds) && Number(userTens) < Number(highscoreTens));
}
async function showScore() {
    const highscoreWindow = document.getElementById('highscore-window');
    highscoreWindow.classList.toggle('active');
    const overlay = document.getElementById('overlay');
    overlay.classList.toggle('active');
    const yourScore = document.getElementById('your-score');
    yourScore.textContent = "";
    yourScore.textContent += "Your score: " + appendSeconds.innerHTML + ":" + appendTens.innerHTML;
    const highscoreElements = [];


    for (let i = 1; i <= 10; i++) {
        const key = i.toString();
        const highscoreElement = document.getElementById(`#${i}`);
        highscoreElements.push(highscoreElement);

        const highscoreRef = ref(database, `highscores/${key}`);
        get(highscoreRef).then((snapshot) => {
            if (snapshot.exists()) {
                const value = snapshot.val();
                highscoreElement.textContent = "";
                highscoreElement.textContent += "#" + i.toString() + ": ";
                highscoreElement.textContent += value;
            } else {
                highscoreElement.textContent = "No Data";
            }
        }).catch(error => {
            console.error(`Error getting data at key ${key}:`, error);
        });
    }


}
async function checkHighScore() {
    let userPosition = 0;
    let found = 0;
    const userScore = appendSeconds.innerHTML + ":" + appendTens.innerHTML;
    console.log("userScore" + userScore);
    for (let i = 1; i <= 10; i++) {
        const key = i.toString();
        const highscoreRef = ref(database, `highscores/${key}`);

        try {
            const snapshot = await get(highscoreRef);
            if (snapshot.exists()) {
                const value = snapshot.val();
                if (isUserScoreHigher(userScore, value) && (found == 0)) {
                    userPosition = i;
                    found = 1;
                }


            } else {
            }
        } catch (error) {
            console.error(`Error getting data at key ${key}:`, error);
        }
    }
    if (found == 0) { }
    else {
        const userHighscoreRef = ref(database, `highscores/${userPosition}`);
        var valueToHold;
        try {
            const snapshot = await get(userHighscoreRef);
            if (snapshot.exists()) {
                valueToHold = snapshot.val();
            }
            await set(userHighscoreRef, userScore);
        } catch (error) {
            console.error(`Error setting user's high score at key ${userPosition}:`, error);
        }
        // Mover scores para baixo
        for (let i = userPosition + 1; i <= 10; i++) {
            var auxVar = valueToHold;
            const destinationKey = i.toString();
            const destinationRef = ref(database, `highscores/${destinationKey}`);

            try {
                const snapshot = await get(destinationRef);
                if (snapshot.exists()) {
                    valueToHold = snapshot.val();
                    await set(destinationRef, auxVar);
                }
            } catch (error) {
                console.error(`Error moving score at key ${destinationKey}:`, error);
            }
        }
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const pswitch = document.getElementById('p-switch');


    pswitch.addEventListener('click', function () {
        pswitch.classList.toggle('pressed-down');
        spawnCoin();
        Interval = setInterval(startTimer, 10);
        const coinElement = document.getElementsByClassName('coin-element');
        counter = 0;
        function playCoinAudio() {
            const coinAudio = new Audio('./assets/mario-coin.mp3');
            coinAudio.play();
        }
        ///coin catch
        Array.from(coinElement).forEach(element => {
            element.addEventListener('mouseenter', function () {

                playCoinAudio();


                var parentElement = element.parentElement;
                // parentElement.style.backgroundImage = `url('./assets/yellowglitter.png')`;
                parentElement.style.transition = "opacity 0.3s";
                parentElement.style.opacity = 0;

                parentElement.style.pointerEvents = 'none';
                parentElement.addEventListener('transitionend', async () => {

                    counter += 1;
                    //now that parent is gone, display the number inside it
                    const coinNumberDiv = document.createElement('div');
                    coinNumberDiv.className = 'coin-number-div';
                    const h1Element = document.createElement('h1');
                    h1Element.textContent = counter;
                    coinNumberDiv.appendChild(h1Element);
                    parentElement.parentElement.appendChild(coinNumberDiv);
                    //if user got all the coins
                    if (counter === 6) {
                        clearInterval(Interval);
                        pswitchAudio.pause();
                        const celebrationAudio = new Audio('./assets/celebration.mp3');
                        celebrationAudio.play();
                        coinNumberDiv.style.animation = "scale-unscale 2s infinite";

                        celebrationAudio.addEventListener('ended', () => {
                            coinNumberDiv.style.animation = "fade-out 0.5s";
                            coinNumberDiv.addEventListener('animationend', () => {
                                parentElement.parentElement.remove();
                            });
                        });
                        pswitch.classList.toggle('pressed-down');
                        await checkHighScore();
                        await showScore();
                        pswitchAudio.currentTime = 0;
                        tens = 0;
                        seconds = 0;
                    }


                    //if not
                    else {
                        coinNumberDiv.style.animation = "fade-out 2s 1s";
                        coinNumberDiv.addEventListener('animationend', () => {
                            parentElement.parentElement.remove();
                        });
                    }




                });



            });
        });
    });
});



pswitchAudio.addEventListener('ended', () => {
    const pswitch = document.getElementById('p-switch');
    pswitch.classList.toggle('pressed-down');
    deleteCoin();
    clearInterval(Interval);
    tens = 0;
    seconds = 0;
});






function startTimer() {
    tens++;

    if (tens <= 9) {
        appendTens.innerHTML = "0" + tens;
    }

    if (tens > 9) {
        appendTens.innerHTML = tens;

    }

    if (tens > 99) {
        seconds++;
        appendSeconds.innerHTML = "0" + seconds;
        tens = 0;
        appendTens.innerHTML = "0" + 0;
    }

    if (seconds > 9) {
        appendSeconds.innerHTML = seconds;
    }

}




