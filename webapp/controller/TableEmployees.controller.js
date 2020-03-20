sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, JSONModel, Fragment, BusyIndicator, Filter, FilterOperator) {
	"use strict";
	var opendDialog; //either DialogExpired    or     DialogBalance

	/**
	 * This Pages shows information on all Employees and offers the functionalities of
	 * 1: giving employees individual amounts of money (also negative)
	 * and 2: calculating and writing the expired Balance of employees
	 * 
	 * @class TableEmployees
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.TableEmployees", {
		formatter: formatter,

		/**
		 * A global JSON model which contains the current users details.
		 * 
		 * @typedef dbUserModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {string} MID - Employee id
		 */

		/**
		 * A global JSON model which contains the employee details.
		 * 
		 * @typedef employeeTableModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {string} VORNAME - firstname
		 * @property {string} NAME - lastname
		 * @property {string} MID - employee id
		 * @property {number} GUTHABEN - current balance
		 */

		/**
		 * A local JSON model which contains the details of the new transaction to be written into the database.
		 * 
		 * @typedef insertModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {string} mid - id of the employee
		 * @property {integer} art - type of the transaction (always 2 - individual balance)
		 * @property {float} betrag - amount of money of the transaction
		 * @property {string} beschreibung - description of the transaction
		 * @property {string} date - date of the transaction
		 * @property {integer} kid - id of the category of the trnasaction
		 * @property {integer} state - state of the transaction  (always 2 - accepted)
		 * @property {string} MIDV - id of the administrator writing the entry (for logging purposes)
		 */

		/**
		 * A local JSON model which contains values of the dialog inputs.
		 *  
		 * @typedef staticModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {float} amount - amount of money of the individual balance entry transaction
		 * @property {string} dateBalance - date on which the individual balance entry should be dated
		 * @property {string} description - description of the individual balance
		 */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 */
		onInit: function () {
			var employeeTableModel = new JSONModel();
			this.setModel(employeeTableModel, "employeeTableModel");

			var staticModel = new JSONModel();
			this.setModel(staticModel, "staticModel");
			//staticModel.jahr2 = 3;

			this.getRouter().getRoute("TableEmployees").attachMatched(this._onRoutePatternMatched, this);
		},

		/** 
		 * This Function is called everytime the TableEmployees View gets called
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
			this.getTableData();
		},

		/** 
		 * Fills the employee Table with Data
		 */
		getTableData: function () {
			var settings = this.prepareAjaxRequest("/MOB_EMPLOYEE_GET", "GET");
			var that = this;
			$.ajax(settings).done(function (response) {
				var employeeTableModel = that.getModel("employeeTableModel");
				employeeTableModel.setData(response);
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},

		/* Function can be used in the future if a functionality for clicking on one table entry is ever implemented
		onNavToDetail: function (oEvent) {
			var context = oEvent.getSource().getBindingContext("employeeTableModel");
			var path = context.getPath();
			var detail = JSON.stringify(context.getProperty(path));
			this.getRouter().navTo("DetailEmployee", {
				DetailEmployee: detail
			});
		},
		*/

		/**
		 * Sets the request Model (expired Balance, or individual entry) 
		 * dateBalance
		 * 
		 * @param{String} mid - ID of the employee getting the entry
		 * @param{float} amount - amount of money
		 * @param{String} describ - description of the new entry
		 * @param{String} date - date on which the entry will be dated
		 * @param{integer} kid - id of the category: 1 (individual entry) or 2 (expired balance)
		 */
		setRequest: function (mid, amount, describ, date, kid) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();

			var defaultRequest = {
				"MID": mid,
				"art": 2,
				"betrag": amount,
				"beschreibung": describ,
				"datum": date,
				"kid": kid,
				"state": 2,
				"MIDV": dbUserData.MID
			};
			var insertModel = new JSONModel(defaultRequest);
			this.setModel(insertModel, "insertModel");
		},

		/**
		 * Executes the request with the model set in setRequest
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		makeRequest: function (oEvent) {
			var insertData = this.getModel("insertModel").getData();
			var settings = this.prepareAjaxRequest("/MOB_REQUEST_INSERT", "POST", JSON.stringify(insertData));
			var that = this;
			$.ajax(settings)
				.done(function (response) {
					BusyIndicator.hide();
					that.getTableData();
				})
				.fail(function (jqXHR, exception) {
					BusyIndicator.hide();
					that.handleNetworkError(jqXHR);
				});
		},

		/**
		 * This function gets called whenever the amount input changes,
		 * and automatically checks wether the current value is valid or not.
		 * meanning: checking for everything that is not a number, point or comma
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onValueChanged: function (oEvent) {
			var oResourceBundle = this.getResourceBundle();
			var sValue = oEvent.getParameter("value");
			var oSource = oEvent.getSource();

			var betragValue = parseFloat(sValue);
			if (!isNaN(betragValue)) {
				oSource.setValueState("Success");
				oSource.setValueStateText(null);
			} else {
				oSource.setValueState("Error");
				oSource.setValueStateText(oResourceBundle.getText("errorEmptyBetrag"));
			}
		},

		/**
		 *  Is called when one of the dialogbuttons is clicked.
		 *  opens the corresponding dialog window and makes adjustments to the date picker 
		 *  depending on which of the dialogs was opend.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 * @param{String} dialogId - the name of the opend Dialog (DialogBalance or DialogExpired)
		 */
		dialogOpen: function (oEvent, dialogId) {
			var staticModel = this.getModel("staticModel").getData();

			var thisView = this.getView();
			opendDialog = dialogId;

			if (!this.byId(dialogId)) {
				// load asynchronous XML fragment
				Fragment.load({
					id: thisView.getId(),
					name: "Mobilitaetskonto.Mobilitaetskonto.view.TableEmployees".concat(dialogId),
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					thisView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId(dialogId).open();
			}

			var dateNotFormatted = new Date();
			var maxdate;
			var dateValue;

			if (opendDialog === "DialogExpired") {
				maxdate = dateNotFormatted;
				dateValue = dateNotFormatted.getFullYear() - 1;
				this.byId("datepicker0").setValue(dateValue);
			} else {
				maxdate = new Date(dateNotFormatted.getFullYear() + 20, 11, 31);
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd.MM.YYYY"
				});
				dateValue = dateFormat.format(dateNotFormatted);

				if (staticModel.dateBalance === undefined) {
					staticModel.dateBalance = dateValue;
				}
			}
			this.byId("datepicker0").setMinDate(new Date(2000, 0, 1));
			this.byId("datepicker0").setMaxDate(maxdate);
		},

		/**
		 * Executes the Dialog functions (Guthaben/Jahresabschluss) (individual balance/expired Balance).
		 * First gets all selected employees and gives a Error message if no one is selected
		 * then performs the chosen function for each of them
		 */
		onExecuteDialog: function () {
			BusyIndicator.show();
			var errorMsgString = "";
			var errorMsgNumber = 0; //number of IDs in errorMsgString

			var staticModel = this.getModel("staticModel").getData();

			var thisView = this.getView();
			var selectedItems = thisView.byId("table0").getSelectedItems();

			var datePickerControl = this.byId("datepicker0");

			var datePicked = datePickerControl.getDateValue();

			//ErrorMessage if no employee is chosen
			if (selectedItems.length < 1) {
				this.handleEmptyModel(this.getResourceBundle().getText("chooseEmployee"));
			}

			for (var i = 0; i < selectedItems.length; i++) {

				var context = selectedItems[i].getBindingContext("employeeTableModel");
				var path = context.getPath();
				var mid = context.getProperty(path).MID;
				var lastExpiredDate = context.getProperty(path).JAHRESABSCHLUSS;
				var lastExpiredYear = new Date(lastExpiredDate).getFullYear();

				if (opendDialog === 'DialogBalance') {
					this.setRequest(mid, staticModel.amount, staticModel.description, staticModel.dateBalance, 1);
					this.makeRequest();
				} else {

					var stepperControl = this.byId("stepper");

					var year1 = datePicked.getYear() + 1900;
					var yearCalculated = year1 - stepperControl.getValue();

					//if the picked year is less than the year the employee had its last expred calculation his ID is added to the error message
					if (year1 <= lastExpiredYear) {
						errorMsgString = errorMsgString + mid + ", ";
						errorMsgNumber++;
					} else {
						this.getExpired(mid, year1, yearCalculated);
					}
				}
			}
			//closing the dialog box
			this.onAbortCloseDialog(1);
			//Error message for all fals MIDs
			if (errorMsgNumber > 0) {
				var getText1 = (errorMsgNumber === 1 ? "errorDescription1Single" : "errorDescription1Multi");
				var text1 = this.getResourceBundle().getText(getText1);

				var text2 = this.getResourceBundle().getText("errorDescription2");

				var descriptionText = text1 + errorMsgString.substring(0, errorMsgString.length - 2) + " " + text2;
				this.handleEmptyModel(descriptionText);
			}
		},

		/** 
		 * Is called when expiredButton was clicked
		 * calculates the expired amount via sql query
		 * also calles function 'setRequest' and 'makeRequest' to insert new entry into sales table
		 * 
		 * @param{String} mid - the MID of the employee for whom the expired value should be calculated
		 * @param{String} year1 - the Year which should be 
		 * @param{String} yearCalculated - the latest year
		 */
		getExpired: function (mid, year1, yearCalculated) {
			var params = {};
			params.mid = mid;
			params.dateCalculated = "31.12." + yearCalculated;
			params.dateInitial = "31.12." + year1;

			var settings = this.prepareAjaxRequest("/MOB_EMPLOYEE_EXPIRED", "GET", params);

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					// sets the value of expired either to 0 if its negative  or to -1*expired if its postiv
					var expired = (response.EXPIRED > 0 ? response.EXPIRED * (-1) : 0);

					//sets the expiaration date
					var date = "31.12." + year1;

					//makes a new entry for the expired balance
					var descriptionText = that.getResourceBundle().getText("expiredDescription1") + " " + params.dateCalculated + " " + that.getResourceBundle()
						.getText("expiredDescription2");
					that.setRequest(mid, expired, descriptionText, date, 2);
					that.makeRequest();

				}).fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
		},

		/**
		 * This Function is used by the three filter controls of the UI. The SearchBar, the DateRangePicker and the ActionSelect.
		 * Everytime one of these is used, this method gets called.
		 * The method provides a final filter consisting of several others, related to the input given by the controls.
		 */
		filterTable: function () {

			var list = this.getView().byId("employeeTable");
			var binding = list.getBinding("items");

			var sSearchQuery = this.getView().byId("searchField0").getProperty("value");
			var filters = [];

			//SEARCHBAR FILTER
			if (sSearchQuery !== "") {
				var oSearchFilter = new Filter([
						new Filter("NAME", FilterOperator.Contains, sSearchQuery),
						new Filter("VORNAME", FilterOperator.Contains, sSearchQuery),
						new Filter("MID", FilterOperator.Contains, sSearchQuery)
					],
					false);

				filters.push(oSearchFilter);
			}

			binding.filter(filters);
		},

		/** 
		 * Is called on the abort buttons of the dialog and closes opend dialog
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onAbortCloseDialog: function (oEvent) {
			BusyIndicator.hide();
			this.byId(opendDialog).close();
			this.byId(opendDialog).destroy();
		}
	});
});