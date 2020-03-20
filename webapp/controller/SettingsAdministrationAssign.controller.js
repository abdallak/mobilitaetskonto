sap.ui.define([
	"jquery.sap.global",
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/core/Fragment",
	"sap/m/Dialog",
	"sap/m/Input",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator"
], function (jQuery, BaseController, Fragment, Dialog, Input, Filter, FilterOperator, JSONModel, BusyIndicator) {
	"use strict";

	/**
	 * This controller provides a list of employees to change their assigned freigeber.
	 * @class SettingsAdministrationAssign
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.SettingsAdministrationAssign", {

		/**
		 * A global JSON model which contains the employee details.
		 * 
		 * @typedef employeeTableModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {string} VORNAME - firstname
		 * @property {string} NAME - lastname
		 * @property {string} MID - employee id
		 * @property {number} GUTHABEN - current balance
		 * @property {boolean} AKTIV - isActive
		 * @property {integer} FREIGABEWERT - administration value
		 * @property {string} FREIGEBER - assigned freigeber id
		 */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 */
		onInit: function () {
			var employeeTableModel = new JSONModel();
			this.setModel(employeeTableModel, "employeeTableModel");

			this.getEventBus().subscribe("assignAdministrators", "show", this.onBeforeShow, this);
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
		 * @param{string} sFreigeberId - New freigeber id
		 */
		setEmployeeStatus: function (mid, sFreigeberId) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();

			var employeeStatus = {};
			employeeStatus.mid = mid;
			employeeStatus.amid = dbUserData.MID;
			employeeStatus.type = "freigeber";
			employeeStatus.freigeberId = sFreigeberId;

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
		 * This function will show a Dialog with an Input to assign the freigeber.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onEditPressed: function (oEvent) {
			var mid = oEvent.getSource().data("MID");

			var selectedMIDModel = new JSONModel();
			selectedMIDModel.setData({
				mid: mid
			});
			this.setModel(selectedMIDModel, "selectedMIDModel");

			var oButton = oEvent.getSource();
			if (!this._oDialog) {
				Fragment.load({
					name: "Mobilitaetskonto.Mobilitaetskonto.view.SettingsAdministrationAssignDialog",
					controller: this
				}).then(function (oDialog) {
					this._oDialog = oDialog;
					this._oDialog.setModel(this.getModel("employeeTableModel"), "employeeTableModel");
					this._configDialog(oButton);
					this._oDialog.open();
				}.bind(this));
			} else {
				this._oDialog.setModel(this.getModel("employeeTableModel"), "employeeTableModel");
				this._configDialog(oButton);
				this._oDialog.open();
			}
		},

		/**
		 * This function will config all properties of the SettingsAdministrationAssignDialog
		 * 
		 * @param{sap.ui.base.Button} oButton - oButton
		 */
		_configDialog: function (oButton) {
			// Multi-select if required
			var bMultiSelect = !!oButton.data("multi");
			this._oDialog.setMultiSelect(bMultiSelect);

			var sCustomConfirmButtonText = oButton.data("confirmButtonText");
			this._oDialog.setConfirmButtonText(sCustomConfirmButtonText);

			// Remember selections if required
			var bRemember = !!oButton.data("remember");
			this._oDialog.setRememberSelections(bRemember);

			//add Clear button if needed
			var bShowClearButton = !!oButton.data("showClearButton");
			this._oDialog.setShowClearButton(bShowClearButton);

			// Set growing property
			var bGrowing = oButton.data("growing");
			this._oDialog.setGrowing(bGrowing == "true");

			// Set growing threshold
			var sGrowingThreshold = oButton.data("threshold");
			if (sGrowingThreshold) {
				this._oDialog.setGrowingThreshold(parseInt(sGrowingThreshold));
			}

			// Set draggable property
			var bDraggable = oButton.data("draggable");
			this._oDialog.setDraggable(bDraggable == "true");

			// Set draggable property
			var bResizable = oButton.data("resizable");
			this._oDialog.setResizable(bResizable == "true");

			// Set style classes
			var sResponsiveStyleClasses =
				"sapUiResponsivePadding--header sapUiResponsivePadding--subHeader sapUiResponsivePadding--content sapUiResponsivePadding--footer";
			var sResponsivePadding = oButton.data("responsivePadding");
			if (sResponsivePadding) {
				this._oDialog.addStyleClass(sResponsiveStyleClasses);
			} else {
				this._oDialog.removeStyleClass(sResponsiveStyleClasses);
			}

			// clear the old search filter
			this._oDialog.getBinding("items").filter([
				new Filter("FREIGABEWERT", FilterOperator.GT, 0)
			]);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
		},

		/**
		 * This function will filter the table as the user types something into the searchfield.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");

			var oFilter = new Filter([
					new Filter("NAME", FilterOperator.Contains, sValue),
					new Filter("VORNAME", FilterOperator.Contains, sValue)
				],
				false
			);

			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter, new Filter("FREIGABEWERT", FilterOperator.GT, 0)]);
		},

		/**
		 * This function will either submit the changes or cancel the dialog.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		handleClose: function (oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				BusyIndicator.show();

				var selectedMID = this.getModel("selectedMIDModel").getData().mid;
				var freigeberMID = aContexts[0].getObject().MID;

				this.setEmployeeStatus(selectedMID, freigeberMID);
				oEvent.getSource().getBinding("items").filter([new Filter("FREIGABEWERT", FilterOperator.GT, 0)]);
			}
		}
	});
});