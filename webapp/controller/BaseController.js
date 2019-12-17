sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";
	return Controller.extend("Mobilitaetskonto.Mobilitaetskonto.controller.BaseController", {

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Startpage", {}, true);
			}
		},

		updateUserModel: function () {
			var dbUserModel = sap.ui.getCore().getModel("dbUserModel");
			var userModel = sap.ui.getCore().getModel("userModel");
			dbUserModel.loadData("/MOB_MITARBEITER_GETCREATE", userModel.getData());
		}

	});
});