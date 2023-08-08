const elements = document.getElementsByClassName('case-title');

// Create a map to store the original starting positions for each element
const originalPositions = new Map();

function handleScroll() {
    Array.from(elements).forEach(element => {
        const rect = element.getBoundingClientRect();
        const scrollY = window.scrollY;
        const totalScrollHeight = window.innerHeight - element.clientHeight;

        if (totalScrollHeight > 0) {
            let scrollProgress = (scrollY - rect.top) / totalScrollHeight;
            scrollProgress = Math.max(0, Math.min(1, scrollProgress));
            const windowWidth = window.innerWidth;
            const movementFactor = 0.3; // to control how much it goes forward

            if (!originalPositions.has(element)) {
                originalPositions.set(element, windowWidth - rect.left);
            }

            const startPosition = originalPositions.get(element);

            const leftPosition = startPosition * scrollProgress * movementFactor;
            if (leftPosition > 0) {
                element.style.transform = `translateX(${leftPosition}px)`;
            } else {

                element.style.transform = 'translateX(0)';//Reset
            }
        }
    });
}

window.addEventListener('scroll', handleScroll);
