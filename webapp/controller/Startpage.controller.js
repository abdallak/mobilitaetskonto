sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Startpage", {
		onInit: function () {

			var dbUserModel = sap.ui.getCore().getModel("dbUserModel").getData();
			var userModel = sap.ui.getCore().getModel("userModel").getData();

			this.getView().byId("guthabenAnzeige").setValue(dbUserModel.GUTHABEN);

			//	sap.m.MessageToast.show("dbUserModel:\nMID: " + data.MID + "\nVORNAME: " + data.VORNAME + "\nName: " + data.NAME +
			//	"\nGuthaben: " + data.GUTHABEN);

			//sap.m.MessageToast.show("userModel:\nName: " + data.name + "\nFirstName: " + data.firstName + "\nLastName: " + data.lastName +
			//	"\nEmail: " + data.email + "\nDisplayname: " + data.displayName);

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Detailansicht
		 */
		onBeforeRendering: function () {
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