(function(){
	window.Orbits = Orbits({
		renderer:{

		},
		physics:{

		},
		ui:{
			canvas:"CANVAS_BOARD",
			satradius:"SAT_RADIUS_INPUT",
			satradiuslbl:"SAT_RADIUS_LBL",
			satmass:"SAT_MASS_INPUT",
			satmasslbl:"SAT_MASS_LBL",
			initx:"INIT_X_INPUT",
			initxlbl:"INIT_X_LBL",
			inity:"INIT_Y_INPUT",
			initylbl:"INIT_Y_LBL",
			timesteplbl:"TIME_STEP_LBL",
			timestep:"TIME_STEP_INPUT",
			defaultsatradius:5,
			defaultsatmass:15,
			defaultinitx: 0,
			defaultinity: 1.5,
			defaulttimestep:.01
		},
		settings:{

		}
	});

	UI.addSatellite({x:300+25, y:200-25, u:0, v:0, m:25, r:5, c:"#FF0000"});
	UI.addSatellite({x:375, y:275, u:0, v:0, m:25, r:5, c:"#FF0000"});
	UI.addSatellite({x:300, y:350, u:0, v:0, m:25, r:5, c:"#FFFF00"});
	UI.addSatellite({x:225-25, y:275+25, u:0, v:0, m:25, r:5, c:"#FFFF00"});

	var times = 100000;
	var start = 0;
	var timer = setInterval(function(){
		Renderer.redraw();
		for (var i=30; i > -1; i--)
		{
			Physics.reCalc();
		}
		Physics.reCalc(true);
		start++;
		if (times === start)
		{
			console.log("Done");
			clearInterval(timer);
		}
	}, 25);

})();
