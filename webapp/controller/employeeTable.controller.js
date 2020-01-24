/* eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"

], function (BaseController, formatter, JSONModel) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.employeeTable", {
		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("employeeTable").attachMatched(this._onRoutePatternMatched, this);
		},

		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
			this.getTableData();
		},

		getTableData: function (target) {
			
			var params = {};
			params.mid = null;
			
			var settings = {
				"url": "/MOB_MITARBEITER_GET",
				"method": "GET",
				"timeout": 0,
				"data": params
			};

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var employeeTableModel = new JSONModel();
					that.setModel(employeeTableModel , "employeeTableModel");
					employeeTableModel.setData(response);
				console.log(employeeTableModel);

				})
				.fail(function (jqXHR, exception) {
					that.handleEmptyModel(jqXHR.responseText + " (" + jqXHR.status + ")");
				});
		},

		onNavToDetail: function (oEvent) {
			var context = oEvent.getSource().getBindingContext("employeeTableModel");
			var path = context.getPath();

			var detail = JSON.stringify(context.getProperty(path));

			this.getRouter().navTo("Detail", {
				Detail: detail
			});
		}
	});
});