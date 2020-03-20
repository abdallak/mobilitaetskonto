sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
	"use strict";

	/**
	 * This is the first loaded view of this application.
	 * It hides tiles depending on an users roles e.g. administration.
	 * @class Startpage
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Startpage", {
		/**
		 * A global JSON model which contains the current users details.
		 * 
		 * @typedef dbUserModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {number} GUTHABEN - current balance
		 * @property {boolean} AKTIV - isActive
		 * @property {integer} FREIGABEWERT - administration value
		 */

		/**
		 * A global JSON model which contains the current users roles.
		 * 
		 * @typedef roleModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {boolean} mitarbeiter - is current user an employee
		 * @property {boolean} verwalter - is current user an administration 
		 */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * 
		 * It will attach the route pattern matcher to always reload the currently available usermodel.
		 */
		onInit: function () {
			this.getRouter().getRoute("Startpage").attachMatched(this._onRoutePatternMatched, this);
		},

		/**
		 * If the route pattern matched, this function will reload the current users balance.
		 * 
		 * @param{sap.ui.base.Event} [oEvent] - oEvent
		 */
		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
		},

		/**
		 * This function will navigate to the TableSales view to show all transactions of this user.
		 */
		onNavToSales: function () {
			this.getRouter().navTo("TableSales", {
				Target: "TableSales"
			});
		},

		/**
		 * This function will navigate to the TableSales view to show all requests of this user.
		 */
		onNavToSubmittedRequests: function () {
			this.getRouter().navTo("TableSales", {
				Target: "SubmittedRequests"
			});
		},

		/**
		 * This function will navigate to the Request view.
		 */
		onNavToRequest: function () {
			this.getRouter().navTo("Request");
		},

		/**
		 * This function will navigate to the TableRequest view for administration tasks.
		 */
		onNavToRequestTable: function () {
			this.getRouter().navTo("TableRequests");
		},

		/**
		 * This function will navigate to the TableEmployees view for administration tasks.
		 */
		onNavToTableEmployees: function () {
			this.getRouter().navTo("TableEmployees");
		},

		/**
		 * This function will navigate to the Settings view for administration tasks.
		 */
		onNavToSettings: function () {
			this.getRouter().navTo("Settings");
		}

	});
});