"use strict";

var NevakeeMainImage = Object.create(HTMLElement.prototype);

NevakeeMainImage.createdCallback = function () {};

NevakeeMainImage.attachededCallback = function () {};


NevakeeMainImage.detachedCallback = function () {};

NevakeeMainImage.attributeChangedCallback = function () {};

NevakeeMainImage.drawImage = function (src) {
    while (this.hasChildNodes())
        this.removeChild(this.lastChild);
    var arrowLeft = document.createElement("img");
    arrowLeft.id = "arrowLeft";
    arrowLeft.src = "images/arrow_left.png";


    var div = document.createElement("div");
    div.id = "test_div";


    var img = document.createElement("img");
    img.id = "main-image";
    img.src = src;


    div.appendChild(arrowLeft);
    div.appendChild(img);
    this.appendChild(div);

    var arrowRight = document.createElement("img");
    arrowRight.id = "arrowRight";
    arrowRight.src = "images/arrow_right.png";

    div.appendChild(arrowLeft);
    div.appendChild(img);
    div.appendChild(arrowRight);
    this.appendChild(div);
};



document.registerElement('nevakee-main-image', {prototype: NevakeeMainImage});