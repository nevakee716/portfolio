"use strict";

var NevakeeZoneDefilement = Object.create(HTMLElement.prototype);

NevakeeZoneDefilement.createdCallback = function () {
    this.isVertical = true;


    this.MinDim = {};
    this.MinDimArray = [];
    this.totalMinDim = 0;
    this.maxMinDim = 0;
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
    debugger;
    this.srcs = srcs;
    this.maxMinDim = 0;
    this.nbImages = 0;
    this.nbImagesLoaded = 0;
    this.MinDim = {};

    for(var id in srcs) {
        if (srcs.hasOwnProperty(id)) {
            this.nbImages ++;
            fragment.append(this._calculateImgAttribute(srcs[id],id));
        }
    }

    //si toutes les images sont loadées
    if(this.nbImagesLoaded == this.nbImages) {
        // on reset les marges
        this.style.marginBottom = "-" + this.maxMinDim + "px";
        this.style.marginTop = 0 + "px";
        // et on centre l'image selectionné
        this._centerOnMinImage(this.selectMinImageId);
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
    for (var id in this.MinDim) {
        if (this.MinDim.hasOwnProperty(id)) {
            if(centerId == id) {                       
                var size = (this.clientWidth + this.offsetTop - this.maxMinDim)/2 - centerWidth - this.MinDim[id]/2;
                if(size > 0) {
                    size = 0;    
                }
                if(-size > this.totalMinDim - (this.clientWidth + this.offsetTop) + this.maxMinDim) {
                    size = this.clientWidth + this.offsetTop - this.totalMinDim - this.maxMinDim*1.1;
                }
                this.style.marginTop = size + "px" ;
                return;
            }
            centerWidth += this.MinDim[id];
        }
    }
    
};

NevakeeZoneDefilement._onClick = function (event) {
    if(event.target.className === "lazy-image") {
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
    console.log("img load : " + event.target.dataset.id);
};


NevakeeZoneDefilement._calculateImgAttribute = function (image,id) {
    var ratio,newHeight,newWidth,lazyImg;
    
    if(this.isVertical) {
        ratio = this.clientWidth / image.width;
        newHeight = image.height * ratio;
        newWidth = this.clientWidth ;
        this.totalMinDim += newHeight;
        this.MinDim[id] = newHeight;
    } else {
        ratio = this.clientHeight / image.height;
        newWidth = image.width * ratio;
        newHeight = this.clientHeight ;
        this.totalMinDim += newWidth;
        this.MinDim[id] = newWidth; 
    }



    lazyImg = document.createElement("nevakee-lazy-image");
    lazyImg.className = "min-image";
    lazyImg.src = image.src;
    lazyImg.id = id;
    lazyImg.width = newWidth;
    lazyImg.height = newHeight;
    lazyImg.init(this,newWidth,newHeight);

    // on met les borders pour l'image selectionnée
    if(this.selectMinImageId == id) {
        this._selectMinImage(lazyImg);
    }
    if(this.selectMinImageId == null) {
        this.selectMinImageId = id;
        this._selectMinImage(lazyImg);
        var newEvent = document.createEvent('Event');
        newEvent.id = this.selectMinImageId;
        newEvent.initEvent('on-min-selected', true, true);
        this.dispatchEvent(newEvent);  
    }

    return lazyImg;
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