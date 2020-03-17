sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/m/Dialog",
	"sap/m/ButtonType",
	"sap/m/Input",
	"sap/m/Button",
	"sap/m/Text",
	"sap/m/Label",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator"
], function (BaseController, Dialog, ButtonType, Input, Button, Text, Label, Filter, FilterOperator, JSONModel, BusyIndicator) {
	"use strict";

	/**
	 * This controller provides a list of employees to change their administration values.
	 * @class SettingsAdministrationStatus
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.SettingsAdministrationStatus", {

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
		 */
		onInit: function () {
			var employeeTableModel = new JSONModel();
			this.setModel(employeeTableModel, "employeeTableModel");

			var oTable = this.getView().byId("table0");
			var oBinding = oTable.getBinding("items");
			var oFilter = new Filter("AKTIV", FilterOperator.EQ, "TRUE");
			oBinding.filter([oFilter]);

			this.getEventBus().subscribe("manageVerwalterguthaben", "show", this.onBeforeShow, this);
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
			if (iValue < 0) {
				this.handleEmptyModel("you cannt give a negative number");
				return;
			}

			var settings = this.prepareAjaxRequest("/MOB_STATUS_ADMINISTRATION", "POST", JSON.stringify(employeeStatus));
			BusyIndicator.show();
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
		 * This function gets called if the amount input changes.
		 * It will check if the given value is valid or not.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onValueChanged: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oSource = oEvent.getSource();
			var betragValue = parseFloat(sValue);
			if (!isNaN(betragValue) && betragValue > 0.0) {
				oSource.setValueState("Success");
				oSource.setValueStateText(null);
			} else {
				oSource.setValueState("Error");
			}
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
					new Text({
						text: that.getResourceBundle().getText("settingsAdministrationStatusInfo")
					}),
					new Input("newValueInput", {
						width: "100%",
						type: "Number",
						placeholder: that.getResourceBundle().getText("settingsAdministrationStatusDialogPlaceholder"),
						liveChange: that.onValueChanged,
						valueLiveUpdate: true
					}),
					new Label({
						text: that.getResourceBundle().getText("settingsAdministrationStatusInvalidValueWarning")
					})
				],
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: that.getResourceBundle().getText("settingsAdministrationStatusDialogBegin"),
					press: function () {
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
		},

		handleLiveChange: function (oEvent) {
			var oSource = oEvent.getSource();
			var input = oSource.getValue();
			var lastInput = input.slice(-1); //retrieves last character

			//Punkt und Komma sind mehrmals möglich
			if (isNaN(lastInput) && !(lastInput === "-" && input.length === 1) && !(lastInput === "." || lastInput === ",")) {
				oSource.setValue(input.slice(0, input.length - 1));
			}
		}

	});

});