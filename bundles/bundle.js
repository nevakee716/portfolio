(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var NevakeeMenuProto = Object.create(HTMLElement.prototype);

NevakeeMenuProto.createdCallback = function () {};

NevakeeMenuProto.attachededCallback = function () {};

NevakeeMenuProto.setMenu = function (menus) {
	var element = null;
	var fragment = document.createDocumentFragment();

	menus.forEach(function (menuItem) {
		element = document.createElement("div");
		element.className = "menu-item";
		element.dataset.id = menuItem.id;
		element.textContent = menuItem.label;
		fragment.appendChild(element);
	}, this);

	this.appendChild(fragment);
	this.addEventListener("click", this._onClick.bind(this), false);
};

NevakeeMenuProto._onClick = function (event) {
	var newEvent = document.createEvent('Event');
	newEvent.id = event.target.dataset.id;
	newEvent.initEvent('on-menu-clicked', true, true);
	this.dispatchEvent(newEvent);
};

NevakeeMenuProto.detachedCallback = function () {};

NevakeeMenuProto.attributeChangedCallback = function () {};

document.registerElement('nevakee-menu', {prototype: NevakeeMenuProto});
},{}],2:[function(require,module,exports){
"use strict";

var NevakeePortfolioProto = Object.create(HTMLElement.prototype);

NevakeePortfolioProto.createdCallback = function () {
	this.innerHTML 	= "<nevakee-menu></nevakee-menu>"
					+ "<div class='image-container'></div>"
					+ "<nevakee-zone-defilement></nevakee-zone-defilement>";

	this._menu = this.querySelector("nevakee-menu");
	this._imageContainer = this.querySelector(".image-container");
	this._zoneDefilement = this.querySelector("nevakee-zone-defilement");
	this._images = null;

	this._loadImages();

	this._menu.setMenu([
		{
			"label": "paysages",
			"id": "paysages"
		}, {
			"label": "moto",
			"id": "moto"
		}
	]);

	this._menu.addEventListener("on-menu-clicked", function (event) {
		debugger;
	});
};

NevakeePortfolioProto.attachededCallback = function () {};

NevakeePortfolioProto.detachedCallback = function () {};

NevakeePortfolioProto.attributeChangedCallback = function () {};

NevakeePortfolioProto._loadImages = function () {

};

document.registerElement('nevakee-portfolio', {prototype: NevakeePortfolioProto});
},{}],3:[function(require,module,exports){

},{}]},{},[1,3,2]);
