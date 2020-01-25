sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, JSONModel) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.TableEmployees", {
		formatter: formatter,

		onInit: function () {
			var employeeTableModel = new JSONModel();
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
			$.ajax(settings)
				.done(function (response) {
					var employeeTableModel = that.getModel("employeeTableModel");
					employeeTableModel.setData(response);
				})
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
		}
	});
});