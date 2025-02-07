// const robot = require("robotjs");
import robot from "robotjs";

// // * mouse
// // Speed up the mouse.
// robot.setMouseDelay(2);

// var twoPI = Math.PI * 2.0;
// var screenSize = robot.getScreenSize();
// var height = (screenSize.height / 2) - 10;
// var width = screenSize.width;

// for (var x = 0; x < width; x++) {
//     const y = height * Math.sin((twoPI * x) / width) + height;
//     robot.moveMouse(x, y);
// }


// * keyboard
// Type "Hello World".
robot.typeString("Hello World");

// Press enter.
robot.keyTap("enter");

// * screen
// Get pixel color under the mouse.

// Get mouse position.
var mouse = robot.getMousePos();

// Get pixel color in hex format.
var hex = robot.getPixelColor(mouse.x, mouse.y);
console.log("#" + hex + " at x:" + mouse.x + " y:" + mouse.y);

// // Ctrl + Shift + Alt 조합 키 누르기
// robot.keyTap("a", ["control", "shift", "alt"]);

// // Ctrl + C (복사)
// robot.keyTap("c", ["control"]);

// // Ctrl + V (붙여넣기)
// robot.keyTap("v", ["control"]);

