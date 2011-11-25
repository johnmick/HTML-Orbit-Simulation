(function(){
	Sat = function(opts) {
		this.u = opts.u;
		this.v = opts.v;
		this.x = opts.x;
		this.y = opts.y;
		this.m = opts.m;
		this.initSpeed = Math.sqrt((opts.u * opts.u) + (opts.v * opts.v));
		this.xpoints = [];
		this.ypoints = [];
		this.colors = [];
	};

	Sat.prototype.draw = function()
	{
		Renderer.drawSatellite({
			x: this.x, 
			y: this.y,
			radius: 5,
			strokeStyle: "#FFFFFF",
			fillStyle: "#0000FF",
			xpoints:this.xpoints,
			ypoints:this.ypoints,
			colors:this.colors
		});
	};
})();
