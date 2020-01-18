sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter"
], function (BaseController, formatter) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Sales", {
		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("Sales").attachMatched(this._onRoutePatternMatched, this);
			this._onRoutePatternMatched(null);
		},

		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
			this.getTableData();
		},

		getTableData: function () {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var params = {};
			params.mid = dbUserData.MID;

			var settings = {
				"url": "/MOB_UMSATZ",
				"method": "GET",
				"timeout": 0,
				"data": params
			};

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var salesModel = that.getGlobalModel("salesModel");
					salesModel.setData(response);
				})
				.fail(function (jqXHR, exception) {
					that.handleEmptyModel("Leider ist ein Fehler aufgetreten: " + jqXHR.responseText + " (" + jqXHR.status + ")");
				});
		},

		onNavToDetail: function (oEvent) {
			var context = oEvent.getSource().getBindingContext("salesModel");
			var path = context.getPath();

			var detail = JSON.stringify(context.getProperty(path));

			this.getRouter().navTo("Detail", {
				Detail: detail
			});
		}
	});
});