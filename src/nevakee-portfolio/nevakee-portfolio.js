"use strict";

var NevakeePortfolioProto = Object.create(HTMLElement.prototype);

NevakeePortfolioProto.createdCallback = function () {
	this.innerHTML 	= "<nevakee-menu></nevakee-menu>"
					+ "<div class='image-container'></div>"
					+ "<nevakee-zone-defilement></nevakee-zone-defilement>"
					+ "<nevakee-photo-model></nevakee-photo-model>";

	this._menu = this.querySelector("nevakee-menu");
	this._imageContainer = this.querySelector(".image-container");
	this._zoneDefilement = this.querySelector("nevakee-zone-defilement");
	this._photoModel = this.querySelector("nevakee-photo-model");



	var that = this;
	this._photoModel.loadData("images/index.json",ModeleReady.bind(this));

	function ModeleReady() {
		this._menu.setMenu(this._photoModel.getCategories());
    }


	//this._menu.setMenu(this._photoModel.getCategories());

	//this._menu.addEventListener("on-menu-clicked", this._onMenuClicked.bind(this), false);
	//this._zoneDefilement.addEventListener("on-photo-clicked", this._onPhotoClicked.bind(this), false);
};

NevakeePortfolioProto.attachededCallback = function () {};

NevakeePortfolioProto.detachedCallback = function () {};

NevakeePortfolioProto.attributeChangedCallback = function () {};



NevakeePortfolioProto._onMenuClicked = function (event) {
	// Demande des images a afficher a ton model
	// return photo objects {label, path_de_l_image}
};

NevakeePortfolioProto._onPhotoClicked = function (event) {
};

document.registerElement('nevakee-portfolio', {prototype: NevakeePortfolioProto});