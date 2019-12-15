sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Startpage", {
		onInit: function () {

			var url = "/services/userapi/currentUser";

			var request = $.get({
				async: false,
				url: url,
				dataType: "json",
				success: function () {
					sap.m.MessageToast.show("success");
				},
				error: function () {
					sap.m.MessageBox.alert("error");
				}
			});

			request.done(function (data) {
				sap.m.MessageToast.show("UserAPI:\nName: " + data.name + "\nFirstName: " + data.firstName + "\nLastName: " + data.lastName +
					"\nEmail: " + data.email + "\nDisplayname: " + data.displayname);
			});
			
			var params = {};
			params.mid = 14;
			
			var url2 = "/MOB_GUTHABEN?" + params.mid;
			
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
			
			request2.done(function (data) {
				
				var GuthabenModel = new sap.ui.model.json.JSONModel(data);
				this.getView().setModel(GuthabenModel, "GuthabenModel");
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