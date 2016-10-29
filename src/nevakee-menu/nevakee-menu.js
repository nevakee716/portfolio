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