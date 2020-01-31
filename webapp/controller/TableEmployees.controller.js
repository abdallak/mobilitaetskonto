/* eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function (BaseController, formatter, JSONModel, Fragment) {
	"use strict";
	var employeeTableModel;
	var insertModel;
	
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.TableEmployees", {
		formatter: formatter,
		onInit: function () {
			employeeTableModel = new JSONModel();
			insertModel = new JSONModel();

			this.setModel(employeeTableModel, "employeeTableModel");
			this.getRouter().getRoute("TableEmployees").attachMatched(this._onRoutePatternMatched, this);
		},
		
		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
			this.getTableData();
		},
		
		getTableData: function (target) {
			var params = {};
			params.mid = null;
			var settings = this.prepareAjaxRequest("/MOB_MITARBEITER_GET", "GET", params);
			var that = this;
			$.ajax(settings).done(function (response) {
				employeeTableModel = that.getModel("employeeTableModel");
				employeeTableModel.setData(response);
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},
		
		setRequest: function (mid, betrag, beschreibung) {
			//var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var defaultRequest = {
				"MID": mid,
				"art": 2,
				"betrag": betrag,
				"beschreibung": beschreibung,
				"kid": "0",    //nicht schön
				"state": 2
			};
			insertModel = new JSONModel(defaultRequest);
			this.setModel(insertModel, "insertModel");
		},
		
		makeRequest: function (oEvent) {
			var insertData = this.getModel("insertModel").getData();

			var settings = this.prepareAjaxRequest("/MOB_ANTRAG", "POST", JSON.stringify(insertData));
			var that = this;
			$.ajax(settings)
				.fail(function (jqXHR, exception) {
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
		
		GuthabenButton: function (oEvent) {
			var thisView = this.getView();
			// create dialog lazily
			if (!this.byId("GuthabenDialog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: thisView.getId(),
					name: "Mobilitaetskonto.Mobilitaetskonto.view.GuthabenDialog",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					thisView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("GuthabenDialog").open();
			}
			
		},
		
		onAbortAndCloseDialog : function () {
			this.byId("GuthabenDialog").close();
		},
		
		onExecuteAndCloseDialog : function () {
			//TODO FEHLERMELDUNG bei keinen angewählten?
			var thisView = this.getView();
			var SelectedItems = thisView.byId("table0").getSelectedItems();

			var SelectedMID = [];   //so lang machen wie selecteditems
			for(var i = 0; i < SelectedItems.length; i++){
				
				var context = SelectedItems[i].getBindingContext("employeeTableModel");
				var path = context.getPath();
				SelectedMID.push(context.getProperty(path).MID);
				
			}
			
			var content = this.byId("GuthabenDialog").getContent();
			var betrag = content[1].getValue();
			var beschreibung = content[3].getValue();
			
			for(var j = 0; j < SelectedMID.length; j++){
				this.setRequest(SelectedMID[j] , betrag, beschreibung);
				this.makeRequest();
			}
			//closing the dialog box
			this.byId("GuthabenDialog").close();
		}
	});
});