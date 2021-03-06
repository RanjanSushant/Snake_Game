const grid = document.getElementById("grid");
const startBtn = document.getElementById("start-btn");
const gameOver = document.querySelector(".game-over");
const scoreDisplay = document.getElementById("score");

const leftArrow =  document.querySelector(".left-arrow")
const rightArrow =  document.querySelector(".right-arrow")
const upArrow =  document.querySelector(".up-arrow")
const downArrow =  document.querySelector(".down-arrow")

// console.log(window.innerWidth)

let gridHeight = 20;
let gridWidth = 40;

let snakeHeight = 20;
let snakeWidth = 20;

function setGridDimensions() {
    if(window.innerWidth < 726){
        gridHeight = 30;
        gridWidth = 18;
    } else {
        gridWidth = 40;
        gridHeight = 20;
    }  
}

setGridDimensions()

const numberOfSquares = (gridWidth*gridHeight)

let gridSquares = []
let currentSnake = [2,1,0]
let newDirection = 1;
let foodIndex = 3;
let score = 0;
let level = 1;
let intervalTime = 1000;
let timerId = 0;

//direction object
let snakeDirection = {
    "ArrowUp": -gridWidth,
    "ArrowDown": gridWidth,
    "ArrowLeft": -1,
    "ArrowRight": 1
}

let currentDirection = 0;



//creating grid
for (let i=0; i<numberOfSquares; i++) {
    const square_div = document.createElement("div");
    square_div.classList.add("snake_square")
    grid.appendChild(square_div)
    gridSquares.push(square_div)
}

//creating initial snake
currentSnake.forEach( currentSquare => gridSquares[currentSquare].classList.add("snake"));

function startGame() {
    // console.log("starting")
    if(window.innerWidth < 726) {
        startBtn.style.display = "none"
        startBtn.style.opacity = 1;
    }
    gameOver.style.display = "none";
    grid.style.opacity = 1;
    clearInterval(timerId)
    gridSquares[foodIndex].classList.remove("food")
    currentSnake.forEach( currentSquare => gridSquares[currentSquare].classList.remove("snake"));
    currentSnake = [2,1,0]
    newDirection = 1;
    currentDirection = 0;
    score = 0;
    level = 1;
    intervalTime = 1000;
    currentSnake.forEach( currentSquare => gridSquares[currentSquare].classList.add("snake"));
    generateFood()
    timerId = setInterval(moveSnake, intervalTime);
}

function snakeDead() {
    gameOver.style.display = "block";
    grid.style.opacity = 0.4;
    startBtn.textContent = "Restart Game"
    if(window.innerWidth < 726) {
        startBtn.style.display = "block";
        startBtn.style.opacity = 1
    }
    newDirection = 0;
    return clearInterval(timerId)
}

function changeDirection(event) {
    if(snakeDirection[event.key] === -currentDirection) {
        // console.log("Game over")
        snakeDead();
    } else {
        newDirection = snakeDirection[event.key];
    }    
}

leftArrow.addEventListener("click", function() {
    // console.log("Go left")
    newDirection = snakeDirection["ArrowLeft"];
  })

rightArrow.addEventListener("click", function() {
    // console.log("Go left")
    newDirection = snakeDirection["ArrowRight"];
})

upArrow.addEventListener("click", function() {
    // console.log("Go left")
    newDirection = snakeDirection["ArrowUp"];
})

downArrow.addEventListener("click", function() {
    // console.log("Go left")
    newDirection = snakeDirection["ArrowDown"];
})

function moveSnake() { 
    if( (currentSnake[0] % gridWidth === gridWidth-1 && newDirection === 1) || 
        (currentSnake[0] - gridWidth < 0 && newDirection === -gridWidth) || 
        (currentSnake[0] + gridWidth >= (gridWidth*gridHeight) && newDirection === gridWidth) ||
        (currentSnake[0] % gridWidth === 0 && newDirection === -1) || 
        (gridSquares[currentSnake[0] + newDirection].classList.contains('snake')) ) {
        snakeDead()
    } else {
        const snakeTail = currentSnake.pop()
        gridSquares[snakeTail].classList.remove("snake");
        currentSnake.unshift(currentSnake[0] + newDirection)
        gridSquares[currentSnake[0]].classList.add("snake");
        currentDirection = newDirection;
        if(gridSquares[currentSnake[0]].classList.contains("food")) {
            gridSquares[currentSnake[0]].classList.remove("food");
            gridSquares[snakeTail].classList.add("snake")
            currentSnake.push(snakeTail)
            score++
            scoreDisplay.textContent = score
            generateFood()
            if(score%10 === 9) {
                level++
                clearInterval(timerId)
                intervalTime = intervalTime * (0.9 ** level)
                timerId = setInterval(moveSnake, intervalTime);
            } 
        }
    }
}

function generateFood() {
    do {
        foodIndex = Math.floor(Math.random() * numberOfSquares);
    } while(gridSquares[foodIndex].classList.contains("snake"))
    gridSquares[foodIndex].classList.add("food")
}


document.addEventListener("keyup",changeDirection)


startBtn.addEventListener("click", startGame)