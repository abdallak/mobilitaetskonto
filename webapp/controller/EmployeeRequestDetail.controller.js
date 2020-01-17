sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter"
],	function(BaseController, formatter) {
		"use strict";
		return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.EmployeeRequestDetail", {
			formatter: formatter,
			onInit: function() {
				//this.getRouter().getRoute("EmployeeRequestTable").attachMatched(this._onRoutePatternMatched, this);
				//TODO employeeRequestModel
				
				var dbUserModel = this.getGlobalModel("dbUserModel");
				this.setModel(dbUserModel, "dbUserModel");
			}
		});
	});  