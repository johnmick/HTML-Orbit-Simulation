var Renderer;

(function(){

	// PRIVATE VARIABLES
	///i////////////////
	var ctx;

	// MODULE CONSTRUCTOR
	/////////////////////
	Renderer = function(opts) {
		ctx = UI.canvas.getContext('2d');
		return Renderer;
	};


	// PUBLIC FUNCTIONS
	///////////////////
	Renderer.redraw = function()
	{
		clearCanvas();
		for (var s in sats)
		{
			var sat = sats[s];
			this.drawSatellite({
				x: sat.x,
				y: sat.y,
				radius: 3.75,
				strokeStyle: "#FFFFFF",
				fillStyle: "#FFFFFF",
				xpoints:sat.xpoints,
				ypoints:sat.ypoints,
				colors:sat.colors,
				c:sat.c
			});
		}
	};

	Renderer.drawSatellite = function(opts)
	{
		var xpoints = opts.xpoints;
		var ypoints = opts.ypoints;
		var colors = opts.colors;
		var c = opts.c;
		for (var i = xpoints.length-1; i > -1; i=i-10)
		{
			if (c !== undefined)
			{
				drawCircle({
					x:xpoints[i],
					y:ypoints[i],
					radius:1.25,
					fillStyle:c
				});
			}
			else
			{
				drawCircle({
					x:xpoints[i],
					y:ypoints[i],
					radius:1.25,
					fillStyle:colors[i]
				});
			}
		}
		drawCircle(opts);
	};

	Renderer.drawSatelliteCollision = function(satOne, satTwo)
	{

	};

	// PRIVATE FUNCTIONS
	////////////////////
	function clearCanvas()
	{
		ctx.clearRect(0, 0, UI.canvas.width, UI.canvas.height);
	}

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
		else
		{
			console.log("Failed");

		}
	}
})();
