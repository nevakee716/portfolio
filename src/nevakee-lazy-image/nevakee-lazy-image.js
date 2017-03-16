"use strict";

var NevakeeLazyImage = Object.create(HTMLElement.prototype);

NevakeeLazyImage.createdCallback = function () {

};

NevakeeLazyImage.attachededCallback = function () {

};

NevakeeLazyImage.init = function () {
    var options = {
        root: document.documentElement,
        rootMargin: '200px',
        threshold: 0
    };

    var callback = function(entries,observer) { 
        for (let entry of entries) {
            let intersectionRect = entry.intersectionRect;
            if (intersectionRect.height * intersectionRect.width > 0) {
                this._drawImage();
                observer.unobserve(this.firstChild);
            }
        }       
    };
    console.log("callback : " + this.dataset.id);
            

    this.style.height = this.height  + "px";
    this.style.width = this.width  + "px";
    var div = document.createElement("div");
    div.style.height = this.height  + "px";
    div.style.width = this.width  + "px";
    this.appendChild(div);
    var observer = new IntersectionObserver(callback.bind(this), options);
    observer.observe(this.firstChild);
};




NevakeeLazyImage.detachedCallback = function () {};

NevakeeLazyImage.attributeChangedCallback = function () {};

NevakeeLazyImage._drawImage = function () {
    console.log("draw : " + this.dataset.id);
    if (this.firstChild && this.firstChild.hasChildNodes()) {
        this.firstChild.removeChild(this.firstChild.firstChild);
    }
    var img = document.createElement("img");
    img.className = "lazy-image";
    img.src = this.src;
    img.dataset.id = this.id;
    img.addEventListener("load", this._onMinImageLoad.bind(this), false);
    this.firstChild.appendChild(img);

};

NevakeeLazyImage._onMinImageLoad = function (event) {
    console.log("img load : " + this.dataset.id);
};


document.registerElement('nevakee-lazy-image', {prototype: NevakeeLazyImage});