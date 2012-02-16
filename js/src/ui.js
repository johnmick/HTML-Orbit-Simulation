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
