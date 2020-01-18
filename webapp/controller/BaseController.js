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
			var userModel = this.getGlobalModel("userModel");

			var settings = {
				"url": "/MOB_MITARBEITER_GETCREATE",
				"method": "GET",
				"timeout": 0,
				"data": userModel.getData()
			};

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var dbUserModel = this.getGlobalModel("dbUserModel");
					dbUserModel.setData(response);
				})
				.fail(function (jqXHR, exception) {
					that.handleEmptyModel("Leider ist ein Fehler aufgetreten: " + jqXHR.responseText + " (" + jqXHR.status + ")");
				});
		},

		handleEmptyModel: function (sMessage) {
			sap.m.MessageBox.error(sMessage);
		}

	});
});