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
			var detailModel = new sap.ui.model.json.JSONModel();

			this.setModel(detailModel, "detailModel");
			this.setModel(dbUserModel, "dbUserModel");
			
		},

		_onRoutePatternMatched: function (oEvent) {
			
			var path = "/" + oEvent.getParameter("arguments").Path;
			
			var detailModel = this.getModel("detailModel");
			var umsatzModel = this.getGlobalModel("umsatzModel");
			
			detailModel.setData(umsatzModel.getProperty(path));
			
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			
			if (jQuery.isEmptyObject(detailModel.getData())) {
				detailModel.setData(oStorage.get("umsatzLocalData"));
			}
			else {
				oStorage.put("umsatzLocalData", detailModel.getData());
			}
			
		},

	});

});