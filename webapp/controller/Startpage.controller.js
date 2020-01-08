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
		},

		onNavToUmsatz: function () {
			this.getRouter().navTo("Umsatz");
		},

		onNavToAntrag: function () {
			this.getRouter().navTo("Antrag");
		}

	});
});