"use strict";

var NevakeePhotoModel = Object.create(HTMLElement.prototype);

NevakeePhotoModel.createdCallback = function () {};

NevakeePhotoModel.attachededCallback = function () {};

NevakeePhotoModel.loadData = function (src,callback2) {

	function jsonLoaded(response,callback) {
	    this.index = JSON.parse(response);
        return callback2();
	};

	// Call to function with anonymous callback
	this._loadJSON(src,jsonLoaded.bind(this));
};


NevakeePhotoModel._loadJSON = function (src,callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', src, true);


    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};

NevakeePhotoModel.getCategories = function () {
    var listCategories = [];
    for (var photoId in this.index) {
        if (this.index.hasOwnProperty(photoId)) {
            if (this.index[photoId].hasOwnProperty("category")) {
                if (!listCategories.includes(this.index[photoId].category)) {
                    listCategories.push(this.index[photoId].category);
                }
            }    
        }
    }
    return listCategories;
};

NevakeePhotoModel.getAllSrcMin = function () {
    var SrcsMin = {};
    for (var photoId in this.index) {
        if (this.index.hasOwnProperty(photoId)) {
            if (this.index[photoId].hasOwnProperty("src_min") && this.index[photoId].hasOwnProperty("width_min") && this.index[photoId].hasOwnProperty("height_min")) {
                SrcsMin[photoId] = {};
                SrcsMin[photoId].src = this.index[photoId].src_min;
                SrcsMin[photoId].width = this.index[photoId].width_min;
                SrcsMin[photoId].height = this.index[photoId].height_min;
            }    
        }
    }
    return SrcsMin;
};

NevakeePhotoModel.getSrcMinByCategories = function (categories) {
    var SrcsMin = {};
    for (var photoId in this.index) {
        if (this.index.hasOwnProperty(photoId)) {
            if (this.index[photoId].hasOwnProperty("category") && categories.includes(this.index[photoId].category) && this.index[photoId].hasOwnProperty("src_min")) {
                SrcsMin[photoId] = {};
                SrcsMin[photoId].src = this.index[photoId].src_min;
                SrcsMin[photoId].width = this.index[photoId].width_min;
                SrcsMin[photoId].height = this.index[photoId].height_min;
            }    
        }
    }
    return SrcsMin;
};


NevakeePhotoModel.getSrcFull = function (photoId) {
    if (this.index[photoId].hasOwnProperty("src_full")) {
        return this.index[photoId].src_full;
    }
};


NevakeePhotoModel._onClick = function (event) {
	var newEvent = document.createEvent('Event');
	newEvent.id = event.target.dataset.id;
	newEvent.initEvent('on-menu-clicked', true, true);
	this.dispatchEvent(newEvent);
};

NevakeePhotoModel.detachedCallback = function () {};

NevakeePhotoModel.attributeChangedCallback = function () {};

document.registerElement('nevakee-photo-model', {prototype: NevakeePhotoModel});