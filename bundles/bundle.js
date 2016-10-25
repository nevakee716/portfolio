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
	console.log(this)
	var element = null;
	var fragment = document.createDocumentFragment();
	var i = 0;
	console.log(this.categories)
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
		    if(this.categories[i][1] == true) {
		    	this._highlight(i);
		    } else {
		    	this._downlight(i);
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
    for (var i = 0; i < this.index.photo.length; i++) {
        if (this.index.photo[i].hasOwnProperty("category")) {
            if (!listCategories.includes(this.index.photo[i].category)) {
                listCategories.push(this.index.photo[i].category);
            }    
        }
    }
    return listCategories;
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
					+ "<div class='image-container'></div>"
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
    }


	//this._menu.setMenu(this._photoModel.getCategories());

	this._menu.addEventListener("on-menu-clicked", this._onMenuClicked.bind(this), false);
	//this._zoneDefilement.addEventListener("on-photo-clicked", this._onPhotoClicked.bind(this), false);
};

NevakeePortfolioProto.attachededCallback = function () {};

NevakeePortfolioProto.detachedCallback = function () {};

NevakeePortfolioProto.attributeChangedCallback = function () {};



NevakeePortfolioProto._onMenuClicked = function (event) {
	// Demande des images a afficher a ton model
	// return photo objects {label, path_de_l_image}
	console.log("coucou");
	console.log("click + nvl categories" + this._menu.getSelectedCategories());
};

NevakeePortfolioProto._onPhotoClicked = function (event) {
};

document.registerElement('nevakee-portfolio', {prototype: NevakeePortfolioProto});
},{}],4:[function(require,module,exports){

},{}]},{},[1,4,2,3]);
