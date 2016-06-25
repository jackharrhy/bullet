module.exports = {
	circle: function(ctx,pos,radius,color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, radius, 0, 2*Math.PI);
		ctx.fill();
	},
	line: function(ctx,pos1,pos2,width,color) {
		ctx.beginPath();
		ctx.moveTo(pos1.x, pos1.y);
		ctx.lineTo(pos2.x, pos2.y);
		ctx.lineWidth = width;
		ctx.strokeStyle = color;
		ctx.stroke();
	},
	clear: function(ctx, canvas) {
		ctx.fillStyle = 'white';
		ctx.fillRect(0,0,canvas.width, canvas.height);
	},

	text: function(ctx,text,size,color,pos) {
		ctx.fillStyle = color;
		ctx.font = size.toString() + 'px Helvetica';
		ctx.fillText(text, pos.x, pos.y);
	},
	menu: function() {
		// TODO
	}
};
