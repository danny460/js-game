'use strict';

window.addEventListener('load', eventWindowLoaded, false);
function eventWindowLoaded(){
	canvasApp();
}
/*********************************************************
** 	double negation is used for casting:
**	if canvas is not supported, 
**	document.createElement('canvas').getContext == undefined,
**	!undifined == true,
**	!true == false,
**	return false
*********************************************************/
function canvasSupport () {
    return !!document.createElement('canvas').getContext;
}

function canvasApp(){
	var canvas = document.getElementById('cvs');
	if(!canvasSupport()) return;
	var ctx = canvas.getContext('2d'),
		player = new Circle(canvas.width/2, canvas.height/2, 20, "#ffffaa", "ffff00");
	canvas.addEventListener("mousemove", onMouseMove, false);
	drawCirle(player);

	function onMouseMove(evt) {
		var bound = canvas.getBoundingClientRect();
		updateCircle(evt.clientX - bound.left, evt.clientY - bound.top);
	}

	function updateCircle(x, y) {
		player.centerX = x;
		player.centerY = y;
		player.radius += 0.1;
		drawCirle(player);
	}

	function drawCirle(circle){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, 2*Math.PI, false);
		ctx.fillStyle = circle.fillStyle;
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = circle.strokeStyle;
		ctx.stroke();
	}

	function Circle(cx, cy, r, fs, ss){
		Circle.prototype.centerX = cx;
		Circle.prototype.centerY = cy;
		Circle.prototype.radius = r;
		Circle.prototype.fillStyle = fs;
		Circle.prototype.strokeStyle = ss;
		Circle.prototype.grow = function(){
			this.radius++;
		};
	}
}



