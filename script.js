const loader = document.getElementById('loader')
const button = document.getElementById('start')

const countdown = document.getElementById('countdown')

const displayScore = document.getElementById('display-score')
const displayTimer = document.getElementById('display-timer')
const pauseStart = document.getElementById('pause-start')
const pauseStartS = document.getElementById('pause-start-s') 
const scoremu = document.getElementById('scoremu')



const canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

let timeInterval
let isStart = false
let mili = 0
let second = 60

let frame  = 0
let enemies = []
let hitAreas = []


scoremu.style.display = 'none';
canvas.style.display = 'none';
button.style.display = 'none';

countdown.style.display = 'none';

setTimeout(() => {
    loader.style.display = 'none'
    button.style.display = 'block'

    countdown.style.display = 'none'
},2000);

button.addEventListener('click', function(){
    button.style.display = 'none'
    loader.style.display = 'none' 
    countdown.style.display = 'block'
    animate()
    countdownTimer() 
});

window.addEventListener('load', function(){
    displayScore.innerHTML = localStorage.getItem("score")
})

let int = null;
function countdownTimer(){
    timeInterval = setInterval(displayTimeCountdown, 10)
    isStart = true 
    int =  setInterval(secondTimer, 1000)
}

function displayTimeCountdown(){
    if(second == 55){
        clearInterval()
        canvas.style.display = 'block';
        return
        
    }

    mili += 10
    if(mili == 1000){
        mili = 0
        second--
    }

    countdown.innerHTML = second
}

// enemy

class Enemy {
    constructor(horizontalPosition){
        this.x = horizontalPosition
        this.y = 0
        this.width = 75
        this.heigth = 75
        this.speed = Math.random() * 0.2 + 2.3
        this.movement = this.speed

        this.imageKeysLeft = new Image()
        this.imageKeysLeft.src = "img/enemyArrowLeft.png"
        this.imageKeysTop = new Image()
        this.imageKeysTop.src = "img/enemyArrowUp.png"
        this.imageKeysRight = new Image()
        this.imageKeysRight.src = "img/enemyArrowRight.png"
        this.imageKeysBottom = new Image()
        this.imageKeysBottom.src = "img/enemyArrowBottom.png"
    }
    update(){
        this.y += this.movement
    }
    draw(){
        if(this.x == 0){
            ctx.drawImage(this.imageKeysLeft, this.x, this.y, this.width, this.heigth)
        }else if(this.x == 75){
            ctx.drawImage(this.imageKeysTop, this.x, this.y, this.width, this.heigth)
        }else if(this.x == 150){
            ctx.drawImage(this.imageKeysRight, this.x, this.y, this.width, this.heigth)
        }else if(this.x == 225){
            ctx.drawImage(this.imageKeysBottom, this.x, this.y, this.width, this.heigth)
        }
    }
}

function handleDrawEnemy(){
    for(let i = 0 ; i < enemies.length; i++){
        enemies[i].update()
        enemies[i].draw()
        if(enemies[i].y >= innerHeight){
            enemies.shift()
        } 
    }

    if(frame % 100 === 0){
        let horizontalPosition = Math.floor(Math.random() * 4) * 75
        enemies.push(new Enemy(horizontalPosition))
    }
}

// hit are

class HitArea{
    constructor(x){
        this.x = x 
        this.width = 75
        this.heigth = 75 
        this.imageKeysLeft = new Image()
        this.imageKeysLeft.src = "img/enemyArrowLeft.png"
        this.imageKeysTop = new Image()
        this.imageKeysTop.src = "img/enemyArrowUp.png"
        this.imageKeysRight = new Image()
        this.imageKeysRight.src = "img/enemyArrowRight.png"
        this.imageKeysBottom = new Image()
        this.imageKeysBottom.src = "img/enemyArrowBottom.png"
    }
    draw(){ 
        if(this.x == 0){
            ctx.drawImage(this.imageKeysLeft, this.x, 220, 75, 75)
        }else if(this.x == 75){
            ctx.drawImage(this.imageKeysTop, this.x, 220, 75, 75)
        }else if(this.x == 150){
            ctx.drawImage(this.imageKeysRight, this.x, 220, 75, 75)
        }else if(this.x == 225){
            ctx.drawImage(this.imageKeysBottom, this.x, 220, 75, 75)
        }
    }
}
function createHitArea(){ 
    for(let x = 0; x < canvas.width; x+=75){
        hitAreas.push(new HitArea(x))}
}
createHitArea()
function handleGameHitArea(){
    for(let i = 0; i < hitAreas.length; i++){
        hitAreas[i].draw()
}
}

// game press

let arrowLeftPressed = false;
let arrowUpPressed = false;
let arrowRightPressed = false;
let arrowDownPressed = false;

let updateScore = 0;


document.addEventListener('keydown', keyDownHandler) 

function keyDownHandler(e){  
    for(let i = 0 ; i < enemies.length; i++){  
        if(e.keyCode === 37 && enemies[i].x == 0 && enemies[i].y >= 180 && enemies[i].y <= 300){
            updateScore += 1 
            localStorage.setItem('score', updateScore)  
            enemies.pop() 
        } 
        else if(e.keyCode === 38 && enemies[i].x == 75 && enemies[i].y >= 180 && enemies[i].y <= 300){
            updateScore += 1 
            localStorage.setItem('score', updateScore) 
            enemies.pop() 
        } 
        else if(e.keyCode === 39 && enemies[i].x == 150 && enemies[i].y >= 180 && enemies[i].y <= 300){
            updateScore += 1  
            localStorage.setItem('score', updateScore) 
            enemies.pop() 
        } 
        else if(e.keyCode === 40 && enemies[i].x == 225 && enemies[i].y >= 180 && enemies[i].y <= 300){
            updateScore += 1 
            localStorage.setItem('score', updateScore) 
            enemies.pop() 
        } 
        displayScore.innerHTML = localStorage.getItem("score")
    }
} 


// start game

var shouldDraw=false

function animate(){ 
    ctx.clearRect(0,0, innerWidth, innerHeight) 
    
    handleGameHitArea()
    handleDrawEnemy()
    frame++ 
    if(!shouldDraw) requestAnimationFrame(animate)
    
} 

pauseStartS.style.display = "none"
pauseStart.addEventListener('click', startGame) 
pauseStartS.addEventListener('click', pauseGame)
 
function pauseGame(){
    pauseStartS.style.display = "none"
    pauseStart.style.display = "block"
    shouldDraw=false
    countdownTimer()
    animate()
}
function startGame(){
    pauseStart.style.display = "none"
    pauseStartS.style.display = "block"
    shouldDraw=true  
    clearInterval(int);
}

let seconds = 60
function secondTimer() {
    if(seconds == 0){
        shouldDraw=true
        clearInterval(int) 
        canvas.style.display = "none"
        scoremu.style.display = "block"
        scoremu.innerHTML = localStorage.getItem('score')
        localStorage.removeItem('score')
    }
    if(seconds >= 0){
        displayTimer.innerHTML = seconds
        seconds--
    }else{
        clearInterval(int)
    }
} 