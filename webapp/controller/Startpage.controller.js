sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Startpage", {

		onInit: function () {
			this.getRouter().getRoute("Startpage").attachMatched(this._onRoutePatternMatched, this);
		},

		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
		},

		onNavToSales: function () {
			this.getRouter().navTo("TableSales", {
				Target: "TableSales"
			});
		},

		onNavToSubmittedRequests: function () {
			this.getRouter().navTo("TableSales", {
				Target: "SubmittedRequests"
			});
		},

		onNavToRequest: function () {
			this.getRouter().navTo("Request");
		},

		onNavToRequestTable: function () {
			this.getRouter().navTo("TableRequests");
		},

		onNavToTableEmployees: function () {
			this.getRouter().navTo("TableEmployees");
		},

		onNavToSettings: function () {
			// TODO vielleicht so?
			// https://sapui5.hana.ondemand.com/#/entity/sap.tnt.SideNavigation/sample/sap.tnt.sample.SideNavigation

			sap.m.MessageToast.show("TODO");
		}

	});
});