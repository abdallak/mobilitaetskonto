sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/m/Dialog",
	"sap/m/ButtonType",
	"sap/m/Input",
	"sap/m/Button",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator"
], function (BaseController, Dialog, ButtonType, Input, Button, JSONModel, BusyIndicator) {
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
		 * @property {integer} FREIGABEWERT - administration value
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
			var settings = this.prepareAjaxRequest("/MOB_MITARBEITER_GET", "GET");

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
			employeeStatus.type = "value";
			employeeStatus.administrationValue = iValue;

			var settings = this.prepareAjaxRequest("/MOB_STATUS_ADMINISTRATION", "POST", JSON.stringify(employeeStatus));

			var that = this;
			$.ajax(settings).done(function (response) {
				BusyIndicator.hide();
				var employeeTableModel = that.getModel("employeeTableModel");
				employeeTableModel.setData(response);
			}).fail(function (jqXHR, exception) {
				BusyIndicator.hide();
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

			var that = this;
			var oDialog = new Dialog({
				title: that.getResourceBundle().getText("settingsAdministrationStatusDialogTitle"),
				type: "Message",
				content: [
					new Input("newValueInput", {
						width: "100%",
						placeholder: that.getResourceBundle().getText("settingsAdministrationStatusDialogPlaceholder")
					})
				],
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: that.getResourceBundle().getText("settingsAdministrationStatusDialogBegin"),
					press: function () {
						BusyIndicator.show();
						var sText = sap.ui.getCore().byId("newValueInput").getValue();
						that.setEmployeeStatus(mid, sText);
						oDialog.close();
					}
				}),
				endButton: new Button({
					text: that.getResourceBundle().getText("settingsAdministrationStatusDialogEnd"),
					press: function () {
						oDialog.close();
					}
				}),
				afterClose: function () {
					oDialog.destroy();
				}
			});

			oDialog.open();
		}

	});

});