"use strict";

var NevakeePortfolioProto = Object.create(HTMLElement.prototype);

NevakeePortfolioProto.createdCallback = function () {
	this.innerHTML 	= "<nevakee-menu></nevakee-menu>"
					+ "<nevakee-main-image></nevakee-main-image>"
					+ "<nevakee-zone-defilement></nevakee-zone-defilement>"
					+ "<nevakee-photo-model></nevakee-photo-model>";

	this._menu = this.querySelector("nevakee-menu");
	this._zoneDefilement = this.querySelector("nevakee-zone-defilement");
	this._photoModel = this.querySelector("nevakee-photo-model");
	this._mainImage = this.querySelector("nevakee-main-image");



	var that = this;
	this._photoModel.loadData("images/index.json",ModeleReady.bind(this));

	function ModeleReady() {
		this._menu.addCategories(this._photoModel.getCategories());
		this._zoneDefilement.drawZoneDefilement(this._photoModel.getAllSrcMin());

    }

	//this._menu.setMenu(this._photoModel.getCategories());
	this._menu.addEventListener("on-menu-clicked", this._onMenuClicked.bind(this), false);
	this._zoneDefilement.addEventListener("on-min-clicked", this._onMinPhotoSelected.bind(this), false);
	this._zoneDefilement.addEventListener("on-min-selected", this._onMinPhotoSelected.bind(this), false);
	//this._zoneDefilement.addEventListener("on-photo-clicked", this._onPhotoClicked.bind(this), false);
};

NevakeePortfolioProto.attachededCallback = function () {};

NevakeePortfolioProto.detachedCallback = function () {};

NevakeePortfolioProto.attributeChangedCallback = function () {};



NevakeePortfolioProto._onMenuClicked = function (event) {
	console.log(this._photoModel.getSrcMinByCategories(this._menu.getSelectedCategories()))
	this._zoneDefilement.drawZoneDefilement(this._photoModel.getSrcMinByCategories(this._menu.getSelectedCategories()));
};

NevakeePortfolioProto._onMinPhotoSelected = function (event) {
	this._mainImage.drawImage(this._photoModel.getSrcFull(event.id));
};

document.registerElement('nevakee-portfolio', {prototype: NevakeePortfolioProto});