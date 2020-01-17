sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter"
],	function(BaseController, formatter) {
		"use strict";
		return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.EmployeeRequestTable", {
			formatter: formatter,
			onInit: function() {
				//this.getRouter().getRoute("EmployeeRequestTable").attachMatched(this._onRoutePatternMatched, this);
				//TODO employeeRequestTableModel, Service mit Anträge WHERE MID = Antrag.MID
				
				var dbUserModel = this.getGlobalModel("dbUserModel");
				this.setModel(dbUserModel, "dbUserModel");
			},
			onNavToEmployeeRequestDetail: function() {
				this.getRouter().navTo("EmployeeRequestDetail");
			}
		});
	});  