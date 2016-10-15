"use strict";

class zone_de_defilement {
	constructor(max_image, actual_photo) {
		this.max_image = max_image; // nombre d'images dans le dossier, a calculer de manière automatique avec controle presence miniature et grandes images
		this.actual_photo = actual_photo; // photo actuellement selectionnée (init sur la photo 1)
		this.remaining_width = 0; // pour savoir si on rajouter des miniatures dans le bandeau
		this.loaded_images = 0; // voir qu'on a bien chargé toutes les miniatures
		this.image_list = []; // liste contenant les miniatures a append au bandeau si besoin
		this.main_image = ""; // lien vers image principale 		
	}
	link_html(id) {
		this.html = document.getElementById(id);
	}
	link_main_zone(src, scaling = 95) {
		this.main_image = new Main_Image;
		this.main_image.link_html(src);
	}
	add_min(src, srcfull,num) {
		let minImage = document.createElement('img');
		minImage.src = src;
		minImage.srcfull = srcfull;		
		minImage.id = num;
		this.image_list.push(minImage);
		let tmp_lower_defile_zone = this;
		minImage.onload = function() {
			tmp_lower_defile_zone.loaded_images += 1;
			//resize
			let ratio_image = this.width / this.height;
			this.height = tmp_lower_defile_zone.html.offsetHeight;
			this.width = 1.0 * tmp_lower_defile_zone.html.offsetHeight * ratio_image;
			
			//si toutes les min sont loadees
			if (tmp_lower_defile_zone.loaded_images >= tmp_lower_defile_zone.max_image) {
				tmp_lower_defile_zone.draw();
				//tmp_lower_defile_zone.main_image.load_image(minImage.srcfull);
			}
		};
		minImage.onclick = function() {
			// resize la precedente image selectionnée
			tmp_lower_defile_zone.image_list[tmp_lower_defile_zone.actual_photo].width += 4;
			tmp_lower_defile_zone.image_list[tmp_lower_defile_zone.actual_photo].height += 4;
			// creation de la main image
			tmp_lower_defile_zone.main_image.load_image(this.srcfull);
			// choisi l'image selctionnée dans le bandeau
			tmp_lower_defile_zone.actual_photo = parseInt(this.id);
			// redessine le bandeau
			tmp_lower_defile_zone.draw();
		};
	}
	remaining_width_init(percent) {
		this.remaining_width = this.html.offsetWidth * percent;
	}
	clean_images() {
		this.remaining_width_init(0.95);
		if (this.html != "")
			while (this.html.hasChildNodes())
				this.html.removeChild(this.html.lastChild);
		for (i = 0; i < this.max_image; i++) {
			this.image_list[i].style.border = '';
		}
	}
	draw() {
		let current_list = [];
		// clear les images du bandeaux
		this.clean_images();
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
}

class Main_Image {
	constructor(scaling = 95) {
		this.scaling = scaling/100; 
	}
	// lie le bandeau a l'objet html
	link_html(id) {
		this.html = document.getElementById(id);
		this.html.onclick = function() {};
	}

	load_image(src) {
		// creation de la main image
		let main_image = document.createElement('img');

		main_image.onload = function() {
			console.log(this)
			//resize image
			let ratio_screen = tmp_overlay.html.offsetWidth / tmp_overlay.html.offsetHeight;
			let ratio_image = this.width / this.height;

			if (ratio_screen > ratio_image) {
				this.height = tmp_overlay.html.offsetHeight * this.scaling;
				this.width = this.height * ratio_image;
			} else {
				this.width = tmp_overlay.html.offsetWidth * this.scaling;
				this.height = this.width / ratio_image;
			}
			this.id = "main_image"
			this.margin = "auto";
			tmp_overlay.html.innerHTML = '';
			tmp_overlay.html.appendChild(this);
		};

		main_image.src = src;
		let tmp_overlay = this;
	}
}



var lower_defile_zone = new zone_de_defilement(24, 0);
lower_defile_zone.link_html("lower_zone_defilement");
lower_defile_zone.link_main_zone("main_image")

for (var i = 1; i < lower_defile_zone.max_image + 1; i++) {
	lower_defile_zone.add_min("images/Portfolio-min-" + i + ".jpg", "images/Portfolio-" + i + ".jpg",i - 1);
}

