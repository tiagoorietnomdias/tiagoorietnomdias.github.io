const pswitchAudio = new Audio('./assets/pswitchthemefinal.mp3');


const elements = document.getElementsByClassName('animated-title');
const movementFactor = 0.3; // Adjust this to control the extent of the parallax effect
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
        const randomTranslateX = Math.random() * (window.innerWidth - 1000); // Adjust the range as needed
        const randomTranslateY = Math.random() * (window.innerHeight - 2000); // Adjust the range as needed

        coinWrapper.style.transform = `translate(${randomTranslateX}px, ${randomTranslateY}px)`;
        coinDiv.className = 'coin';

        const backArticle = document.createElement('article');
        backArticle.className = 'back coinElement';
        coinDiv.appendChild(backArticle);

        for (let i = 0; i < 9; i++) {
            const middleArticle = document.createElement('article');
            middleArticle.className = 'middle coinElement';
            coinDiv.appendChild(middleArticle);
        }

        const frontArticle = document.createElement('article');
        frontArticle.className = 'front coinElement';
        coinDiv.appendChild(frontArticle);

        coinWrapper.appendChild(coinDiv); // Append coinDiv to coinWrapper
        document.body.appendChild(coinWrapper); // Append coinWrapper to body
    }
}





function deleteCoin() {
    const coins = document.getElementsByClassName('coin');
    Array.from(coins).forEach(element => {
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
        const coinElement = document.getElementsByClassName('coinElement');
        ///coin catch
        Array.from(coinElement).forEach(element => {
            element.addEventListener('mouseenter', function () {
                
                const coinAudio = new Audio('./assets/mario-coin.mp3');
                coinAudio.play();


                var parentElement = element.parentElement;
                parentElement.style.transition = "opacity 0.3s";
                parentElement.style.opacity = 0;
                parentElement.style.pointerEvents = 'none';
                parentElement.addEventListener('transitionend', () => {
                    parentElement.remove();
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




