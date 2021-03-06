sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator"
], function (BaseController, JSONModel, BusyIndicator) {
	"use strict";

	/**
	 * This controller provides a list of employees to change their status (active/inactive) or to delete an employee.
	 * @class SettingsEmployeeStatus
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.SettingsEmployeeStatus", {

		/**
		 * A global JSON model which contains the current users details.
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
		 * It will set an empty employeeTableModel and triggers a model update.
		 */
		onInit: function () {
			var employeeTableModel = new JSONModel();
			this.setModel(employeeTableModel, "employeeTableModel");
			this.getEmployeeData();

			this.getEventBus().subscribe("manageEmployeeStatus", "show", this.onBeforeShow, this);
		},

		/**
		 * This is a workaround to update the navigation containers everytime the view appears
		 * The main settings view sends an EventBus event to the viewId e.g. "showLog" with a "show" message.
		 * 
		 * @param{string} evt - viewId
		 */
		onBeforeShow: function (evt) {
			this.getEmployeeData();
		},

		/**
		 * This function will update the employeeTableModel.
		 */
		getEmployeeData: function () {
			var settings = this.prepareAjaxRequest("/MOB_EMPLOYEE_GET", "GET");

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
		 * @param{[sap.m.ListItemBase]} oSelectedItems - Selected employee list items
		 * @param{boolean} bStatus - New status
		 */
		setEmployeeStatus: function (oSelectedItems, bStatus) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var paramData = [];

			for (var i = 0; i < oSelectedItems.length; i++) {
				var context = oSelectedItems[i].getBindingContext("employeeTableModel");
				var path = context.getPath();

				var employeeStatus = {};
				employeeStatus.aktiv = bStatus;
				employeeStatus.mid = context.getProperty(path).MID;
				employeeStatus.amid = dbUserData.MID;
				paramData.push(employeeStatus);
			}

			var settings = this.prepareAjaxRequest("/MOB_EMPLOYEE_CHANGESTATE", "POST", JSON.stringify(paramData));

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
		 * @param{[sap.m.ListItemBase]} oSelectedItems - Selected employee list items
		 */
		deleteEmployee: function (oSelectedItems) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var paramData = [];

			for (var i = 0; i < oSelectedItems.length; i++) {
				var context = oSelectedItems[i].getBindingContext("employeeTableModel");
				var path = context.getPath();
				var employeeStatus = {};
				employeeStatus.aktiv = context.getProperty(path).AKTIV === "TRUE";
				employeeStatus.mid = context.getProperty(path).MID;
				employeeStatus.amid = dbUserData.MID;
				paramData.push(employeeStatus);
			}

			var settings = this.prepareAjaxRequest("/MOB_EMPLOYEE_DELETE", "POST", JSON.stringify(paramData));

			var that = this;
			$.ajax(settings).done(function (response) {
				// var employeeTableModel = that.getModel("employeeTableModel");
				// employeeTableModel.setData(response);
				that.getEmployeeData();
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
			var oTable = this.byId("table0");
			var oSelectedItems = oTable.getSelectedItems();

			if (oSelectedItems.length === 0) {
				sap.m.MessageToast.show(this.getResourceBundle().getText("selectAtLeastOne"));
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
			var oTable = this.byId("table0");
			var oSelectedItems = oTable.getSelectedItems();

			if (oSelectedItems.length === 0) {
				sap.m.MessageToast.show(this.getResourceBundle().getText("selectAtLeastOne"));
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
			var oTable = this.byId("table0");
			var oSelectedItems = oTable.getSelectedItems();

			if (oSelectedItems.length === 0) {
				sap.m.MessageToast.show(this.getResourceBundle().getText("selectAtLeastOne"));
				return;
			}
			this.deleteEmployee(oSelectedItems);

		}
	});
});