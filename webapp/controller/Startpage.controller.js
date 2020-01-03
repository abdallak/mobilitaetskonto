sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Startpage", {

		onInit: function () {
			this.getRouter().getRoute("Startpage").attachMatched(this._onRoutePatternMatched, this);

			var dbUserModel = this.getGlobalModel("dbUserModel");
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			// var userModel = this.getGlobalModel("userModel").getData();
			sap.m.MessageToast.show("dbUserModel:\nMID: " + dbUserData.MID + "\nVORNAME: " + dbUserData.VORNAME + "\nName: " + dbUserData.NAME +
				"\nGuthaben: " + dbUserData.GUTHABEN);
			//sap.m.MessageToast.show("userModel:\nName: " + data.name + "\nFirstName: " + data.firstName + "\nLastName: " + data.lastName +
			//	"\nEmail: " + data.email + "\nDisplayname: " + data.displayName);

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