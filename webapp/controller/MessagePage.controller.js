sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	/**
	 * This controller displays an error message, icon and description.
	 * @class MessagePage
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.MessagePage", {

		/**
		 * A local JSON model which contains details of the current error message.
		 * 
		 * @typedef errorPageModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {string} sIconPath - SAP Icon without prefix
		 * @property {string} sErrorMessage - Error message
		 * @property {string} sErrorDescription - Error detail or description
		 * @property {boolean} bStartpageButton - Show button to navigate to Startpage
		 */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * 
		 * It will set the an empty "errorPageModel" and attach the route pattern matcher to reload the details on this page.
		 */
		onInit: function () {
			this.setModel(new JSONModel(), "errorPageModel");
			this.getRouter().getRoute("MessagePage").attachMatched(this._onRoutePatternMatched, this);
		},

		/**
		 * If the route pattern matched, this function will extract and set the errorPageModel.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent containing the error model data inside the "arguments" parameter
		 */
		_onRoutePatternMatched: function (oEvent) {
			var errorPageModel = this.getModel("errorPageModel");
			var oErrorData = JSON.parse(oEvent.getParameter("arguments").error);
			errorPageModel.setData(oErrorData);
		}

	});

});