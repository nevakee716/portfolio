(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var NevakeeMenuProto = Object.create(HTMLElement.prototype);

NevakeeMenuProto.createdCallback = function () {};

NevakeeMenuProto.attachededCallback = function () {};

NevakeeMenuProto.addCategories = function (menus) {
	this.categories = [];
	menus.forEach(function (menuItem) {
		this.categories.push([menuItem,true]);
	}, this);

	this._drawMenu();
};

NevakeeMenuProto.getSelectedCategories = function (menus) {
	var selectedCategories = [];
	this.categories.forEach(function (menuItem) {
		if (menuItem[1] === true)
		selectedCategories.push(menuItem[0]);
	}, this);
	return selectedCategories;
};



NevakeeMenuProto._drawMenu = function () {
	var element = null;
	var fragment = document.createDocumentFragment();
	var i = 0;
	element = document.createElement("div");
	fragment.appendChild(element);
	element.textContent = "All";
	element.className = "menu-item";
	element.id = "All";
	this._applyStyleSelected(element);
	fragment.appendChild(element);
	
	this.categories.forEach(function (menuItem) {
		element = document.createElement("div");
		element.className = "menu-item";
		element.id = i;
		element.textContent = menuItem[0]; //.label;
		this._applyStyleSelected(element);
		i++;
		fragment.appendChild(element);
	}, this);
	this.numberOfCategoriesOn = this.categories.length;	
	this.appendChild(fragment);
	this.addEventListener("click", this._onClick.bind(this), false);
};

NevakeeMenuProto._drawText = function (id) {
	//snapshot des etats des categories
	var previousStateOfCategories = [];
	for (var i = 0; i < this.categories.length; i++) { 
		previousStateOfCategories.push(this.categories[i][1])
	}

	//modification des categories en fonction du click
	if(id !== "All") {
		if(this.numberOfCategoriesOn == this.categories.length) {
			this.categories.forEach(function (menuItem) {
				menuItem[1] = false; 
			}, this);
			this.numberOfCategoriesOn = 1;
			this.categories[id][1] = true;
		}
		else if(this.categories[id][1] === false) {
			this.numberOfCategoriesOn ++;	
			this.categories[id][1] = true;
		} else {
			this.numberOfCategoriesOn --;	
			this.categories[id][1] = false;
		}
	} else {
		this.categories.forEach(function (menuItem) {
			menuItem[1] = true; 
		}, this);
		this.numberOfCategoriesOn = this.categories.length;	
	}

	
	if(this.numberOfCategoriesOn == 0 || this.numberOfCategoriesOn == this.categories.length) {
		this._highlightAll();	
	}
	else {
		for (var i = 0; i < this.categories.length; i++) { 
			if(previousStateOfCategories[i] !== this.categories[i]) { // on vérifie que l'état à changer
			    if(this.categories[i][1] == true) {
			    	this._highlight(i);
			    } else {
			    	this._downlight(i);
			    }
			}
		}
	}
};


NevakeeMenuProto._highlight = function (id) {
	var element = document.getElementById(id);
	if (element) {
		this._applyStyleSelected(element);
	} else {
		console.log("element Id : " + id + " not found");
	}
};

NevakeeMenuProto._downlight = function (id) {
	var element = document.getElementById(id);
	if (element) {
		this._unApplyStyleSelected(element);
	} else {
		console.log("element Id : " + id + " not found");
	}
};

NevakeeMenuProto._highlightAll = function (){
	var elements = document.getElementsByClassName("menu-item");
	for (var i = 0; i < elements.length; i++) { 
	    this._applyStyleSelected(elements[i]);
	}
};

NevakeeMenuProto._applyStyleSelected = function (element){
	element.style.color = "yellow";
	element.style.textDecoration= "underline";
};

NevakeeMenuProto._unApplyStyleSelected = function (element){
	element.style.color = "white";
	element.style.textDecoration= "none";
};



NevakeeMenuProto._onClick = function (event) {
	var newEvent = document.createEvent('Event');
	newEvent.id = event.target.id;
	this._drawText(newEvent.id);
	newEvent.initEvent('on-menu-clicked', true, true);
	this.dispatchEvent(newEvent);
};

NevakeeMenuProto.detachedCallback = function () {};

NevakeeMenuProto.attributeChangedCallback = function () {};

document.registerElement('nevakee-menu', {prototype: NevakeeMenuProto});
},{}],2:[function(require,module,exports){
"use strict";

var NevakeePhotoModel = Object.create(HTMLElement.prototype);

NevakeePhotoModel.createdCallback = function () {};

NevakeePhotoModel.attachededCallback = function () {};

NevakeePhotoModel.loadData = function (src,callback2) {

	function jsonLoaded(response,callback) {
	    this.index = JSON.parse(response);
        return callback2();
	};

	// Call to function with anonymous callback
	this._loadJSON(src,jsonLoaded.bind(this));
};


NevakeePhotoModel._loadJSON = function (src,callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', src, true);


    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}

NevakeePhotoModel.getCategories = function () {
    var listCategories = [];
    for (var photoId in this.index) {
        if (this.index.hasOwnProperty(photoId)) {
            if (this.index[photoId].hasOwnProperty("category")) {
                if (!listCategories.includes(this.index[photoId].category)) {
                    listCategories.push(this.index[photoId].category);
                }
            }    
        }
    }
    return listCategories;
}

NevakeePhotoModel.getAllSrcMin = function () {
    var SrcsMin = {};
    for (var photoId in this.index) {
        if (this.index.hasOwnProperty(photoId)) {
            if (this.index[photoId].hasOwnProperty("src_min")) {
                SrcsMin[photoId] = this.index[photoId].src_min;
            }    
        }
    }
    return SrcsMin;
}

NevakeePhotoModel.getSrcFull = function (photoId) {
    if (this.index[photoId].hasOwnProperty("src_full")) {
        return this.index[photoId].src_full;
    }
}


NevakeePhotoModel._onClick = function (event) {
	var newEvent = document.createEvent('Event');
	newEvent.id = event.target.dataset.id;
	newEvent.initEvent('on-menu-clicked', true, true);
	this.dispatchEvent(newEvent);
};

NevakeePhotoModel.detachedCallback = function () {};

NevakeePhotoModel.attributeChangedCallback = function () {};

document.registerElement('nevakee-photo-model', {prototype: NevakeePhotoModel});
},{}],3:[function(require,module,exports){
"use strict";

var NevakeePortfolioProto = Object.create(HTMLElement.prototype);

NevakeePortfolioProto.createdCallback = function () {
	this.innerHTML 	= "<nevakee-menu></nevakee-menu>"
					+ "<div class='image-container' id='main-image-container'></div>"
					+ "<nevakee-zone-defilement></nevakee-zone-defilement>"
					+ "<nevakee-photo-model></nevakee-photo-model>";

	this._menu = this.querySelector("nevakee-menu");
	this._imageContainer = this.querySelector(".image-container");
	this._zoneDefilement = this.querySelector("nevakee-zone-defilement");
	this._photoModel = this.querySelector("nevakee-photo-model");



	var that = this;
	this._photoModel.loadData("images/index.json",ModeleReady.bind(this));

	function ModeleReady() {
		this._menu.addCategories(this._photoModel.getCategories());
		this._zoneDefilement.drawZoneDefilement(this._photoModel.getAllSrcMin());

    }




	//this._menu.setMenu(this._photoModel.getCategories());
	this._menu.addEventListener("on-menu-clicked", this._onMenuClicked.bind(this), false);
	this._zoneDefilement.addEventListener("on-min-clicked", this._onMinPhotoClicked.bind(this), false);
	//this._zoneDefilement.addEventListener("on-photo-clicked", this._onPhotoClicked.bind(this), false);
};

NevakeePortfolioProto.attachededCallback = function () {};

NevakeePortfolioProto.detachedCallback = function () {};

NevakeePortfolioProto.attributeChangedCallback = function () {};



NevakeePortfolioProto._onMenuClicked = function (event) {
	// Demande des images a afficher a ton model
	// return photo objects {label, path_de_l_image}
	//console.log("coucou");
	//console.log("click + nvl categories : " + this._menu.getSelectedCategories());
};

NevakeePortfolioProto._onMinPhotoClicked = function (event) {
	var mainImage = document.getElementById("main-image-container")
	while (mainImage.hasChildNodes())
		mainImage.removeChild(mainImage.lastChild);
    var img = null;
	img = document.createElement("img");
	img.id = "main-image";
	img.src = this._photoModel.getSrcFull(event.id);
	mainImage.appendChild(img);
	
};

document.registerElement('nevakee-portfolio', {prototype: NevakeePortfolioProto});
},{}],4:[function(require,module,exports){
"use strict";

var NevakeeZoneDefilement = Object.create(HTMLElement.prototype);

NevakeeZoneDefilement.createdCallback = function () {
    this.minImageWidth = {};
    this.minImageWidthArray = [];
    this.totalMinImageWidth = 0;
    this.selectMinImageId = null;

};

NevakeeZoneDefilement.attachededCallback = function () {

};


NevakeeZoneDefilement.drawZoneDefilement = function (srcs) {
        console.log(this.style.marginRight)

        
    var img = null;
    var fragment = document.createDocumentFragment();
    var i = 0;
    this.nbImages = 0;
    this.nbImagesLoaded = 0;
    for(var id in srcs) {
        if (srcs.hasOwnProperty(id)) {
            this.nbImages ++;
            img = document.createElement("img");
            img.className = "min-image";
            img.src = srcs[id];
            img.dataset.id = id;
            i++;
            fragment.appendChild(img);
            this.minImageWidth[id] = 0;
            //calcul de la largeur
            img.addEventListener("load", this._onMinImageLoad.bind(this), false);


        }
    }
    this.appendChild(fragment);
    this.addEventListener("click", this._onClick.bind(this), false);
};

NevakeeZoneDefilement._centerOnMinImage = function (centerId) {
    var centerWidth = 0;
    for (var id in this.minImageWidth) {
        if (this.minImageWidth.hasOwnProperty(id)) {
            if(centerId == id) {
                var size = (this.clientWidth + this.offsetLeft)/2 - centerWidth - this.minImageWidth[id]/2 - 250;
                if(size > 0) {
                    size = 0;    
                }
                if(-size > this.totalMinImageWidth - (this.clientWidth + this.offsetLeft) + 500) {
                    size = this.clientWidth + this.offsetLeft - this.totalMinImageWidth - 500;
                }
                this.style.marginLeft = size + "px" ;
            }
            centerWidth += this.minImageWidth[id];
        }
    }
    
};

NevakeeZoneDefilement._onClick = function (event) {
    if(this.selectMinImageId !== null) {
       this._UnselectMinImageById(this.selectMinImageId,this.firstChild); 
    }
	var newEvent = document.createEvent('Event');
	newEvent.id = event.target.dataset.id;
    this.selectMinImageId = event.target.dataset.id;
    this._selectMinImage(event.target); 
    this._centerOnMinImage(newEvent.id);
	newEvent.initEvent('on-min-clicked', true, true);
	this.dispatchEvent(newEvent);
};

NevakeeZoneDefilement._onMinImageLoad = function (event) {
    if( event.path[0] && event.path[0].className === "min-image") {
        this.totalMinImageWidth += event.path[0].width;
        this.minImageWidth[event.target.dataset.id] = event.path[0].width;
    }


};

NevakeeZoneDefilement._selectMinImage = function (object) {
    object.style.borderWidth = "0.2rem";
};

NevakeeZoneDefilement._UnselectMinImageById = function (id,object) {
    if(object.dataset.id && object.dataset.id == id) {
        object.style.borderWidth = "0rem";  
    }
    else {
        if (object.nextSibling) {
            this._UnselectMinImageById(id,object.nextSibling); 
        }
    }



};

NevakeeZoneDefilement.detachedCallback = function () {};

NevakeeZoneDefilement.attributeChangedCallback = function () {};

document.registerElement('nevakee-zone-defilement', {prototype: NevakeeZoneDefilement});
},{}]},{},[1,4,2,3]);
