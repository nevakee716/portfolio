"use strict";

var NevakeeMenuProto = Object.create(HTMLElement.prototype);

NevakeeMenuProto.createdCallback = function () {};

NevakeeMenuProto.attachededCallback = function () {};

NevakeeMenuProto.setMenu = function (menus) {
	var element = null;
	var fragment = document.createDocumentFragment();
	var i = 0;

	element = document.createElement("div");
	fragment.appendChild(element);
	element.textContent = "All";
	fragment.appendChild(element);
	
	menus.forEach(function (menuItem) {
		element = document.createElement("div");
		element.className = "menu-item";
		element.dataset.id = i;
		element.textContent = menuItem; //.label;
		i++;
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