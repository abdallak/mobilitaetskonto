sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter"
], function (BaseController, JSONModel, formatter) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Umsatz", {
		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("Umsatz").attachMatched(this._onRoutePatternMatched, this);

			var dbUserModel = this.getGlobalModel("dbUserModel");
			this.setModel(dbUserModel, "dbUserModel");

			var umsatzModel = new JSONModel();
			this.setModel(umsatzModel, "umsatzModel");

			this._onRoutePatternMatched(null);
		},

		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
			this.getTableData();
		},

		getTableData: function () {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var umsatzModel = this.getModel("umsatzModel");

			var params = {};
			params.mid = dbUserData.MID;

			umsatzModel.loadData("/MOB_UMSATZ", params);
		},

		detailFunc: function (oEvent) {

			var context = oEvent.getSource().getBindingContext("umsatzModel");
			var path = context.getPath();

			var umsatzModel = this.getModel("umsatzModel");
			var detailModel = this.getGlobalModel("detailModel");
			detailModel.setData(umsatzModel.getProperty(path));

			this.getRouter().navTo("Detailansicht", {
				UID: "test"
			});
		}

	});
});