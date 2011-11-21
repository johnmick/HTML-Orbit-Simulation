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
