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
    if (this.hasChildNodes() && this.child > 1 ) {
        this.removeChild(this.firstChild)
        console.log(this.firstChild)
        this.firstChild.style.opacity = "0";
        this.firstChild.style.zIndex = "2";
    }
    this.child ++;
    var div = document.createElement("div");
    div.style.opacity="1";
    div.style.zIndex="1";
    var img = document.createElement("img");
    img.className = "main-image";
    img.src = src;
    div.appendChild(img);
    this.appendChild(div);
};



document.registerElement('nevakee-main-image', {prototype: NevakeeMainImage});