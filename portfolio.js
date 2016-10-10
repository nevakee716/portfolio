var links = document.getElementsByTagName('a'),
    linksLen = links.length;

for (var i = 0 ; i < linksLen ; i++) {

    links[i].onclick = function() { // J'utilise le DOM-0, mais vous pouvez très bien utiliser le DOM-2 !
        displaymain_Image(this);           // On appelle notre fonction pour afficher les images
        return false;               // Et on bloque la redirection
    };

}



// variable utilises
var minImage, oDest, i;


// recuperation du conteneur
oimage_defile = document.getElementById('image_defile');
oimage_defile.max_image = 24; // devrait etre loader en fonction du nombre de fonction
oimage_defile.used_number = 0;
oimage_defile.actual_photo = 0;
oimage_defile.start_point = 1;
image_defile(oimage_defile);

function image_defile(oimage_defile) {

	while (oimage_defile.hasChildNodes())
  		oimage_defile.removeChild(oimage_defile.lastChild);

	var remaining_width = oimage_defile.offsetWidth *0.95;
	
	if ( oimage_defile.actual_photo > oimage_defile.used_number/2) {
		oimage_defile.start_point = Math.round(oimage_defile.actual_photo - oimage_defile.used_number /2);
	}
	else 
	{
		oimage_defile.start_point = 1
	}

	oimage_defile.used_number = 0;
	for( i = oimage_defile.start_point; i < oimage_defile.max_image+1; i++){
			// creation de l'element image
			minImage = document.createElement('img');
			// affectation du nom de l'image
			minImage.src = "images/Portfolio-min-" + i +".jpg";
			// ajout d'un ID pour recuperation ulterieure
			minImage.id = 'Portfolio-' +i;
			minImage.number = i;

			// devrait y avoir un truc pour etre sur que minImage.src est chargé
			var ratio_image = minImage.width / minImage.height; 
			minImage.height = oimage_defile.offsetHeight;
			minImage.width = oimage_defile.offsetHeight* ratio_image;

			if( oimage_defile.actual_photo == i) {
				minImage.style.border='2px solid #E8272C'; // selection de l'image
			}

			remaining_width -= minImage.width ;
			if(remaining_width > 0) { // plus assez de places dans la bande deroulante
				oimage_defile.used_number += 1;
				// ajout au conteneur
			  	oimage_defile.appendChild(minImage);
			}

	}
	// revoir ordre les min images ne sont pas loadées

	// donne le pouvoir de on.click au images du bandeau deroulant, faudrait tetre faire une classe miniature
	for( i = oimage_defile.start_point; i < oimage_defile.start_point + oimage_defile.used_number+1; i++){
		document.getElementById('Portfolio-' + i).onclick = function() {
			//on met l'image dans l'overlay
			var main_image = new Image(),
		    overlay = document.getElementById('overlay');
		    overlay.onclick = function() {}

		    //resize quand on load la main image
		    main_image.onload = function() {
				var ratio_screen = overlay.offsetWidth / overlay.offsetHeight;
				var ratio_image = main_image.width / main_image.height;
				if (ratio_screen > ratio_image) {
			   		main_image.height = overlay.offsetHeight*0.95;
					main_image.width = main_image.height * ratio_image;
				}
				else {
			   		main_image.width = overlay.offsetWidth*0.95;
					main_image.height = main_image.width / ratio_image;
				}
				main_image.id = "main_image"
				main_image.margin= "auto";
		        overlay.innerHTML = '';
		        overlay.appendChild(main_image);
		    };

		    main_image.src = "images/"+ this.id + ".jpg";

		    // actualisation bandeau deroulant en fonction de la position
		    oimage_defile = document.getElementById('image_defile');
		    oimage_defile.actual_photo = this.number;
		    image_defile(oimage_defile);
		};
	}
}






document.getElementById('overlay').onclick = function() {
    this.style.display = 'none';
};