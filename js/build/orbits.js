(function(){
var Orbits, Renderer, Physics, UI, Sat;
var sats = [], earth, debug;

(function(){
	Orbits = function(opts) {
		earth = opts.settings.earth;
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
		drawCircle(opts);
		var i;
		for (i = opts.xpoints.length-1; i > -1; i--)
		{
			drawCircle({
				x: opts.xpoints[i],
				y: opts.ypoints[i],
				radius:1,
				fillStyle: opts.colors[i]
			});
		}
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
    Physics = function(opts) {
			return Physics;
    };

		Physics.reCalc = function()
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
					s.u += (k * Math.cos(theta)) / s.m;
					s.v += (k * Math.sin(theta)) / s.m;
					s.xpoints.push(s.x);
					s.ypoints.push(s.y);
					s.colors.push(calcLineColor(s.initSpeed, Math.sqrt((s.u * s.u) + (s.v * s.v))));
					s.x += s.u;
					s.y += s.v;
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
	var canvas, satMass, earthMass, initX, initY, earthMassLbl, satMassLbl, initXLbl, initYLbl;

	UI = function(opts) {
		UI.canvas = canvas = document.getElementById(opts.canvas);
		satMass = document.getElementById(opts.satmass);
		earthMass = document.getElementById(opts.earthmass);
		initX = document.getElementById(opts.initx);
		initY = document.getElementById(opts.inity);

		earthMassLbl = document.getElementById(opts.earthmasslbl);
		earthMassLbl.innerHTML = opts.defaultearthmass;

		satMassLbl = document.getElementById(opts.satmasslbl);
		satMassLbl.innerHTML = opts.defaultsatmass;

		initXLbl = document.getElementById(opts.initxlbl);
		initXLbl.innerHTML = opts.defaultinitx;

		initYLbl = document.getElementById(opts.initylbl);
		initYLbl.innerHTML = opts.defaultinity;

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
	};

	Sat.prototype.draw = function()
	{
		Renderer.drawSatellite({
			x: this.x, 
			y: this.y,
			radius: 5,
			strokeStyle: "#FF0000",
			fillStyle: "#0000FF",
			xpoints:this.xpoints,
			ypoints:this.ypoints,
			colors:this.colors
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
			defaultsatmass:15,
			defaultearthmass:50,
			defaultinitx: .5,
			defaultinity: .5
		},
		settings:{
			earth: {
				x: 310,
				y: 250,
				r: 10,
				r2: 10*10
			}
		}
	});

	setInterval(function(){
		Physics.reCalc();
		Renderer.redraw();
	}, 25);

})();
})();
