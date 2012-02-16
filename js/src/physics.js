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
