var canvas = document.getElementById("#mazeCanvas");
var context = canvas.getContext("2d");
var currRectX = 425;
var currRectY = 3;
var mazeWidth = 556;
var mazeHeight = 556;
var intervalVar;

function drawMazeAndRectangle(rectX, rectY) {
    makeWhite(0, 0, canvas.width, canvas.height);
    var mazeImg = new Image();
    mazeImg.onload = function () {
        // when image is loaded, draw the image, the rectangle adn the circle
        context.drawImage(mazeImg, 0, 0);
        drawRectangle(rectX, rectY, "#0000FF", false, true);
        context.beginPath();
        context.arc(542, 122, 7, 0, 2 * Math.PI, false);
        context.closePath();
        context.fillStyle = "#00FF00";
        context.fill();
    };
    mazeImg.src = "maze.gif";
}

function drawRectangle(x, y, style) {
    makeWhite(currRectX, currRectY, 15, 15);
    currRectX = x;
    currRectY = y;
    context.beginPath();
    context.rect(x, y, 15, 15);
    context.closePath();
    context.fillStyle = style;
    context.fill();
}

function makeWhite(x, y, w, h) {
context.beginPath();
context.rect(x, y, w, h);
context.closePath();
context.fillStyle = "white";
context.fill();
}

function moveRect(e) {
    var newX;
    var newY;
    var canMove;
    e = e || window.event;
    switch (e.keyCode) {
        case 38: // Arrow up
        case 87: // W key
            newX = currRectX;
            newY = currRectY - 3;
            break;
        case 37: // Arrow left
        case 65: // A key
            newX = currRectX - 3;
            newY = currRectY;
            break;
        case 40: // Arrow down
        case 83: // S key
            newX = currRectX;
            newY = currRectY + 3;
            break;
        case 39: // Arrow right
        case 68: // D key
            newX = currRectX + 3;
            newY = currRectY;
            break;
        default: return;
    }
    movingAllowed = canMoveTo(newX, newY);
    if (movingAllowed === 1) { // 1 means the rectangle can move
        drawRectangle(newX, newY, "#0000FF");
        currRectX = newX;
        currRectY = newY;
    }
    else if (movingAllowed === 2) { // 2 means the rectangle has reached the end point
        clearInterval(intervalVar); // time will be set later
        makeWhite(0, 0, canvas.width, canvas.height);
        context.font = "40px Arial";
        context.fillStyle = "blue";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("Congrats!!", canvas.width / 2, canvas.height / 2);
        window.removeEventListener("keydown", moveRect, true);
    }
}

function canMoveTo(destX, destY) {
    var imgData = context.getImageData(destX, destY, 15, 15);
    var data = imgData.data;
    var canMove = 1; // 1 means the rectangle can move
    if (destX >= 0 && destX <= mazeWidth - 15 && destY >= 0 && destY <= mazeHeight -15) { 
    // checks that the rectangle would move inside the bounds of the canvas
        for (var i =0; i < 4 * 15 * 15; i += 4) {
        // look at all the pixels
            if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) { // black
                canMove = 0;
                break;
            }
            else if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
            // lime: #00FF00
                canMove = 2; // 2 means the end point is reached
                break;
            }
        }
    }
    else {
        canMove = 0;
    }
    return canMove;
}

drawMazeAndRectangle(425, 3); // (425, 3) is the position of the blue rectangle on canvas
window.addEventListener("keydown", moveRect, true);