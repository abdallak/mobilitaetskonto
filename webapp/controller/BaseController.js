sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"Mobilitaetskonto/Mobilitaetskonto/model/models"
], function (Controller, History, MessageBox, models) {
	"use strict";

	/**
	 * This controller contains functions, which will be used by all other controllers for recurring jobs like showing error messages.
	 * @class BaseController
	 */
	return Controller.extend("Mobilitaetskonto.Mobilitaetskonto.controller.BaseController", {

		/**
		 * TODO
		 * @typedef jqXHR
		 * @type {object}
		 */

		/**
		 * This is a convenience function which returns the router object initialized in the Component.js
		 * 
		 * @return {sap.ui.core.routing.Router} A sap router object
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * This is a convenience function to get a model.
		 * 
		 * @param {string} sName - model name
		 * @return {sap.ui.model.json.JSONModel} The requested model
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * This is a convenience function to set a model.
		 * 
		 * @param {sap.ui.model.json.JSONModel} oModel - model 
		 * @param {string} sName - model name
		 * @return {sap.ui.model.json.JSONModel} model
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * This is a convenience function to get a global model.
		 * 
		 * @param {string} sName - model name
		 * @return {sap.ui.model.json.JSONModel} The requested model
		 */
		getGlobalModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		/**
		 * This is a convenience function to set a global model.
		 * 
		 * @param {sap.ui.model.json.JSONModel} oModel - model
		 * @param {string} sName - model name
		 * @return {sap.ui.model.json.JSONModel} model
		 */
		setGlobalModel: function (oModel, sName) {
			return this.getOwnerComponent().setModel(oModel, sName);
		},

		/**
		 * This is a convenience function to get the resource bundle.
		 * 
		 * @return {object} The i18n resource bundle TODO
		 */
		getResourceBundle: function () {
			return this.getGlobalModel("i18n").getResourceBundle();
		},

		/**
		 * This function will navigate back to the last displayed page.
		 * 
		 * If there is no previous page in history, it will default to the startpage.
		 * 
		 * @param {object} [oEvent] - oEvent
		 */
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.onNavStartpage();
			}
		},

		/**
		 * This function will navigate to the Startpage.
		 * 
		 * There will be no entry in the browser history.
		 * 
		 * @param {object} [oEvent] - oEvent
		 */
		onNavStartpage: function (oEvent) {
			this.getRouter().navTo("Startpage", {}, true);
		},

		/**
		 * This function will navigate to a sap message page showing a custom message, icon and description.
		 * 
		 * The sIconPath parameter must not contain the sap:// prefix since '/' is reserved according to the sap router docs.
		 * Just call it with "message-information" instead of "sap-icon://message-information".
		 * Therefore this does only work with SAP build-in icons.
		 * 
		 * @param {string} sIconPath - SAP Icon without prefix
		 * @param {string} sErrorMessage - Error message
		 * @param {string} sErrorDescription - Error detail or description
		 * @param {boolean} bStartpageButton - Show button to navigate to Startpage
		 */
		onNavMessagePage: function (sIconPath, sErrorMessage, sErrorDescription, bStartpageButton) {
			var oError = {};
			oError.sIconPath = sIconPath;
			oError.sErrorDescription = sErrorDescription;
			oError.sErrorMessage = sErrorMessage;
			oError.bStartpageButton = bStartpageButton;
			var sError = JSON.stringify(oError);

			this.getRouter().navTo("MessagePage", {
				error: sError
			}, true);
		},

		/**
		 * This function will update the global user model.
		 */
		updateUserModel: function () {
			models.updateUserModel(this, this.getOwnerComponent());
		},

		/**
		 * This function returns a settings object which contains the parameters for an ajax request.
		 * 
		 * The timeout for network requests is always set to 5s.
		 * If data is of type string, it will be passed inside the request body.
		 * If data is type object, it will be passed as url parameters.
		 * 
		 * @param {string} url - Request url
		 * @param {string} method - Request method
		 * @param {(object | string)} [data] - Request data
		 * @return {object} The requested model
		 */
		prepareAjaxRequest: function (url, method, data) {
			return {
				"url": url,
				"method": method,
				"timeout": 5 * 1000,
				"data": data
			};
		},

		/**
		 * This function will display a messagebox with an error message.
		 * 
		 * @param {string} sMessage - User error message
		 */
		handleEmptyModel: function (sMessage) {
			var oResourceBundle = this.getResourceBundle();
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.error(oResourceBundle.getText("errorMessageGeneralPrefix"), {
				title: "Error",
				id: "errorMessageBox",
				details: sMessage,
				styleClass: bCompact ? "sapUiSizeCompact" : "",
				contentWidth: "100px"
			});
		},

		/**
		 * This function will display a messagebox with a network error message.
		 * 
		 * @param {jqXHR} jqXHR - jQuery xhr response object
		 */
		handleNetworkError: function (jqXHR) {
			this.handleEmptyModel(jqXHR.responseText + " (" + jqXHR.status + ")");
		}

	});
});