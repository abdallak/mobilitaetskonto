/* eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/core/BusyIndicator"
], function (BaseController, formatter, JSONModel, Fragment, BusyIndicator) {
	"use strict";
	var employeeTableModel;
	var insertModel;
	var OpendDialog;
	/**
	*	sets the
	*
	*
	* 
	* 
	*/
	
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.TableEmployees", {
		formatter: formatter,
		onInit: function () {
			employeeTableModel = new JSONModel();
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
			var settings = this.prepareAjaxRequest("/MOB_MITARBEITER_GET", "GET");
			var that = this;
			$.ajax(settings).done(function (response) {
				employeeTableModel = that.getModel("employeeTableModel");
				employeeTableModel.setData(response);
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},
		
		onNavToDetail: function (oEvent) {
			var context = oEvent.getSource().getBindingContext("employeeTableModel");
			var path = context.getPath();
			var detail = JSON.stringify(context.getProperty(path));
			this.getRouter().navTo("DetailEmployee", {
				DetailEmployee: detail
			});
		},
		
		//sets the request Modell 
		setRequest: function (mid, amount, describ, date, kid) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			console.log("set request");
			console.log(mid + " " + amount + " " + describ);
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
			insertModel = new JSONModel(defaultRequest);
			this.setModel(insertModel, "insertModel");
		},

		//executes the request with the model set in setRequest
		makeRequest: function (oEvent) {
			console.log("make request");
			var insertData = this.getModel("insertModel").getData();
			var settings = this.prepareAjaxRequest("/MOB_ANTRAG", "POST", JSON.stringify(insertData));
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
			
			if(dialogId === "DialogExpired"){
				dateNotFormatted.setFullYear( dateNotFormatted.getFullYear() - 1 );
				this.byId("datepicker0").setMaxDate(dateNotFormatted);
			}
			var dateFormatted = dateFormat.format(dateNotFormatted);
			this.byId("datepicker0").setValue(dateFormatted);
			this.byId("datepicker0").setMinDate(new Date(2000 , 1 , 1));
			
		},
		
		//executes Dialog functions (Guthaben/Jahresabschluss)
		onExecuteDialog: function (GorA) {
			BusyIndicator.show();
			var staticModel = this.getModel("staticModel").getData();
			
			var thisView = this.getView();
			var SelectedItems = thisView.byId("table0").getSelectedItems();

			var datePickerControl = this.byId("datepicker0");
		
			var datePicked = datePickerControl.getDateValue();
			
			//ErrorMessage if no employees chosen  -- FEHLERMELDUNG bei keinen angewählten?
			if(SelectedItems.length < 1){ 
				this.handleEmptyModel("bitte Mitarbeiter auswählen");
			}
			
			for (var i = 0; i < SelectedItems.length; i++) {

				var context = SelectedItems[i].getBindingContext("employeeTableModel");
				var path = context.getPath();
				var mid = context.getProperty(path).MID;
				
				if(GorA === 'G'){//execute guthaben
					this.setRequest(mid, staticModel.betragG, 	staticModel.beschreibung, datePicked, 1);
					this.makeRequest();
				}
				else{
					//check einbauen dass das jahr2 gefüllt ist. ansonste nstandardmäßig 3 nehmen
					var stepperControl = this.byId("stepper");
					//var stepperValue = stepperControl.getValue();
					
					var year1 = datePicked.getYear() + 1900;
					var year2 = year1 - stepperControl.getValue();
					
					this.getExpired(mid, year1, year2);
				}
			}
			//closing the dialog box
			this.onAbortCloseDialog(1, OpendDialog);
		},
		
		//calculates the expired amount via sql query
		getExpired: function (mid, year1, year2) {
			
			var params = {};
			params.mid = mid;
			params.date = "31.12." + year2;
			
			var settings = this.prepareAjaxRequest("/MOB_ABSCHLUSS", "GET", params);
			
			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var oResponse = JSON.parse(response);
					
					// sets the value of expired either to 0 if its negative  or to -1*expired if its postive

					//oResponse.Valid
					var expired = (oResponse.EXPIRED > 0 ? oResponse.EXPIRED * (-1) : 0);
					
					//Calculates date
					var date = "31.12." + year1;
					
					//makes a new entry for the expired balance
					that.setRequest(mid, expired, "Abgelaufenes Guthaben", date, 2);
					that.makeRequest();
					
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},

		onAbortCloseDialog: function (oEvent, dialogId) {
			BusyIndicator.hide();
			this.byId(dialogId).close();
			this.byId(dialogId).destroy();
		}
	});
});