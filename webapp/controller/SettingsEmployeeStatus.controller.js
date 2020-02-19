sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	/**
	 * This controller provides a list of employees to change their status (active/inactive) or to delete an employee.
	 * @class SettingsEmployeeStatus
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.SettingsEmployeeStatus", {

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
		 * It will set an empty employeeTableModel and triggers a model update.
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
		 * @param{sap.m.ListItemBase[]} oSelectedItems - Selected employee list items
		 * @param{boolean} bStatus - New status
		 */
		setEmployeeStatus: function (oSelectedItems, bStatus) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var paramData = [];

			for (var i = 0; i < oSelectedItems.length; i++) {
				var context = oSelectedItems[i].getBindingContext("employeeTableModel");
				var path = context.getPath();

				var employeeStatus = {};
				employeeStatus.status = bStatus;
				employeeStatus.mid = context.getProperty(path).MID;
				employeeStatus.amid = dbUserData.MID;
				paramData.push(employeeStatus);
			}

			var settings = this.prepareAjaxRequest("/MOB_STATUS_AENDERN", "POST", JSON.stringify(paramData));

			var that = this;
			$.ajax(settings).done(function (response) {
				var employeeTableModel = that.getModel("employeeTableModel");
				employeeTableModel.setData(response);
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},

		/**
		 * This function will change the status of all selected employees to active.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onAktivPressed: function (oEvent) {
			var oList = this.byId("list0");
			var oSelectedItems = oList.getSelectedItems();

			if (oSelectedItems.length === 0) {
				sap.m.MessageToast.show("Bitte mindestens ein Element auswählen");
				return;
			}

			this.setEmployeeStatus(oSelectedItems, true);
		},

		/**
		 * This function will change the status of all selected employees to inactive.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onInaktivPressed: function (oEvent) {
			var oList = this.byId("list0");
			var oSelectedItems = oList.getSelectedItems();

			if (oSelectedItems.length === 0) {
				sap.m.MessageToast.show("Bitte mindestens ein Element auswählen");
				return;
			}

			this.setEmployeeStatus(oSelectedItems, false);
		},

		/**
		 * This function will delete all selected employees.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onDeletePressed: function (oEvent) {
			var oList = this.byId("list0");
			var oSelectedItems = oList.getSelectedItems();

			if (oSelectedItems.length === 0) {
				sap.m.MessageToast.show("Bitte mindestens ein Element auswählen");
				return;
			}

			sap.m.MessageToast.show("Noch nicht implementiert.");
		}
	});
});