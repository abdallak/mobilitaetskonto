sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/m/Dialog",
	"sap/m/ButtonType",
	"sap/m/Input",
	"sap/m/Button",
	"sap/ui/model/json/JSONModel"
], function (BaseController, Dialog, ButtonType, Input, Button, JSONModel) {
	"use strict";

	/**
	 * This controller provides a list of employees to change their administration values.
	 * @class SettingsAdministrationStatus
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.SettingsAdministrationStatus", {

		/**
		 * A local JSON model which contains all active categories.
		 * 
		 * @typedef employeeTableModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {string} VORNAME - firstname
		 * @property {string} NAME - lastname
		 * @property {string} MID - employee id
		 * @property {number} GUTHABEN - current balance
		 * @property {boolean} AKTIV - isActive
		 * @property {integer} VERWALTER - administration value
		 */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * 
		 */
		onInit: function () {
			var employeeTableModel = new JSONModel();
			this.setModel(employeeTableModel, "employeeTableModel");
			this.getEmployeeData();
		},

		/**
		 * This function will update the employeeTableModel.
		 */
		getEmployeeData: function () {
			var params = {};
			params.mid = null;

			var settings = this.prepareAjaxRequest("/MOB_MITARBEITER_GET", "GET", params);

			var that = this;
			$.ajax(settings).done(function (response) {
				var employeeTableModel = that.getModel("employeeTableModel");
				employeeTableModel.setData(response);
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},

		/**
		 * This is a helper function which will prepare and perform the network requests.
		 * 
		 * @param{string} mid - Selected employee id
		 * @param{integer} iValue - New administration value
		 */
		setEmployeeStatus: function (mid, iValue) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();

			var employeeStatus = {};
			employeeStatus.mid = mid;
			employeeStatus.amid = dbUserData.MID;
			employeeStatus.administrationValue = iValue;

			var settings = this.prepareAjaxRequest("/MOB_STATUS_AENDERN", "POST", JSON.stringify(employeeStatus));

			var that = this;
			$.ajax(settings).done(function (response) {
				var employeeTableModel = that.getModel("employeeTableModel");
				employeeTableModel.setData(response);
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},

		/**
		 * This function will show a Dialog with an Input to change the adminsitration value.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onEditPressed: function (oEvent) {
			var mid = oEvent.getSource().data("MID");
			
			
			console.log(mid);
			var that = this;
			var oDialog = new Dialog({
				title: "Freigabebetrag des Verwalters ändern",
				type: "Message",
				content: [
					new Input("newValueInput", {
						width: "100%",
						placeholder: "Neuer Freigabewert des Verwalters"
					})
				],
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: "Ändern",
					press: function () {
						var sText = sap.ui.getCore().byId("newValueInput").getValue();
						console.log(sText, mid);
						// that.setEmployeeStatus(mid, sText);
						oDialog.close();
					}
				}),
				endButton: new Button({
					text: "Abbrechen",
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});

			oDialog.open();
		},

	});

});