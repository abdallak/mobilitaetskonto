sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Detailansicht", {
		formatter: formatter,

		onInit: function () {
			var dbUserModel = this.getGlobalModel("dbUserModel");
			var detailModel = this.getGlobalModel("detailModel");

			this.setModel(detailModel, "detailModel");
			this.setModel(dbUserModel, "dbUserModel");

			// FIXME: Workaround
			if (jQuery.isEmptyObject(detailModel.getData())) {
				this.onNavBack();
			}
		}

	});

});