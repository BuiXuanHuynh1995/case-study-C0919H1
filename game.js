var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

//tạo thuộc tính cho đối tượng bóng####################################################################################
var ball={
    x:25,
    y:150,
    dx:5,
    dy:2,
    radius:10
};
//Tạo  thuộc tính cho thanh chắn########################################################################################
var bar = {
    width: 120,
    height: 13,
    x: 0,
    y: canvas.height - 13,
    speed: 10,
    isMovingLeft: false,
    isMovingRight: false,
};
//Tạo thuộc tính đối tượng gạch#########################################################################################
var brickConfig = {
    offsetX:25,
    offsetY:25,
    margin:25,
    width: 70,
    height: 15,
    totalRow:3,
    totalCol:5,
    isBroken: false
}
var gameOver = false;
var gameWin = false;
var userScore = 0;
var maxScore = brickConfig.totalCol*brickConfig.totalRow;

//vẽ hình tròn###################################################################################################
function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = "red";
    context.fill();
    context.stroke();
    context.closePath();
}
//Xử lý bóng đập biên###############################################################################################
function handleBall() {
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx
    }
    if (ball.y < ball.radius || ball.y > canvas.height - ball.radius) {
        ball.dy = -ball.dy;
    }
}
//update vị trí bóng3##########################################################################
function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}
//vẽ thanh ngang ##############################################################################################
function drawBar() {
    context.beginPath();
    context.rect(bar.x, bar.y, bar.width, bar.height);
    context.fillStyle = "red";
    context.fill();
    context.closePath();
}
//sự kiện bàn phím###################################################################################################
document.addEventListener("keyup", function (event) {
    console.log(event);
    if (event.keyCode == 37) {
        bar.isMovingLeft = false;
    } else if (event.keyCode == 39) {
        bar.isMovingRight = false;
    }
});
document.addEventListener("keydown", function (event) {
    console.log(event);
    if (event.keyCode == 37) {
        bar.isMovingLeft = true;
    } else if (event.keyCode == 39) {
        bar.isMovingRight = true;
    }
});
//xử lý thanh chắn######################################################################################################
function handleBar() {
    if (bar.isMovingLeft) {
        bar.x -= bar.speed;
    } else if (bar.isMovingRight) {
        bar.x += bar.speed;
    }
    if (bar.x < 0) {
        bar.x = 0;
    } else if (bar.x > canvas.width - bar.width) {
        bar.x = canvas.width - bar.width
    }
}
//vẽ thanh điểm##########################################################
function drawScore(){
    context.beginPath();
    context.font = "20px Arial";
    context.fillStyle="blue";
    context.fillText("Score: "+userScore, 20, 20);
    context.closePath();
}
//vẽ nhiều gạch ####################################################################################################33
//2*ofset + 5*width +4* margin = canvas.width
// offset = margin = 25
// widthBrick =?
//row =3
//colume = 5
var brickList=[]

for(let i=0;i<brickConfig.totalRow;i++){
    for (let j=0;j<brickConfig.totalCol;j++){
        brickList.push({
            x:brickConfig.offsetX+j*(brickConfig.width+brickConfig.margin),
            y:brickConfig.offsetX+i*(brickConfig.height+brickConfig.margin),
            isBroken: false
        });
    }
}

function drawBrick() {
    brickList.forEach(function (brick)
    {
        if (!brick.isBroken) {
            context.beginPath();
            context.rect(brick.x, brick.y, brickConfig.width, brickConfig.height);
            context.fill();
            context.closePath();
        }
    });
}
//xử lý khi bóng chạn thanh chắn#######################################################################################
function ballCollidBar() {
if(ball.x+ball.radius>= bar.x && ball.x+ball.radius<=bar.x+bar.width &&
    ball.y+ball.radius>= canvas.height - bar.height)
    {
        ball.dy = -ball.dy;
    }
}
//xử lý khi bóng chạm gạch#################################################
function ballCollidBrick() {
brickList.forEach(function (brick) {
    if(!brick.isBroken){
        if(ball.x>=brick.x && ball.x <= brick.x+ brickConfig.width &&
        ball.y+ ball.radius >= brick.y && ball.y-ball.radius <= brick.y+brickConfig.height){
            ball.dy=-ball.dy;
            brick.isBroken = true;
            userScore++;
            if(userScore >= maxScore){
                gameOver=true;
                gameWin=true;
            }
        }
    }
});
}
//check Gameover#########################################################################################################
function checkGameOver(){
    if (ball.y > canvas.height - ball.radius) {
        gameOver = true;
    }
}
//Xử lý gameOver ##############################################################
function handleGame() {
    if(gameWin){
      alert("You Win");
    }else {
        alert("You Lose")
    }
}

function draw() {
    if (!gameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawBar();
        drawBrick();
        drawScore();
        handleBar();
        handleBall();
        updateBallPosition();
        ballCollidBar();
        ballCollidBrick();
       checkGameOver();
        requestAnimationFrame(draw);
    } else {
        handleGame();
    }
}
draw();