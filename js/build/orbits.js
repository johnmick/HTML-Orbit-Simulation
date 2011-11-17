(function(){
var Orbits, Renderer, Physics, UI;
var sats = [];

(function(){
    Orbits = function(opts) {
			Orbits.UI = UI(opts.ui);
			Orbits.Renderer = Renderer(opts.renderer);
			Orbits.Physics = Physics(opts.physics);
			return Orbits;
    };
})();
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
(function(){
    Physics = function(opts) {
			return Physics;
    };
})();
(function(){
	var canvas, satMass, earthMass, initX, initY;

	UI = function(opts) {
		UI.canvas = canvas = document.getElementById(opts.canvas);
		satMass = document.getElementById(opts.satmass);
		earthMass = document.getElementById(opts.earthmass);
		initX = document.getElementById(opts.initx);
		initY = document.getElementById(opts.inity);

		$(satMass).val(opts.defaultsatmass);
		$(earthMass).val(opts.defaultearthmass);
		$(initX).val(opts.defaultinitx);
		$(initY).val(opts.defaultinity);

		$(UI.canvas).click(canvasClicked);
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

		sats.push({
			x: e.clientX - left + window.pageXOffset,
			y: e.clientY - top + window.pageYOffset,
			u: $(initX).val(),
			v: $(initY).val()
		});

		//Physics set satMass earthMass
		console.log(sats);


		/*
		Data.AddSatellite({
			satMass: $(satMass).val(),
			earthMass: $(earthMass).val(),
		});
		*/
	}
})();
(function(){
	window.Orbits = Orbits({
		renderer:{
			earthX:310,
			earthY:250,
			earthR:10
		},
		physics:{

		},
		ui:{
			canvas:"CANVAS_BOARD",
			satmass:"SAT_MASS_INPUT",
			earthmass:"EARTH_MASS_INPUT",
			initx:"INIT_X_INPUT",
			inity:"INIT_Y_INPUT",
			defaultsatmass:2,
			defaultearthmass:9,
			defaultinitx: 21,
			defaultinity: 31
		}
	});
})();
})();
