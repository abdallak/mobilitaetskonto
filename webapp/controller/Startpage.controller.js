sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Startpage", {
		onInit: function () {
			
			var dbUserModel = sap.ui.getCore().getModel("dbUserModel").getData();
			var userModel = sap.ui.getCore().getModel("userModel").getData();
			
			// var data = userModel;
			var data = dbUserModel;

			// sap.m.MessageToast.show("dbUserModel:\nMID: " + data.MID + "\nVORNAME: " + data.VORNAME + "\nName: " + data.NAME +
			//	"\nGuthaben: " + data.GUTHABEN);
				
			//sap.m.MessageToast.show("userModel:\nName: " + data.name + "\nFirstName: " + data.firstName + "\nLastName: " + data.lastName +
			//	"\nEmail: " + data.email + "\nDisplayname: " + data.displayName);
			
			var params = {};
			params.mid = dbUserModel.MID;
			
			var paramsString = jQuery.param(params);
			
			var url2 = "/MOB_GUTHABEN?" + paramsString;
			
			var request2 = $.get({
				async: false,
				url: url2,
				dataType: "json",
				success: function () {
					sap.m.MessageToast.show("success");
				},
				error: function () {
					sap.m.MessageToast.show("error");
				}
			});
			
			var that = this;
			request2.done(function (data2) {
				sap.m.MessageToast.show("Guthaben " + data2.GUTHABEN);
				var GuthabenModel = new sap.ui.model.json.JSONModel(data2);
				that.getView().setModel(GuthabenModel, "GuthabenModel");
			});

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