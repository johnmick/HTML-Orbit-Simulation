var Orbits, sats=[], debug;

(function(){
	Orbits = function(opts) {
		Orbits.UI = UI(opts.ui);
		Orbits.Renderer = Renderer(opts.renderer);
		Orbits.Physics = Physics(opts.physics);
		debug = document.getElementById("DEBUG");
		return Orbits;
	};
})();
