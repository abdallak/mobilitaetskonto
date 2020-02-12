sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.MessagePage", {

		onInit: function () {
			this.setModel(new JSONModel(), "errorPageModel");
			this.getRouter().getRoute("MessagePage").attachMatched(this._onRoutePatternMatched, this);
		},

		_onRoutePatternMatched: function (oEvent) {
			var errorPageModel = this.getModel("errorPageModel");
			var oErrorData = JSON.parse(oEvent.getParameter("arguments").error);
			errorPageModel.setData(oErrorData);
		}

	});

});