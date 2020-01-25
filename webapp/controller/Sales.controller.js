sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/m/MessageToast"
], function (BaseController, formatter) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Sales", {
		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("Sales").attachMatched(this._onRoutePatternMatched, this);
		},

		_onRoutePatternMatched: function (oEvent) {
			var target = oEvent.getParameter("arguments").Target;
			this.updateUserModel();
			this.getTableData(target);
		},

		getTableData: function (target) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var params = {};
			params.mid = dbUserData.MID;
			if (target === "Sales") {
				params.status1 = 2;
				params.status2 = 3;
			} else {
				params.status1 = 0;
				params.status2 = 1;
			}

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
					that.handleEmptyModel(jqXHR.responseText + " (" + jqXHR.status + ")");
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