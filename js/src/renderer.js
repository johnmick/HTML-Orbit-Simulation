(function(){
	var ctx;

	Renderer = function(opts) {
		ctx = UI.canvas.getContext('2d');

		drawCircle({
			x: opts.earthX,
			y: opts.earthY,
			radius: opts.earthR,
			strokeStyle: "#00FF00",
			fillStyle: "#00FF00"
		});

		return Renderer;
	};

	Renderer.drawSatellite = function(opts)
	{

	};

	Renderer.drawCircle = drawCircle;


	function drawCircle(opts)
	{
		if (opts.x !== undefined && opts.y !== undefined && opts.radius !== undefined)
		{
			ctx.beginPath();
			ctx.arc(opts.x, opts.y, opts.radius, 0, Math.PI*2, true);

			if (opts.strokeStyle !== undefined)
			{
				ctx.strokeStyle = opts.strokeStyle;
				ctx.stroke();
			}

			if (opts.fillStyle !== undefined)
			{
				ctx.fillStyle = opts.fillStyle;
				ctx.fill();
			}
		}
	}
})();
