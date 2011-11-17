(function(){
	window.Orbits = Orbits({
		renderer:{
			earthX:310,
			earthY:250,
			earthR:10
		},
		physics:{

		},
		ui:{
			canvas:"CANVAS_BOARD",
			satmass:"SAT_MASS_INPUT",
			earthmass:"EARTH_MASS_INPUT",
			initx:"INIT_X_INPUT",
			inity:"INIT_Y_INPUT",
			defaultsatmass:2,
			defaultearthmass:9,
			defaultinitx: 21,
			defaultinity: 31
		}
	});
})();
