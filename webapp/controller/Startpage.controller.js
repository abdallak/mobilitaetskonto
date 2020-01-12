sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Startpage", {

		onInit: function () {
			this.getRouter().getRoute("Startpage").attachMatched(this._onRoutePatternMatched, this);

			var dbUserModel = this.getGlobalModel("dbUserModel");
			this.setModel(dbUserModel, "dbUserModel");

			dbUserModel.attachRequestCompleted(function (oEvent) {
				oEvent.getSource().refresh(true);
			});
		},

		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
			var dbUserModel = this.getGlobalModel("dbUserModel");
			if (dbUserModel.GUTHABEN === null){
				this.handleEmptyModel("Aktualisierung fehlgeschlagen.");
			}
		},

		onNavToSales: function () {
			this.getRouter().navTo("Sales");
		},

		onNavToRequest: function () {
			this.getRouter().navTo("Request");
		}

	});
});