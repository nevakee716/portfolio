"use strict";

class zone_de_defilement {
	constructor(max_image, actual_photo) {
		this.max_image = max_image; // nombre d'images dans le dossier, a calculer de manière automatique avec controle presence miniature et grandes images
		this.actual_photo = actual_photo; // photo actuellement selectionnée (init sur la photo 1)
		this.remaining_width = 0; // pour savoir si on rajouter des miniatures dans le bandeau
		this.loaded_images = 0; // voir qu'on a bien chargé toutes les miniatures
		this.image_list = []; // liste contenant les miniatures a append au bandeau si besoin
		this.arrows = [];
		this.main_image = ""; // lien vers image principale 		
	}
	link_html(id) {
		this.html = document.getElementById(id);
	}
	link_main_zone(src, scaling = 95) {
		this.main_image = new Main_Image;
		this.main_image.link_html(src);
	}
	link_category_bar(src) {
		this.category_bar = new Category_Bar;
		this.category_bar.link_html(src);
	}
	add_min(src, srcfull,num) {
		let minImage = document.createElement('img');
		minImage.src = src;
		minImage.srcfull = srcfull;		
		minImage.id = num;
		this.image_list.push(minImage);
		let tmp_lower_defile_zone = this;
		minImage.onload = function() {

			//resize
			let ratio_image = this.width / this.height;
			this.height = tmp_lower_defile_zone.html.offsetHeight;
			this.width = 1.0 * tmp_lower_defile_zone.html.offsetHeight * ratio_image;
			
			EXIF.getData(this, function() {
				tmp_lower_defile_zone.loaded_images += 1;
				this.category = EXIF.getAllTags(this,"keywords")["keywords"];
				tmp_lower_defile_zone.category_bar.add(this.category);
				//si toutes les min sont loadees
				if (tmp_lower_defile_zone.loaded_images >= tmp_lower_defile_zone.max_image) {
					tmp_lower_defile_zone.activate_keyboard();
					tmp_lower_defile_zone.draw();
					tmp_lower_defile_zone.category_bar.draw();
					tmp_lower_defile_zone.main_image.load_image(tmp_lower_defile_zone.image_list[tmp_lower_defile_zone.actual_photo].srcfull);
				}
			});
		}
		
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
	activate_keyboard() {
		let tmp_lower_defile_zone = this;
		document.onkeydown = function(e) {
			if (e.keyCode == '37') {
					tmp_lower_defile_zone.go_direction(-1);
			}
			else if (e.keyCode == '39') {
					tmp_lower_defile_zone.go_direction(1);
			}
	    };
	}
	remaining_width_init(percent) {
		this.remaining_width = this.html.offsetWidth * percent;
	}
	add_arrows(src_left,src_right) {
		this.loaded_images -= 2; 
		let tmp_lower_defile_zone = this;

		let arrow_left = document.createElement('img');
		arrow_left.src = src_left;
		arrow_left.id = "arrow_left";
		this.arrows.push(arrow_left);
		arrow_left.onload = function() {
			tmp_lower_defile_zone.loaded_images += 1;
			//resize
			let ratio_image = this.width / this.height;
			this.height = tmp_lower_defile_zone.html.offsetHeight;
			this.width = 0.5 * tmp_lower_defile_zone.html.offsetHeight * ratio_image;
		};
		arrow_left.onclick = function() {tmp_lower_defile_zone.go_direction(-1)};

		let arrow_right = document.createElement('img');
		arrow_right.src = src_right;
		arrow_right.id = "arrow_right";
		this.arrows.push(arrow_right);
		arrow_right.onload = function() {
			tmp_lower_defile_zone.loaded_images += 1;
			//resize
			let ratio_image = this.width / this.height;
			this.height = tmp_lower_defile_zone.html.offsetHeight;
			this.width = 0.5 * tmp_lower_defile_zone.html.offsetHeight * ratio_image;
		};
		arrow_right.onclick = function() {tmp_lower_defile_zone.go_direction(1)};

	}

	go_direction(direction) {
		if((direction > 0 && this.actual_photo < this.max_image-1) || (direction < 0 && this.actual_photo > 0)) {
			// resize la precedente image selectionnée
			this.image_list[this.actual_photo].width += 4;
			this.image_list[this.actual_photo].height += 4;
			// creation de la main image
			this.actual_photo += direction;
			this.main_image.load_image(this.image_list[this.actual_photo].srcfull);
			// redessine le bandeau
			this.draw();
		}
	};

	clean_images() {
		this.remaining_width_init(1);
		if (this.html != "")
			while (this.html.hasChildNodes())
				this.html.removeChild(this.html.lastChild);
		for (let i = 0; i < this.max_image; i++) {
			this.image_list[i].style.border = '';
		}
	}
	draw() {
		let current_list = [];
		// clear les images du bandeaux
		this.clean_images();
		if(this.arrows != []) {
			this.remaining_width -= this.arrows[0].width;
			this.remaining_width -= this.arrows[1].width;
		}
		// on créee un bandeau qui aura l'actualphoto en centrale, on ajoute les images après et avant tant qu'on a de la place
		if (this.image_list[this.actual_photo]) {
			this.remaining_width -= this.image_list[this.actual_photo].width;
			this.image_list[this.actual_photo].style.border = '2px solid #E8272C';
			this.image_list[this.actual_photo].width -= 4;
			this.image_list[this.actual_photo].height -= 4;
			current_list.push(this.actual_photo);
		}
		let i = 1
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

		if(this.arrows != [] && this.actual_photo != 0) {
			this.html.appendChild(this.arrows[0]);
		}
		//on append les min images au beandeau
		for (let j in current_list) {
			this.html.appendChild(this.image_list[current_list[j]]);
		}
		if(this.arrows != [] && this.actual_photo != this.max_image - 1) {
			this.html.appendChild(this.arrows[1]);
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
	clean() {
		if (this.html != "")
			while (this.html.hasChildNodes())
				this.html.removeChild(this.html.lastChild);
	}
	load_image(src) {
		this.clean()
		// creation de la main image
		let tmp_overlay = this;
		
		let middle_image = document.createElement('img');
		middle_image.src = src;
		middle_image.onload = function() {
			//resize image
			let ratio_screen = tmp_overlay.html.offsetWidth / tmp_overlay.html.offsetHeight;
			let ratio_image = this.width / this.height;
			if (ratio_screen > ratio_image) {
				this.height = tmp_overlay.html.offsetHeight * tmp_overlay.scaling;
				this.width = this.height * ratio_image;
			} else {
				this.width = tmp_overlay.html.offsetWidth * tmp_overlay.scaling;
				this.height = this.width / ratio_image;
			}
			this.id = "middle_image"
			this.margin = "auto";
			tmp_overlay.html.innerHTML = '';
			tmp_overlay.html.appendChild(this);
		};

	}
}

class Category_Bar {
	constructor(scaling = 100) {
		this.scaling = scaling/100; 
		this.categories = ["All"];
	}
	// lie le bandeau a l'objet html
	link_html(id) {
		this.html = document.getElementById(id);
		this.html.onclick = function() {};
	}
	clean() {
		if (this.html != "")
			while (this.html.hasChildNodes())
				this.html.removeChild(this.html.lastChild);
	}

	add(category) {
		if(category.constructor === Array) {
			for (let j in category) {
				if (!this.categories.includes(category[j])) {
					this.categories.push(category[j]);
				}
			}
		}
		else {
			if (!this.categories.includes(category)) {
					this.categories.push(category);
			}
		}
	}
	draw() {
		let table = document.createElement('table');
		let tr = document.createElement('tr');
		table.id = "category_bar_table";
		let nbr_of_letter = 0;
		for (let j in this.categories) {
			nbr_of_letter += this.categories[j].length + 1;
		}
		let pxW = this.html.offsetWidth / nbr_of_letter;
		for (let j in this.categories) {
			let td = document.createElement('td');
			td.class = "category_cell";
			td.style.fontSize  = pxW * 2,5;
			let content = document.createTextNode(this.categories[j]);


			td.onclick = function() {

    			this.style.borderCollapse = "collapse"; /*replaces table attribute cellspacing*/
    			this.style.borderStyle  = "solid"; /*replaces table attribute border */
   				this.style.borderWidth = "2px";
   				this.style.borderColor = "white";


			};

			td.appendChild(content);
			tr.appendChild(td);
		}
		table.style.height = this.html.offsetHeight;
		table.appendChild(tr);
		this.html.appendChild(table);
	}
}



//<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
//var socket = io.connect('http://localhost:8080');
//socket.on('message', function(message) {
//    if(message == "connected") {
//    	console.log(message);
//    	socket.emit('message',"update_json")
//    }
//    if(message == "update_json_done") {
//
//		var portfolio_list = JSON.parse("list_portfolio.json");
//    }
//})








var lower_defile_zone = new zone_de_defilement(24, 0);
	lower_defile_zone.link_html("lower_zone_defilement");
	lower_defile_zone.link_main_zone("main_middle_zone");
	lower_defile_zone.link_category_bar("category_bar_top_zone")
	lower_defile_zone.add_arrows("images/arrow_left.png","images/arrow_right.png");


// load category
for (let i = 10; i < lower_defile_zone.max_image + 10; i++) {
	lower_defile_zone.add_min("images/Portfolio-min-" + i + ".jpg", "images/Portfolio-" + i + ".jpg",i - 10);
}


