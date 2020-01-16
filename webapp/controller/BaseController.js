sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";
	return Controller.extend("Mobilitaetskonto.Mobilitaetskonto.controller.BaseController", {

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getGlobalModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		getResourceBundle: function () {
			return this.getGlobalModel("i18n").getResourceBundle();
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

		updateUserModel: function (first) {
			var dbUserModel = this.getGlobalModel("dbUserModel");
			var userModel = this.getGlobalModel("userModel");
			dbUserModel.loadData("/MOB_MITARBEITER_GETCREATE", userModel.getData());
		},

		handleEmptyModel: function (sMessage) {
			sap.m.MessageBox.error(sMessage);
		}

	});
});