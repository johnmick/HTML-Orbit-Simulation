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
