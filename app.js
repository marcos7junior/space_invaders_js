const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector('.results')
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let gameSpeed = 800;
let laserSpeed = 50;
let aliensRemoved = [];
let results = 0;

for(let i = 0; i < 225; i++){
    const square = document.createElement("div");
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22,23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

function draw() {
    for (let i = 0; i < alienInvaders.length; i++){
        if(!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader");
        }
    }
}

draw();

function remove() {
    for (let i = 0; i < alienInvaders.length; i++){
        squares[alienInvaders[i]].classList.remove("invader");
    }
}

squares[currentShooterIndex].classList.add("shooter");

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter");
    switch(e.key) {
        case 'ArrowLeft':
            if(currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case 'ArrowRight':
            if(currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    squares[currentShooterIndex].classList.add("shooter");
}
document.addEventListener("keydown", moveShooter);

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if(rightEdge && goingRight) {
        for(let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1;
            direction = -1;
            goingRight = false;
        }
    }

    if(leftEdge && !goingRight) {
        for(let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1;
            direction = 1;
            goingRight = true;
        }
    }

    for(let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    draw();

    if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
        resultDisplay.innerHTML = "GAME OVER";
        clearInterval(invadersId);
    }

    for(let i = 0; i < alienInvaders.length; i++) {
        if(alienInvaders[i] > squares.length) {
            resultDisplay.innerHTML = "GAME OVER";
            clearInterval(invadersId);
        }
    }
}
    if(alienInvaders.length === 0) {
        resultDisplay.innerHTML = "YOU WIN!";
        clearInterval(invadersId);
    }

invadersId = setInterval(moveInvaders, gameSpeed);


function shoot(e) {
    let laserId;
    let curretLaserIndex = currentShooterIndex;

    function moveLaser() {
        squares[curretLaserIndex].classList.remove("laser");
        curretLaserIndex -= width;
        squares[curretLaserIndex].classList.add("laser");

        if(squares[curretLaserIndex].classList.contains("invader")) {
            squares[curretLaserIndex].classList.remove("laser");
            squares[curretLaserIndex].classList.remove("invader");
            squares[curretLaserIndex].classList.add("boom");

            setTimeout(() => squares[curretLaserIndex].classList.remove('boom'), 100);
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(curretLaserIndex);
            aliensRemoved.push(alienRemoved);
            results++;
            resultDisplay.innerHTML = results;

        }
    }
    switch(e.key) {
        case "ArrowUp":
            laserId = setInterval(moveLaser, laserSpeed);
    }
}

document.addEventListener("keydown", shoot)

