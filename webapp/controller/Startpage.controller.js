sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Startpage", {
		onInit: function () {
			
			var dbUserModel = sap.ui.getCore().getModel("dbUserModel").getData();
			var userModel = sap.ui.getCore().getModel("userModel").getData();
			
			this.getView().byId("guthabenAnzeige").setValue(dbUserModel.GUTHABEN);

			//	sap.m.MessageToast.show("dbUserModel:\nMID: " + data.MID + "\nVORNAME: " + data.VORNAME + "\nName: " + data.NAME +
			//	"\nGuthaben: " + data.GUTHABEN);
				
			//sap.m.MessageToast.show("userModel:\nName: " + data.name + "\nFirstName: " + data.firstName + "\nLastName: " + data.lastName +
			//	"\nEmail: " + data.email + "\nDisplayname: " + data.displayName);

		},

		onNavToUmsatz: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Umsatz");
		},

		onNavToAntrag: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("Antrag");
		}
	});
});