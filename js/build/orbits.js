(function(){
var Orbits, sats=[], debug;

(function(){
	Orbits = function(opts) {
		Orbits.UI = UI(opts.ui);
		Orbits.Renderer = Renderer(opts.renderer);
		Orbits.Physics = Physics(opts.physics);
		debug = document.getElementById("DEBUG");
		return Orbits;
	};
})();
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
var Physics;

(function(){
	var timestep = 1;

	Physics = function(opts) {
		return Physics;
	};

	Physics.setTimestep = function(ts)
	{
		timestep = ts;
	};

	Physics.getTimestep = function()
	{
		return timestep;
	};

	Physics.reCalc = function(store)
	{
		var collisions = [];
		var loop = sats.length-1;

		for (var i = loop; i > -1; i--)
		{
			var satOne = sats[i];
			var collided = false;

			for (var k = loop; k > -1; k--)
			{
				var satTwo = sats[k];
				if (i !== k)
				{
					var xDiff = satOne.x - satTwo.x;
					var yDiff = satOne.y - satTwo.y;
					var d = xDiff * xDiff + yDiff * yDiff;

					// Check D for a Collision Event Here Otherwise Proceed
					// Need to handle collision removal much better
					if ( d <= satTwo.r2)
					{
						collisions.push(i);
						break;
					}
					else
					{
						var theta = Math.atan2(yDiff, xDiff);
						var k = -6.673e-3 * satTwo.m * satOne.m / d;
						//var k = -6.673e-11 * satTwo.m * satOne.m / d;
						satOne.u += ((k * Math.cos(theta)) / satOne.m) * timestep;
						satOne.v += ((k * Math.sin(theta)) / satOne.m) * timestep;
					}
				}
			}

			if (collided === false)
			{
				satOne.x += satOne.u * timestep;
				satOne.y += satOne.v * timestep;

				if (satOne.x < 0 || satOne. y < 0 || satOne.x > 1000 || satOne.y > 1000)
				{
					// Also not correct
					collisions.push(i);
				}

				if (store === true)
				{
					satOne.xpoints.push(satOne.x);
					satOne.ypoints.push(satOne.y);
					satOne.colors.push(calcLineColor(satOne.initSpeed, Math.sqrt((satOne.u * satOne.u) + (satOne.v * satOne.v))));
				}
			}
		}
		for (var i = collisions.length-1; i > -1; i--)
		{
			sats.splice(collisions[i], 1);
		}
	};

	function calcLineColor(initialMag, currentMag)
	{
		if (Math.abs(initialMag - currentMag) < .1)
		{
			return "rgb(256, 256, 0)";
		}
		else if (currentMag > initialMag * 1.5)
		{
			return "rgb(256, 0, 0)";
		}
		else  if (currentMag > initialMag)
		{
			return "rgb(256, 128, 128)";
		}
		else if (currentMag > initialMag / 1.2)
		{
			return "rgb(64, 64, 256)";
		}
		else
		{
			return "rgb(128, 256, 256)";
		}
	}
})();
var UI;

(function(){
	var canvas, satMass, initX, initY, satMassLbl, initXLbl, initYLbl, timeStepLbl, timestep, satRadius, satRadiusLbl;

	UI = function(opts) {
		UI.canvas = canvas = document.getElementById(opts.canvas);
		satMass = document.getElementById(opts.satmass);
		initX = document.getElementById(opts.initx);
		initY = document.getElementById(opts.inity);
		timestep = document.getElementById(opts.timestep);
		timeStepLbl = document.getElementById(opts.timesteplbl);
		satMassLbl = document.getElementById(opts.satmasslbl);
		initXLbl = document.getElementById(opts.initxlbl);
		initYLbl = document.getElementById(opts.initylbl);
		satRadius = document.getElementById(opts.satradius);
		satRadiusLbl = document.getElementById(opts.satradiuslbl);

		timeStepLbl.innerHTML = opts.defaulttimestep;
		satMassLbl.innerHTML = opts.defaultsatmass;
		initXLbl.innerHTML = opts.defaultinitx;
		initYLbl.innerHTML = opts.defaultinity;
		satRadiusLbl.innerHTML = opts.defaultsatradius;
		Physics.setTimestep(opts.defaulttimestep);

		$(timestep).slider({
			slide: function(event, ui)
			{
				var ts = parseFloat(ui.value);
				timeStepLbl.innerHTML = ts;
				Physics.setTimestep(ts);
			},
			value:opts.defaulttimestep,
			min:.01,
			max:.1,
			step:.01
		});

		$(satRadius).slider({
			slide: function(event, ui)
			{
				satRadiusLbl.innerHTML = ui.value;
			},
			value:opts.defaultsatradius,
			min:1,
			max:50,
			step:1
		});

		$(satMass).slider({
			slide: function(event, ui)
			{
				satMassLbl.innerHTML = ui.value;
			},
			value:opts.defaultsatmass,
			min:1,
			max:30,
			step:1
		});

		$(initX).slider({
			slide: function(event, ui)
			{
				initXLbl.innerHTML = ui.value;
			},
			value:opts.defaultinitx,
			min:-3,
			max:3,
			step:.5
		});

		$(initY).slider({
			slide: function(event, ui)
			{
				initYLbl.innerHTML = ui.value;
			},
			value:opts.defaultinity,
			min:-3,
			max:3,
			step:.5
		});

		$(satMass).val(opts.defaultsatmass);
		$(initX).val(opts.defaultinitx);
		$(initY).val(opts.defaultinity);
		$(UI.canvas).click(canvasClicked);
		$("#RESET_INPUT").click(function() { sats = []; });
		return UI;
	};

	UI.addSatellite = function(opts)
	{
		sats.push({
			x: opts.x,
			y: opts.y,
			m: opts.m*1000,
			u: opts.u,
			v: opts.v,
			c: opts.c,
			r2: opts.r * opts.r,
			initSpeed: Math.sqrt(opts.u*opts.u + opts.v*opts.v),
			xpoints: [],
			ypoints: [],
			colors: []
		});
	};

	function canvasClicked(e)
	{
		// Capture Mouse Cartesian Coordinate at Click Event
		var top = 0, left = 0, obj = canvas;
		while (obj.tagName != 'BODY') {
			top += canvas.offsetTop;
			left += canvas.offsetLeft;
			obj = obj.offsetParent;
		}

		UI.addSatellite({
			x: parseInt(e.clientX - left + window.pageXOffset),
			y: parseInt(e.clientY - top + window.pageYOffset),
			m: parseFloat($(satMass).slider("value")),
			u: parseFloat($(initX).slider("value")),
			v: parseFloat($(initY).slider("value")),
			r: parseFloat($(satRadius).slider("value"))
		});
	}
})();
(function(){
	window.Orbits = Orbits({
		renderer:{

		},
		physics:{

		},
		ui:{
			canvas:"CANVAS_BOARD",
			satradius:"SAT_RADIUS_INPUT",
			satradiuslbl:"SAT_RADIUS_LBL",
			satmass:"SAT_MASS_INPUT",
			satmasslbl:"SAT_MASS_LBL",
			initx:"INIT_X_INPUT",
			initxlbl:"INIT_X_LBL",
			inity:"INIT_Y_INPUT",
			initylbl:"INIT_Y_LBL",
			timesteplbl:"TIME_STEP_LBL",
			timestep:"TIME_STEP_INPUT",
			defaultsatradius:5,
			defaultsatmass:15,
			defaultinitx: 0,
			defaultinity: 1.5,
			defaulttimestep:.01
		},
		settings:{

		}
	});

	UI.addSatellite({x:300+25, y:200-25, u:0, v:0, m:25, r:5, c:"#FF0000"});
	UI.addSatellite({x:375, y:275, u:0, v:0, m:25, r:5, c:"#FF0000"});
	UI.addSatellite({x:300, y:350, u:0, v:0, m:25, r:5, c:"#FFFF00"});
	UI.addSatellite({x:225-25, y:275+25, u:0, v:0, m:25, r:5, c:"#FFFF00"});

	var times = 100000;
	var start = 0;
	var timer = setInterval(function(){
		Renderer.redraw();
		for (var i=30; i > -1; i--)
		{
			Physics.reCalc();
		}
		Physics.reCalc(true);
		start++;
		if (times === start)
		{
			console.log("Done");
			clearInterval(timer);
		}
	}, 25);

})();
})();
