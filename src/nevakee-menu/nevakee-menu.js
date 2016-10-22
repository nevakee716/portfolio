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