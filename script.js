const pswitchAudio = new Audio('./assets/pswitchthemefinal.mp3');


const elements = document.getElementsByClassName('animated-title');
const movementFactor = 0.3; //to control the parallax effect
const originalPositions = new Map();

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



let counter=0;

function deleteCoin() {
    const coins = document.getElementsByClassName('coin');
    Array.from(coins).forEach(element => {
        counter=0;
        element.style.transition = "opacity 1s";
        element.style.opacity = 0;
        element.addEventListener('transitionend', () => {
            element.remove();
        });
    });
}


document.addEventListener('DOMContentLoaded', function () {
    const pswitch = document.getElementById('p-switch');
    

    pswitch.addEventListener('click', function () {
        pswitch.classList.toggle('pressed-down');
        const coinElement = document.getElementsByClassName('coin-element');
        counter=0;
        ///coin catch
        Array.from(coinElement).forEach(element => {
            element.addEventListener('mouseenter', function () {
                
                const coinAudio = new Audio('./assets/mario-coin.mp3');
                coinAudio.play();


                var parentElement = element.parentElement;
                // parentElement.style.backgroundImage = `url('./assets/yellowglitter.png')`;
                parentElement.style.transition = "opacity 0.3s";
                parentElement.style.opacity = 0;
                
                parentElement.style.pointerEvents = 'none';
                parentElement.addEventListener('transitionend', () => {
                    
                    counter+=1;
                    //now that parent is gone, display the number inside it
                    const coinNumberDiv = document.createElement('div');
                    coinNumberDiv.className='coin-number-div';
                    const h1Element = document.createElement('h1');
                    h1Element.textContent = counter;
                    console.log(h1Element.textContent);
                    coinNumberDiv.appendChild(h1Element);
                    parentElement.parentElement.appendChild(coinNumberDiv);
                    //if user got all the coins
                    if(counter===6){
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

                        const highscoreWindow = document.createElement('div');
                        highscoreWindow.className = 'highscore-window';
                        }

                    
                    //if not
                    else{
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
});




