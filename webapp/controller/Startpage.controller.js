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
			
			this.updateUserModel();
		},

		onNavToUmsatz: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("Umsatz");
		},

		onNavToAntrag: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("Antrag");
		}
	});
});