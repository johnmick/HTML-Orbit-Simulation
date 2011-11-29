(function(){
var Orbits, Renderer, Physics, UI, Sat;
var sats = [], earth, debug;

(function(){
	Orbits = function(opts) {
		earth = opts.settings.earth;
		Orbits.setEarthMass(earth.m);
		Orbits.UI = UI(opts.ui);
		Orbits.Renderer = Renderer(opts.renderer);
		Orbits.Physics = Physics(opts.physics);
		debug = document.getElementById("DEBUG");
		return Orbits;
	};

	Orbits.setEarthMass = function(mass)
	{
		earth.m = mass * 10e10;
	};
})();
(function(){
	var ctx, earthImg, earthImgLoaded = false;

	Renderer = function(opts) {
		ctx = UI.canvas.getContext('2d');
		earthImg = new Image();
		earthImg.src = opts.earthimg;
		earthImg.onload = function() { earthImgLoaded = true; };
		return Renderer;
	};

	Renderer.redraw = function()
	{
		clearCanvas();
		for (var sat in sats)
		{
			sats[sat].draw();
		}
		drawEarth();
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

	function clearCanvas()
	{
		ctx.clearRect(0, 0, UI.canvas.width, UI.canvas.height);
	}

	function drawEarth()
	{
		if (earthImgLoaded === false)
		{
			drawCircle({
				x: earth.x,
				y: earth.y,
				radius: earth.r,
				strokeStyle: "#00FF00",
				fillStyle: "#00FF00"
			});
		}
		else
		{
			ctx.drawImage(earthImg, earth.x-earthImg.width/2, earth.y-earthImg.height/2);
		}
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
	}
})();
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
		for (var i = sats.length-1; i > -1; i--)
		{
			var s = sats[i];
			var d = (s.x - earth.x) * (s.x - earth.x) + (s.y - earth.y) * (s.y - earth.y);

			if (d <= earth.r2)
			{
				collisions.push(i);
			}
			else
			{
				var theta = Math.atan2(s.y - earth.y, s.x - earth.x);
				var k = -6.67300e-11 * earth.m * s.m / d;
				s.u += ((k * Math.cos(theta)) / s.m) * timestep;
				s.v += ((k * Math.sin(theta)) / s.m) * timestep;

				if (store === true)
				{
					s.xpoints.push(s.x);
					s.ypoints.push(s.y);
					s.colors.push(calcLineColor(s.initSpeed, Math.sqrt((s.u * s.u) + (s.v * s.v))));
				}

				s.x += s.u * timestep;
				s.y += s.v * timestep;
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
(function(){
	var canvas, satMass, earthMass, initX, initY, earthMassLbl, satMassLbl, initXLbl, initYLbl, timeStepLbl, timestep;

	UI = function(opts) {
		UI.canvas = canvas = document.getElementById(opts.canvas);
		satMass = document.getElementById(opts.satmass);
		earthMass = document.getElementById(opts.earthmass);
		initX = document.getElementById(opts.initx);
		initY = document.getElementById(opts.inity);
		timestep = document.getElementById(opts.timestep);
		earthMassLbl = document.getElementById(opts.earthmasslbl);
		timeStepLbl = document.getElementById(opts.timesteplbl);
		satMassLbl = document.getElementById(opts.satmasslbl);
		initXLbl = document.getElementById(opts.initxlbl);
		initYLbl = document.getElementById(opts.initylbl);

		earthMassLbl.innerHTML = opts.defaultearthmass;
		timeStepLbl.innerHTML = opts.defaulttimestep;
		satMassLbl.innerHTML = opts.defaultsatmass;
		initXLbl.innerHTML = opts.defaultinitx;
		initYLbl.innerHTML = opts.defaultinity;
		Physics.setTimestep(opts.defaulttimestep);


		$(earthMass).slider({
			slide: function(event, ui)
			{
				var mass = parseFloat(ui.value);
				earthMassLbl.innerHTML = mass;
				Orbits.setEarthMass(mass);
			},
			value:opts.defaultearthmass,
			min:1,
			max:100,
			step:1
		});

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

		$(satMass).slider({
			slide: function(event, ui)
			{
				var mass = parseFloat(ui.value);
				satMassLbl.innerHTML = mass;
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
		$(earthMass).val(opts.defaultearthmass);
		$(initX).val(opts.defaultinitx);
		$(initY).val(opts.defaultinity);
		$(UI.canvas).click(canvasClicked);
		$("#RESET_INPUT").click(function() { sats = []; });
		return UI;
	};

	function canvasClicked(e)
	{
		var top = 0, left = 0, obj = canvas;
		while (obj.tagName != 'BODY') {
			top += canvas.offsetTop;
			left += canvas.offsetLeft;
			obj = obj.offsetParent;
		}

		Orbits.setEarthMass(parseFloat(earthMassLbl.innerHTML));

		sats.push(new Sat({
			x: parseInt(e.clientX - left + window.pageXOffset),
			y: parseInt(e.clientY - top + window.pageYOffset),
			u: parseFloat($(initX).slider("value")),
			v: parseFloat($(initY).slider("value")),
			m: parseFloat($(satMass).slider("value"))
		}));
	}
})();
(function(){
	Sat = function(opts) {
		this.u = opts.u;
		this.v = opts.v;
		this.x = opts.x;
		this.y = opts.y;
		this.m = opts.m;
		this.initSpeed = Math.sqrt((opts.u * opts.u) + (opts.v * opts.v));
		this.xpoints = [];
		this.ypoints = [];
		this.colors = [];
		this.c = opts.c;
	};

	Sat.prototype.draw = function()
	{
		Renderer.drawSatellite({
			x: this.x, 
			y: this.y,
			radius: 3.75,
			strokeStyle: "#FFFFFF",
			fillStyle: "#FFFFFF",
			xpoints:this.xpoints,
			ypoints:this.ypoints,
			colors:this.colors,
			c:this.c
		});
	};
})();
(function(){
	window.Orbits = Orbits({
		renderer:{
			earthimg:"./images/earth.png"
		},
		physics:{

		},
		ui:{
			canvas:"CANVAS_BOARD",
			satmass:"SAT_MASS_INPUT",
			satmasslbl:"SAT_MASS_LBL",
			earthmass:"EARTH_MASS_INPUT",
			earthmasslbl:"EARTH_MASS_LBL",
			initx:"INIT_X_INPUT",
			initxlbl:"INIT_X_LBL",
			inity:"INIT_Y_INPUT",
			initylbl:"INIT_Y_LBL",
			timesteplbl:"TIME_STEP_LBL",
			timestep:"TIME_STEP_INPUT",
			defaultsatmass:15,
			defaultearthmass:100,
			defaultinitx: 0,
			defaultinity: 1.5,
			defaulttimestep:.01
		},
		settings:{
			earth: {
				x: 310,
				y: 290,
				r: 10,
				r2: 10*10,
				m:50
			}
		}
	});

	setInterval(function(){
		Renderer.redraw();
		for (var i=30; i > -1; i--)
		{
			Physics.reCalc();
		}
		Physics.reCalc(true);
	}, 25);

	sats.push(new Sat({x:310, y:180, u:1.5, v:0, m:25, c:"#FF0000"}));
	sats.push(new Sat({x:310, y:400, u:-1.5, v:0, m:25, c:"#FFFF00"}));
	sats.push(new Sat({x:200, y:290, u:0, v:1.5, m:25, c:"#FF00FF"}));
	sats.push(new Sat({x:420, y:290, u:0, v:-1.5, m:25, c:"#00FFFF"}));
})();
})();
