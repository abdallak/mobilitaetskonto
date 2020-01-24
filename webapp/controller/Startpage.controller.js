sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Startpage", {

		onInit: function () {
			this.getRouter().getRoute("Startpage").attachMatched(this._onRoutePatternMatched, this);
		},

		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
		},

		onNavToSales: function () {
			this.getRouter().navTo("Sales",{Target: "Sales"});
		},
		
		onNavToSubmittedRequests: function(){
			this.getRouter().navTo("Sales",{Target: "SubmittedRequests"});
		},

		onNavToRequest: function () {
			this.getRouter().navTo("Request");
		},
		
		onNavToRequestTable: function () {
			this.getRouter().navTo("RequestTable");
		},
		
		onNavToemployeeTable: function () {
			this.getRouter().navTo("employeeTable");
		}

	});
});