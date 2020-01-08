/* eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Detailansicht", {
		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("Detailansicht").attachMatched(this._onRoutePatternMatched, this);

			var dbUserModel = this.getGlobalModel("dbUserModel");
			var detailModel = this.getGlobalModel("detailModel");

			this.setModel(detailModel, "detailModel");
			this.setModel(dbUserModel, "dbUserModel");

			// FIXME: Workaround
			if (jQuery.isEmptyObject(detailModel.getData())) {
				this.onNavBack();
			}
		},

		_onRoutePatternMatched: function (oEvent) {
			console.log(oEvent.getParameter("arguments").UID);
		},

	});

});