sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";
	return Controller.extend("Mobilitaetskonto.Mobilitaetskonto.controller.BaseController", {

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getGlobalModel: function (sName) {
			return sap.ui.getCore().getModel(sName);
		},

		setGlobalModel: function (oModel, sName) {
			return sap.ui.getCore().setModel(oModel, sName);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
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
			var dbUserModel = this.getGlobalModel("dbUserModel");
			var userModel = this.getGlobalModel("userModel");
			dbUserModel.loadData("/MOB_MITARBEITER_GETCREATE", userModel.getData());
		},
		
		handleEmptyModel: function (sMessage) {
			sap.m.MessageBox.error(sMessage);
		}

	});
});