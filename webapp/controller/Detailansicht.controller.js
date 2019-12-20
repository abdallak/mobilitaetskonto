sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Detailansicht", {

		onInit: function () {
			var dbUserModel = this.getGlobalModel("dbUserModel");
			var detailModel = this.getGlobalModel("detailModel");

			this.setModel(detailModel, "detailModel");
			this.setModel(dbUserModel, "dbUserModel");
		}

	});

});