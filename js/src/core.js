var Orbits, Renderer, Physics, UI, Sat;
var sats = [], earth, debug;

(function(){
	Orbits = function(opts) {
		earth = opts.settings.earth;
		Orbits.setEarthMass(earth.m);
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
