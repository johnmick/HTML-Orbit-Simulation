(function(){
	window.Orbits = Orbits({
		renderer:{
			earthimg:"./images/earth.png"
		},
		physics:{

		},
		ui:{
			canvas:"CANVAS_BOARD",
			satmass:"SAT_MASS_INPUT",
			satmasslbl:"SAT_MASS_LBL",
			earthmass:"EARTH_MASS_INPUT",
			earthmasslbl:"EARTH_MASS_LBL",
			initx:"INIT_X_INPUT",
			initxlbl:"INIT_X_LBL",
			inity:"INIT_Y_INPUT",
			initylbl:"INIT_Y_LBL",
			defaultsatmass:1,
			defaultearthmass:1000,
			defaultinitx: -1,
			defaultinity: -.75 
		},
		settings:{
			earth: {
				x: 310,
				y: 250,
				r: 10,
				m: 50
			}
		}
	});

	setInterval(function(){
		Physics.reCalc();
		Renderer.redraw();
	}, 25);

})();
