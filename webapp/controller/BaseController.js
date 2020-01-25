sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"Mobilitaetskonto/Mobilitaetskonto/model/models"
], function (Controller, History, MessageBox, models) {
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

		setGlobalModel: function (oModel, sName) {
			return this.getOwnerComponent().setModel(oModel, sName);
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

		updateUserModel: function () {
			models.updateUserModel(this.getOwnerComponent());
		},

		handleEmptyModel: function (sMessage) {
			var oResourceBundle = this.getResourceBundle();
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(oResourceBundle.getText("errorMessageGeneralPrefix") + ": " + sMessage, {
				title: "Error",
				id: "errorMessageBox",
				styleClass: bCompact ? "sapUiSizeCompact" : "",
				contentWidth: "100px"
			});
		}

	});
});