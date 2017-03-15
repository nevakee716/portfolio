"use strict";

var NevakeeMainImage = Object.create(HTMLElement.prototype);

NevakeeMainImage.createdCallback = function () {
    this.child = 0 ;
};

NevakeeMainImage.attachededCallback = function () {

};


NevakeeMainImage.detachedCallback = function () {};

NevakeeMainImage.attributeChangedCallback = function () {};

NevakeeMainImage.drawImage = function (src) {
    if (this.hasChildNodes()) {
        this.removeChild(this.firstChild);
    }
    var div = document.createElement("div");
    var img = document.createElement("img");
    img.className = "main-image";
    img.src = src;
    div.appendChild(img);
    this.appendChild(div);
};



document.registerElement('nevakee-main-image', {prototype: NevakeeMainImage});