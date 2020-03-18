/* eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/core/BusyIndicator"
], function (BaseController, formatter, JSONModel, Fragment, BusyIndicator) {
	"use strict";
	var OpendDialog; //either DialogExpired    or     DialogBalance

	/**
	*	this Pages shows information on all Employees and offers the functionalities of
	* 1: giving employees individual amounts of money (also negative)
	* 
	* and 2: calculating and writing the expired Balance of employees
	* 
	*/
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.TableEmployees", {
		formatter: formatter,
		onInit: function () {
			var employeeTableModel = new JSONModel();
			this.setModel(employeeTableModel, "employeeTableModel");

			var staticModel = new JSONModel();
			this.setModel(staticModel, "staticModel");
			staticModel.jahr2 = 3;

			this.getRouter().getRoute("TableEmployees").attachMatched(this._onRoutePatternMatched, this);
		},

		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
			this.getTableData();
		},
		
		//fills the Table
		getTableData: function (target) {
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
		
		//sets the request Modell (expired Balance, or individual entry)
		setRequest: function (mid, amount, describ, date, kid) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			console.log("set request");
			
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

		//executes the request with the model set in setRequest
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
		 * meanning: checking for everything that is not a Number, point or comma
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
		 *  is called when one of the dialogbuttons is clicked.
		 *  opens the corresponding dialog window and makes adjustments to the date picker 
		 *  depending on which of the dialogs was opend.
		 * 
		 * TODO read dialogId directly out of oEvent?
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 * @param{String} dialogId - the name of the opend Dialog (DialogBalance or DialogExpired)
		 */
		dialogOpen: function (oEvent, dialogId) {
			
			var thisView = this.getView();
			OpendDialog = dialogId;

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
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd.MM.YYYY" });   
			var dateNotFormatted = new Date();
			
			if(OpendDialog === "DialogExpired"){
				dateNotFormatted.setFullYear( dateNotFormatted.getFullYear() - 1 );
				this.byId("datepicker0").setMaxDate(dateNotFormatted);
			}
			var dateFormatted = dateFormat.format(dateNotFormatted);
			this.byId("datepicker0").setValue(dateFormatted);
			this.byId("datepicker0").setMinDate(new Date(2000 , 1 , 1));
			
		},
		
		/**
		 * executes the Dialog functions (Guthaben/Jahresabschluss)
		 * first gets all selected employees and gives a Error message if no one is selected
		 * then performs the chosen function for each of them
		 */
		//onExecuteDialog: function (GorA) {
		onExecuteDialog: function () {
			BusyIndicator.show();
			var staticModel = this.getModel("staticModel").getData();
			
			var thisView = this.getView();
			var SelectedItems = thisView.byId("table0").getSelectedItems();

			var datePickerControl = this.byId("datepicker0");
		
			var datePicked = datePickerControl.getDateValue();
			
			//ErrorMessage if no employee is chosen
			if(SelectedItems.length < 1){ 
				this.handleEmptyModel(this.getResourceBundle().getText("chooseEmployee"));
			}
			
			for (var i = 0; i < SelectedItems.length; i++) {

				var context = SelectedItems[i].getBindingContext("employeeTableModel");
				var path = context.getPath();
				var mid = context.getProperty(path).MID;
				
				//if(GorA === 'G'){
				if(OpendDialog === 'DialogBalance'){
					this.setRequest(mid, staticModel.betragG, 	staticModel.beschreibung, datePicked, 1);
					this.makeRequest();
				}
				else{
					var stepperControl = this.byId("stepper");
					
					var year1 = datePicked.getYear() + 1900;
					var year2 = year1 - stepperControl.getValue();
					
					this.getExpired(mid, year1, year2);
				}
			}
			//closing the dialog box
			this.onAbortCloseDialog(1);
		},
		
		/** is called when expiredButton was clicked
		 * calculates the expired amount via sql query
		 * also calles function 'setRequest' and 'makeRequest' to insert new entry into sales table
		 * 
		 * @param{String} mid - the MID of the employee for whom the expired value should be calculated
		 * @param{String} year1 - the Year which should be 
		 * @param{String} year2 - the latest year
		 */
		getExpired: function (mid, year1, year2) {
			
			var params = {};
			params.mid = mid;
			params.date = "31.12." + year2;
			
			var settings = this.prepareAjaxRequest("/MOB_EMPLOYEE_EXPIRED", "GET", params);
			
			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var oResponse = JSON.parse(response);
					
					// sets the value of expired either to 0 if its negative  or to -1*expired if its postive
					var expired = (oResponse.EXPIRED > 0 ? oResponse.EXPIRED * (-1) : 0);
					
					//sets the expiaration date
					var date = "31.12." + year1;
					
					//makes a new entry for the expired balance
					that.setRequest(mid, expired, "Abgelaufenes Guthaben", date, 2);
					that.makeRequest();
					
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},
		
		/** is called on the abort buttons of the dialog and
		 *  closes opend dialog
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onAbortCloseDialog: function (oEvent) {
			BusyIndicator.hide();
			this.byId(OpendDialog).close();
			this.byId(OpendDialog).destroy();
		}
	});
});