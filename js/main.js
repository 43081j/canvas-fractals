var mandelbrot = function() {
	this.width = 100;
	this.height = 100;
	this.xmin = -2.5;
	this.xmax = 1.0;
	this.ymin = -1;
	this.ymax = 1;
	this.maxIter = 1000;
	this.defaults = {
		xmin: this.xmin,
		xmax: this.xmax,
		ymin: this.ymin,
		ymax: this.ymax,
		maxIter: this.maxIter
	};
}

mandelbrot.prototype.reset = function() {
	this.xmin = this.defaults.xmin;
	this.xmax = this.defaults.xmax;
	this.ymin = this.defaults.ymin;
	this.ymax = this.defaults.ymax;
	this.maxIter = this.defaults.maxIter;
}

mandelbrot.prototype.draw = function(c) {
	c.clear();
	var image = c.getImageData(0, 0, this.width, this.height);
	var xs = (this.xmax - this.xmin) / this.width,
		ys = (this.ymax - this.ymin) / this.height;
	for(var px = 0; px < this.width; px++) {
		for(var py = 0; py < this.height; py++) {
			var x0 = this.xmin + xs * px,
				y0 = this.ymax - ys * py,
				x = 0,
				y = 0,
				iter = 0;
			while((x*x + y*y) < (2*2) && iter < this.maxIter) {
				var temp = (x*x) - (y*y) + x0;
				y = 2*x*y + y0;
				x = temp;
				iter++;
			}
			var rgb = [0, 0, 0],
				colour = 3 * Math.log(iter) / Math.log(this.maxIter - 1);
			if(colour < 1) {
				rgb[0] = Math.round(255*colour);
			} else if(colour < 2) {
				rgb[0] = 255;
				rgb[1] = Math.round(255*(colour - 1));
			} else {
				rgb = [255, 255, 255];
			}
			var idx = (py * this.width + px) * 4;
			image.data[idx] = rgb[0];
			image.data[idx+1] = rgb[1];
			image.data[idx+2] = rgb[2];
			image.data[idx+3] = 255;
		}
	}
	c.putImageData(image, 0, 0);
}

$(function() {
	Sketch.create({
		container: document.getElementById('paintcontainer'),
		autoclear: false,
		fullscreen: false,
		height: $(window).height() - 200,
		width: $(window).width(),
		setup: function() {
			var self = this;
			this._mb = new mandelbrot();
			this._mb.width = this.width;
			this._mb.height = this.height;
			this._mb.draw(this);
			$('.tools-reset').click(function() {
				self._mb.reset();
				self._mb.draw(self);
			});
		},
		update: function() {
		},
		click: function() {
			var touch = this.touches[0],
				xdiff = this._mb.xmax - this._mb.xmin,
				ydiff = this._mb.ymax - this._mb.ymin,
				boxwidth = this._mb.width * 0.2,
				boxheight = this._mb.height * 0.2;
			this._mb.xmin += (touch.x - boxwidth) * (xdiff / this._mb.width);
			this._mb.xmax -= (this._mb.width - (touch.x + boxwidth)) * (xdiff / this._mb.width);
			this._mb.ymin += (this._mb.height - (touch.y + boxheight)) * (ydiff / this._mb.height);
			this._mb.ymax -= (touch.y - boxheight) * (ydiff / this._mb.height);
			this._mb.draw(this);
		}
	});
});
