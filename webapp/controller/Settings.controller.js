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

		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var navContainer = this.byId("navContainer");
			var viewId = this.byId(oItem.getKey());
			navContainer.to(this.byId(viewId));
		}

	});

});