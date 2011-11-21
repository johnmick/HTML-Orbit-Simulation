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
		drawEarth();
		for (var sat in sats)
		{
			sats[sat].draw();

		}
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
			ctx.drawImage(earthImg, earth.x, earth.y);
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
			for (var sat in sats)
			{
				var s = sats[sat];
				var d = (s.x + earth.x) * (s.x + earth.x) + (s.y + earth.y) * (s.y + earth.y);
				var theta = Math.atan2(s.y - earth.y, s.x - earth.x);
				var k = -6.67300e-11 * earth.m * s.m / d;
				s.u += k * Math.cos(theta);
				s.v += k * Math.sin(theta);
				s.xpoints.push(s.x);
				s.ypoints.push(s.y);
				s.colors.push(calcLineColor(s.initSpeed, Math.sqrt((s.u * s.u) + (s.v * s.v))));
				
				s.x += s.u;
				s.y += s.v;
			}
		};

		function calcLineColor(initialMag, currentMag)
		{
			if (Math.abs(initialMag - currentMag) < .1)
			{
				debug.innerHTML = "Close to Original";
				return "rgb(256, 256, 0)";
			}
			else if (currentMag > initialMag * 1.5)
			{
				return "rgb(256, 0, 0)";
			}
			else  if (currentMag > initialMag)
			{
				debug.innerHTML = "Faster to Original";
				return "rgb(256, 128, 128)";
			}
			else if (currentMag > initialMag / 1.2)
			{
				debug.innerHTML = "Slower Than Half";
				return "rgb(64, 64, 256)";
			}
			else
			{
				debug.innerHTML = "Slowest";
				return "rgb(128, 256, 256)";
			}
		}
})();
(function(){
	var canvas, satMass, earthMass, initX, initY, earthMassLbl;

	UI = function(opts) {
		UI.canvas = canvas = document.getElementById(opts.canvas);
		satMass = document.getElementById(opts.satmass);
		earthMass = document.getElementById(opts.earthmass);
		initX = document.getElementById(opts.initx);
		initY = document.getElementById(opts.inity);

		earthMassLbl = document.getElementById(opts.earthmasslbl);

		$(earthMass).slider({
			slide: function(event, ui)
			{
				earthMassLbl.innerHTML = ui.value;
			}
			
		});

		$(satMass).val(opts.defaultsatmass);
		$(earthMass).val(opts.defaultearthmass);
		$(initX).val(opts.defaultinitx);
		$(initY).val(opts.defaultinity);

		$(UI.canvas).click(canvasClicked);
		$("#RESET_INPUT").click(function() { sats = []; });
		$(earthMass).change(function(){
			earth.m = parseFloat($(earthMass).val()) * 1e11;
			console.log("Changed");
		});
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

		earth.m = parseFloat($(earthMass).val()) * 1e11;

		sats.push(new Sat({
			x: parseInt(e.clientX - left + window.pageXOffset),
			y: parseInt(e.clientY - top + window.pageYOffset),
			u: parseFloat($(initX).val()),
			v: parseFloat($(initY).val()),
			m: parseFloat($(satMass).val())
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
			earthmass:"EARTH_MASS_INPUT",
			earthmasslbl:"EARTH_MASS_LBL",
			initx:"INIT_X_INPUT",
			inity:"INIT_Y_INPUT",
			defaultsatmass:1,
			defaultearthmass:1000,
			defaultinitx: -1,
			defaultinity: .2
		},
		settings:{
			earth: {
				x: 310,
				y: 250,
				r: 10,
				m: 100
			}
		}
	});

	setInterval(function(){
		Physics.reCalc();
		Renderer.redraw();
	}, 25);

})();
})();
