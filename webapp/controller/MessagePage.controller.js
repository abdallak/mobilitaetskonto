sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.MessagePage", {

		onInit: function () {
			this.getRouter().getRoute("MessagePage").attachMatched(this._onRoutePatternMatched, this);
		},

		_onRoutePatternMatched: function (oEvent) {
			var errorPageModel = this.getModel("errorPageModel");
			errorPageModel.setData(oEvent.getParameter("arguments"));
		}

	});

});