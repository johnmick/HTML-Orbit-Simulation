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
