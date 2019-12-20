sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Umsatz", {

		onInit: function () {
			this.getRouter().getRoute("Umsatz").attachMatched(this._onRoutePatternMatched, this);

			var dbUserModel = this.getGlobalModel("dbUserModel");
			this.setModel(dbUserModel, "dbUserModel");

			var umsatzModel = new sap.ui.model.json.JSONModel();
			this.setModel(umsatzModel, "umsatzModel");

			this._onRoutePatternMatched(null);
		},

		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
			this.getTableData();
		},

		onNavToDetailansicht: function () {
			this.getRouter().navTo("Detailansicht");
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

			this.onNavToDetailansicht();
		}

	});
});