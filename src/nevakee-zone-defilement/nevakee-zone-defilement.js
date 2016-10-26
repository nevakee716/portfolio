"use strict";

var NevakeeZoneDefilement = Object.create(HTMLElement.prototype);

NevakeeZoneDefilement.createdCallback = function () {

};

NevakeeZoneDefilement.attachededCallback = function () {

};


NevakeeZoneDefilement.drawZoneDefilement = function (srcs) {
    var img = null;
    var fragment = document.createDocumentFragment();
    var i = 0;
    srcs.forEach(function (src) {
        img = document.createElement("img");
        img.className = "min-image";
        img.src = src;
        img.id = i;
        i++;
        fragment.appendChild(img);
    }, this);
    this.appendChild(fragment);
    this.addEventListener("click", this._onClick.bind(this), false);
};



NevakeeZoneDefilement._onClick = function (event) {
	var newEvent = document.createEvent('Event');
    console.log(event);
	newEvent.id = event.target.dataset.id;
	newEvent.initEvent('on-min-clicked', true, true);
	this.dispatchEvent(newEvent);
};

NevakeeZoneDefilement.detachedCallback = function () {};

NevakeeZoneDefilement.attributeChangedCallback = function () {};

document.registerElement('nevakee-zone-defilement', {prototype: NevakeeZoneDefilement});