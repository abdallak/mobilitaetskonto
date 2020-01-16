sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter"
], function (BaseController, JSONModel, formatter) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Sales", {
		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("Sales").attachMatched(this._onRoutePatternMatched, this);

			var salesModel = this.getGlobalModel("salesModel");
			salesModel.refresh(true);
			this.setModel(salesModel, "salesModel");

			this._onRoutePatternMatched(null);
		},

		_onRoutePatternMatched: function (oEvent) {
			this.updateUserModel();
			var dbUserModel = this.getGlobalModel("dbUserModel");
			if (dbUserModel.GUTHABEN === null){
				this.handleEmptyModel("Aktualisierung fehlgeschlagen.");
			}
			this.getTableData();
			var salesModel = this.getGlobalModel("salesModel");
			if (salesModel.BETRAG === null){
				this.handleEmptyModel("Aktualisierung fehlgeschlagen.");
			}
		},

		getTableData: function () {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var salesModel = this.getGlobalModel("salesModel");

			var params = {};
			params.mid = dbUserData.MID;

			salesModel.loadData("/MOB_UMSATZ", params);
		},

		onNavToDetail: function (oEvent) {

			var context = oEvent.getSource().getBindingContext("salesModel");
			var path = context.getPath().substr(1);
		
			this.getRouter().navTo("Detail", {
				Path: path
			});
		}

	});
});