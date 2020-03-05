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
	
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.TableEmployees", {
		formatter: formatter,
		onInit: function () {
			employeeTableModel = new JSONModel();
			this.setModel(employeeTableModel, "employeeTableModel");

			var staticModel = new JSONModel();
			this.setModel(staticModel, "staticModel");
			//staticModel.datum = new Date().toISOString();

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
		setRequest: function (mid, amount, describ, date) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			console.log("set request");
			console.log(mid + amount + describ);
			var defaultRequest = {
				"MID": mid,
				"art": 2,
				"betrag": amount,
				"beschreibung": describ,
				"datum": date,
				"kid": 1,
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
			var dateFormatted = dateFormat.format(new Date);
			this.byId("datepicker0").setValue(dateFormatted);
		},
		
		//executes Dialog functions (Guthaben/Jahresabschluss)
		onExecuteDialog: function (GorA) {
			BusyIndicator.show();
			var staticModel = this.getModel("staticModel").getData();
			
			var thisView = this.getView();
			var SelectedItems = thisView.byId("table0").getSelectedItems();
			
			var datePickerControl = this.byId("datepicker0");
			var datePicked = datePickerControl.getDateValue();
			
			//TODO FEHLERMELDUNG bei keinen angewählten?
			for (var i = 0; i < SelectedItems.length; i++) {

				var context = SelectedItems[i].getBindingContext("employeeTableModel");
				var path = context.getPath();
				var mid = context.getProperty(path).MID;
				
				if(GorA === 'G'){//execute guthaben
					this.setRequest(mid, staticModel.betragG, 	staticModel.beschreibung, datePicked);
					this.makeRequest();
				}
				else{
					console.log("check in if");
					var date = staticModel.jahr1 - staticModel.jahr2;
					console.log(date);
					this.getExpired(mid, date);
				}
			}
			//closing the dialog box
			this.onAbortCloseDialog(1, OpendDialog);
		},
		
		//calculates the expired amount via sql query
		getExpired: function (mid, date) {
			var params = {};
			params.mid = mid;
			params.date = date;
			
			console.log(params.mid);
			console.log(params.date);
			
			var settings = this.prepareAjaxRequest("/MOB_ABSCHLUSS", "GET", params);
			
			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var oResponse = JSON.parse(response);
					
					// sets the value of expired either to 0 if its negative  or to -1*expired if its postive
					var expired = (oResponse.EXPIRED > 0 ? oResponse.EXPIRED * (-1) : 0);
					console.log(expired);
					console.log(that.mid);
					console.log(mid);
					console.log(this.mid);
					//TODO noch datum anpassen
					that.setRequest(mid, expired, "Abgelaufenes Guthaben", "31.12.2017");
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