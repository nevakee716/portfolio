// variable utilises
var minImage, oDest, i;


var zone_defile = {
	max_image: 24,
	used_number: 0,
	actual_photo: 0,
	start_point: 1,
	remaining_width: 0,
	loaded_images: 0,
	image_list: [],
	load_html: function(id) {
		this.html = document.getElementById(id);
	},
	add_min: function(src, num) {
		minImage = document.createElement('img');
		minImage.src = src;
		minImage.id = num;
		this.image_list.push(minImage);
		minImage.onload = function() {
			zone_defile.loaded_images += 1;
			var ratio_image = this.width / this.height;
			this.height = zone_defile.html.offsetHeight;
			this.width = 1.0 * zone_defile.html.offsetHeight * ratio_image;
			if (zone_defile.loaded_images >= zone_defile.max_image) {
				zone_defile.draw();
			}
		};

		minImage.onclick = function() {

			zone_defile.image_list[zone_defile.actual_photo].width += 4;
			zone_defile.image_list[zone_defile.actual_photo].height += 4;

			var main_image = new Image();
			overlay = document.getElementById('overlay');
			overlay.onclick = function() {} //zoom?
			main_image.src = "images/Portfolio-" + (parseInt(this.id) + 1) + ".jpg";
			zone_defile.actual_photo = parseInt(this.id);
			zone_defile.draw();
			//resize quand on load la main image
			main_image.onload = function() {
				var ratio_screen = overlay.offsetWidth / overlay.offsetHeight;
				var ratio_image = main_image.width / main_image.height;
				if (ratio_screen > ratio_image) {
					main_image.height = overlay.offsetHeight * 0.95;
					main_image.width = main_image.height * ratio_image;
				} else {
					main_image.width = overlay.offsetWidth * 0.95;
					main_image.height = main_image.width / ratio_image;
				}
				main_image.id = "main_image"
				main_image.margin = "auto";
				overlay.innerHTML = '';
				overlay.appendChild(main_image);
			};
		};
	},
	remaining_width_init: function(percent) {
		this.remaining_width = this.html.offsetWidth * percent;
	},
	clean_image: function() {
		this.remaining_width_init(0.95);
		if (this.html != "")
			while (this.html.hasChildNodes())
				this.html.removeChild(this.html.lastChild);
		for (i = 0; i < this.max_image; i++) {
			this.image_list[i].style.border = '';
		}
	},
	draw: function() {
		var current_list = [];
		this.clean_image();
		if (this.image_list[this.actual_photo]) {
			this.image_list[this.actual_photo].style.border = '2px solid #E8272C';
			this.image_list[this.actual_photo].width -= 4;
			this.image_list[this.actual_photo].height -= 4;
			current_list.push(this.actual_photo);
			this.remaining_width -= this.image_list[this.actual_photo].width;
		}
		i = 1
		while (this.remaining_width > 0 && i < this.max_image) {

			if (this.image_list[this.actual_photo + i]) {
				this.remaining_width -= this.image_list[this.actual_photo + i].width;
				if (this.remaining_width > 0) {
					current_list.push(this.actual_photo + i);
				}
			}

			if (this.image_list[this.actual_photo - i]) {
				this.remaining_width -= this.image_list[this.actual_photo - i].width;
				if (this.remaining_width > 0) {
					current_list.push(this.actual_photo - i);
				}
			}

			i += 1;
		}
		current_list.sort((a, b) => a - b);


		for (var j in current_list) {
			this.html.appendChild(this.image_list[current_list[j]]);
		}
	}



};

zone_defile.load_html("zone_defilement");
zone_defile.remaining_width_init();


for (i = 1; i < zone_defile.max_image + 1; i++) {
	zone_defile.add_min("images/Portfolio-min-" + i + ".jpg", i - 1);
}


document.getElementById('overlay').onclick = function() {
	//this.style.display = 'none';
};