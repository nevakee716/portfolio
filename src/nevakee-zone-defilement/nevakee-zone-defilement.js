"use strict";

var NevakeeZoneDefilement = Object.create(HTMLElement.prototype);

NevakeeZoneDefilement.createdCallback = function () {
    this.minImageWidth = {};
    this.minImageWidthArray = [];
    this.totalMinImageWidth = 0;
    this.selectMinImageId = null;

};

NevakeeZoneDefilement.attachededCallback = function () {

};


NevakeeZoneDefilement.drawZoneDefilement = function (srcs) {
    var img = null;
    var fragment = document.createDocumentFragment();
    var i = 0;
    this.nbImages = 0;
    this.nbImagesLoaded = 0;
    for(var id in srcs) {
        if (srcs.hasOwnProperty(id)) {
            this.nbImages ++;
            img = document.createElement("img");
            img.className = "min-image";
            img.src = srcs[id];
            img.dataset.id = id;
            i++;
            fragment.appendChild(img);
            this.minImageWidth[id] = 0;
            //calcul de la largeur
            img.addEventListener("load", this._onMinImageLoad.bind(this), false);


        }
    }
    this.appendChild(fragment);
    this.addEventListener("click", this._onClick.bind(this), false);
};

NevakeeZoneDefilement._centerOnMinImage = function (centerId) {
    var centerWidth = 0;
    for (var id in this.minImageWidth) {
        if (this.minImageWidth.hasOwnProperty(id)) {
            if(centerId == id) {
                var size = (this.clientWidth + this.offsetLeft)/2 - centerWidth - this.minImageWidth[id]/2 - 250;
                if(size > 0) {
                    size = 0;    
                }
                if(-size > this.totalMinImageWidth - (this.clientWidth + this.offsetLeft) + 500) {
                    size = this.clientWidth + this.offsetLeft - this.totalMinImageWidth - 500;
                }
                this.style.marginLeft = size + "px" ;
            }
            centerWidth += this.minImageWidth[id];
        }
    }
    
};

NevakeeZoneDefilement._onClick = function (event) {
    if(this.selectMinImageId !== null) {
       this._UnselectMinImageById(this.selectMinImageId,this.firstChild); 
    }
	var newEvent = document.createEvent('Event');
	newEvent.id = event.target.dataset.id;
    this.selectMinImageId = event.target.dataset.id;
    this._selectMinImage(event.target); 
    this._centerOnMinImage(newEvent.id);
	newEvent.initEvent('on-min-clicked', true, true);
	this.dispatchEvent(newEvent);
};

NevakeeZoneDefilement._onMinImageLoad = function (event) {
    if( event.path[0] && event.path[0].className === "min-image") {
        this.totalMinImageWidth += event.path[0].width;
        this.minImageWidth[event.target.dataset.id] = event.path[0].width;
    }


};

NevakeeZoneDefilement._selectMinImage = function (object) {
    object.style.borderWidth = "0.2rem";
};

NevakeeZoneDefilement._UnselectMinImageById = function (id,object) {
    if(object.dataset.id && object.dataset.id == id) {
        object.style.borderWidth = "0rem";  
    }
    else {
        if (object.nextSibling) {
            this._UnselectMinImageById(id,object.nextSibling); 
        }
    }



};

NevakeeZoneDefilement.detachedCallback = function () {};

NevakeeZoneDefilement.attributeChangedCallback = function () {};

document.registerElement('nevakee-zone-defilement', {prototype: NevakeeZoneDefilement});