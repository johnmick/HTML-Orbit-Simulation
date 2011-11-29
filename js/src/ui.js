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
