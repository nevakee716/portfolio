var zone_defile = {
	max_image: 24, // nombre d'images dans le dossier, a calculer de manière automatique avec controle presence miniature et grandes images
	actual_photo: 0, // photo actuellement selectionnée (init sur la photo 1)
	start_point: 1, //
	remaining_width: 0, // pour savoir si on rajouter des miniatures dans le bandeau
	loaded_images: 0, // voir qu'on a bien chargé toutes les miniatures
	image_list: [], // liste contenant les miniatures a append au bandeau si besoin
	// lie le bandeau a l'objet html
	load_html: function(id) {
		this.html = document.getElementById(id);
	},
	//ajoute la miniature src et lui donne un id num
	add_min: function(src, num) {
		minImage = document.createElement('img');
		minImage.src = src;
		minImage.id = num;
		this.image_list.push(minImage);

		minImage.onload = function() {
			zone_defile.loaded_images += 1;
			//resize
			var ratio_image = this.width / this.height;
			this.height = zone_defile.html.offsetHeight;
			this.width = 1.0 * zone_defile.html.offsetHeight * ratio_image;
			//si toutes les min sont loadees
			if (zone_defile.loaded_images >= zone_defile.max_image) {
				zone_defile.draw();
				overlay.load_image("images/Portfolio-" + (parseInt(zone_defile.actual_photo) + 1) + ".jpg");
			}
		};

		minImage.onclick = function() {
			// resize la precedente image selectionnée
			zone_defile.image_list[zone_defile.actual_photo].width += 4;
			zone_defile.image_list[zone_defile.actual_photo].height += 4;
			// creation de la main image
			var main_image = new Image();
			overlay.html.onclick = function() {} //zoom?
			overlay.load_image("images/Portfolio-" + (parseInt(this.id) + 1) + ".jpg");
			// choisi l'image selctionnée dans le bandeau
			zone_defile.actual_photo = parseInt(this.id);
			// redessine le bandeau
			zone_defile.draw();
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
		// clear les images du bandeaux
		this.clean_image();
		// on créee un bandeau qui aura l'actualphoto en centrale, on ajoute les images après et avant tant qu'on a de la place
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
		//on trie notre liste d'images à afficher
		current_list.sort((a, b) => a - b);

		//on append les min images au beandeau
		for (var j in current_list) {
			this.html.appendChild(this.image_list[current_list[j]]);
		}
	}



};

var overlay = {
	// lie le bandeau a l'objet html
	load_html: function(id) {
		this.html = document.getElementById(id);
	},
	load_image: function(src) {
		// creation de la main image
		var main_image = new Image();
		main_image.src = src;

		main_image.onload = function() {
			//resize image
			
			var ratio_screen = overlay.html.offsetWidth / overlay.html.offsetHeight;
			var ratio_image = this.width / this.height;
			if (ratio_screen > ratio_image) {
				this.height = overlay.html.offsetHeight * 0.95;
				this.width = this.height * ratio_image;
			} else {
				this.width = overlay.html.offsetWidth * 0.95;
				this.height = this.width / ratio_image;
			}
			this.id = "main_image"
			this.margin = "auto";
			overlay.html.innerHTML = '';
			overlay.html.appendChild(this);
		};
	}
}


zone_defile.load_html("lower_zone_defilement");
overlay.load_html("main_image");

console.log("zone_defile")
console.log("overlay")
zone_defile.remaining_width_init();
zone_defile.html.onclick = function() {} //zoom?

for (i = 1; i < zone_defile.max_image + 1; i++) {
	zone_defile.add_min("images/Portfolio-min-" + i + ".jpg", i - 1);
}



