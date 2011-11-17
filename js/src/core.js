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
