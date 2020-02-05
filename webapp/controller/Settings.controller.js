sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Settings", {

		onInit: function () {
			this.getRouter().getRoute("TableSales").attachMatched(this._onRoutePatternMatched, this);

		},

		_onRoutePatternMatched: function (oEvent) {

		},

		// https://sapui5.hana.ondemand.com/#/entity/sap.tnt.ToolPage/sample/sap.tnt.sample.ToolPage/code/ToolPage.view.xml
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			// this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));

			var navContainer = this.byId("navContainer");
			var viewId = this.getView().createId(oItem.getKey());

			// console.log(oItem.getKey(), viewId);
			// navContainer.to(this.byId(oItem.getKey()).getId());
			navContainer.to(this.byId(oItem.getKey()));
		}

	});

});