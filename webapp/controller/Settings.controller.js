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

		onSideNavButtonPress: function () {
			var oToolPage = this.byId("toolPage");
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var navContainer = this.byId("navContainer");
			var viewId = this.byId(oItem.getKey());
			navContainer.to(viewId);
		}

	});

});