(function(){
	var canvas, satMass, earthMass, initX, initY, earthMassLbl;

	UI = function(opts) {
		UI.canvas = canvas = document.getElementById(opts.canvas);
		satMass = document.getElementById(opts.satmass);
		earthMass = document.getElementById(opts.earthmass);
		initX = document.getElementById(opts.initx);
		initY = document.getElementById(opts.inity);

		earthMassLbl = document.getElementById(opts.earthmasslbl);
		earthMassLbl.innerHTML = earth.m;
		console.log(earth.m);

		$(earthMass).slider({
			slide: function(event, ui)
			{
				var mass = parseFloat(ui.value);
				earthMassLbl.innerHTML = mass;
				Orbits.setEarthMass(mass);
			},
			value:earth.m,
			min:1,
			max:100,
			step:1
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
			u: parseFloat($(initX).val()),
			v: parseFloat($(initY).val()),
			m: parseFloat($(satMass).val())
		}));
	}
})();
