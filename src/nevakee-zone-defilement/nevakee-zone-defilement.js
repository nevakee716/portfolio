"use strict";

var NevakeeZoneDefilement = Object.create(HTMLElement.prototype);

NevakeeZoneDefilement.createdCallback = function () {
    this.minImageWidth = {};
    this.minImageWidthArray = [];
    this.totalMinImageWidth = 0;
    this.maxMinImageWidth = 0;
    this.selectMinImageId = null;
    this.nbImages = 0;
    this.nbImagesLoaded = 0;

};

NevakeeZoneDefilement.attachededCallback = function () {

};


NevakeeZoneDefilement.drawZoneDefilement = function (srcs) {
    while (this.hasChildNodes())
        this.removeChild(this.lastChild);
    var img = null;
    var fragment = document.createDocumentFragment();
    var i = 0;
    this.srcs = srcs;
    this.maxMinImageWidth = 0;
    this.nbImages = 0;
    this.nbImagesLoaded = 0;
    this.minImageWidth = {};
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

    //on verifie si l'image selectionne est dans les srcs actuelles
    if(!this.srcs.hasOwnProperty(this.selectMinImageId)) {
        this.selectMinImageId = null;
    }
};

NevakeeZoneDefilement._centerOnMinImage = function (centerId) {
    var centerWidth = 0;
    for (var id in this.minImageWidth) {
        if (this.minImageWidth.hasOwnProperty(id)) {
            if(centerId == id) {                       
                var size = (this.clientWidth + this.offsetTop - this.maxMinImageWidth)/2 - centerWidth - this.minImageWidth[id]/2;
                if(size > 0) {
                    size = 0;    
                }
                if(-size > this.totalMinImageWidth - (this.clientWidth + this.offsetTop) + this.maxMinImageWidth) {
                    size = this.clientWidth + this.offsetTop - this.totalMinImageWidth - this.maxMinImageWidth*1.1;
                }
                this.style.marginTop = size + "px" ;
                return;
            }
            centerWidth += this.minImageWidth[id];
        }
    }
    
};

NevakeeZoneDefilement._onClick = function (event) {
    if(event.target.className === "min-image") {
        if(this.selectMinImageId !== null) {
           this._findDataSetId(this.selectMinImageId,this.firstChild,this._unSelectMinImage); 
        }
    	var newEvent = document.createEvent('Event');
    	newEvent.id = event.target.dataset.id;
        this.selectMinImageId = event.target.dataset.id;
        this._selectMinImage(event.target); 
        this._centerOnMinImage(newEvent.id);
    	newEvent.initEvent('on-min-clicked', true, true);
    	this.dispatchEvent(newEvent);
    }
};

NevakeeZoneDefilement._onMinImageLoad = function (event) {
    if( event.path[0] && event.path[0].className === "min-image") {
        this.totalMinImageWidth += event.path[0].width;
        this.minImageWidth[event.target.dataset.id] = event.path[0].width;
        if(this.maxMinImageWidth < event.path[0].width) {
            this.maxMinImageWidth = event.path[0].width;
        }
        this.nbImagesLoaded ++;

        // on met les borders pour l'image selectionnée
        if(this.selectMinImageId == event.target.dataset.id) {
            this._selectMinImage(event.path[0]);
        }
        //si pas d'images selectionné, on prend la 1ere qui se load
        if(this.selectMinImageId == null) {
            this.selectMinImageId = event.target.dataset.id;
            this._selectMinImage(event.path[0]);
            var newEvent = document.createEvent('Event');
            newEvent.id = this.selectMinImageId;
            newEvent.initEvent('on-min-selected', true, true);
            this.dispatchEvent(newEvent);  
        }

        //si toutes les images sont loadées
        if(this.nbImagesLoaded == this.nbImages) {
            // on reset les marges
            this.style.marginBottom = "-" + this.maxMinImageWidth + "px";
            this.style.marginTop = 0 + "px";
            // et on centre l'image selectionné
            this._centerOnMinImage(this.selectMinImageId);
        }
    }
};

NevakeeZoneDefilement._selectMinImage = function (object) {
    object.style.borderWidth = "0.2rem";
};

NevakeeZoneDefilement._unSelectMinImage = function (object) {
    if(object) {
        object.style.borderWidth = "0rem";  
        return;
    }
};


NevakeeZoneDefilement.move = function (offset) {
    for (var i = 0; i < this.childNodes.length; i++) { 
        if(this.childNodes[i].dataset.id == this.selectMinImageId) {
            break;
        }
    }
    if(i < this.childNodes.length - offset) {
        this.selectMinImageId = this.childNodes[i+offset].dataset.id;
        this._selectMinImage(this.childNodes[i+offset]); 
        this._unSelectMinImage(this.childNodes[i]);         
        this._centerOnMinImage(this.selectMinImageId);
        var newEvent = document.createEvent('Event');
        newEvent.id = this.selectMinImageId;
        newEvent.initEvent('on-min-selected', true, true);
        this.dispatchEvent(newEvent); 
    }

};


NevakeeZoneDefilement._findDataSetId = function (id,object,operation) {
    if(object.dataset.id && object.dataset.id == id) {
        return operation(object);
    }
    else {
        if (object.nextSibling) {
            this._findDataSetId(id,object.nextSibling,operation); 
        }
    }
};


NevakeeZoneDefilement.detachedCallback = function () {};

NevakeeZoneDefilement.attributeChangedCallback = function () {};

document.registerElement('nevakee-zone-defilement', {prototype: NevakeeZoneDefilement});