/* eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Detail", {
		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("Detail").attachMatched(this._onRoutePatternMatched, this);

			var dbUserModel = this.getGlobalModel("dbUserModel");
			var detailModel = new sap.ui.model.json.JSONModel();

			this.setModel(detailModel, "detailModel");
			this.setModel(dbUserModel, "dbUserModel");
			
		},

		_onRoutePatternMatched: function (oEvent) {
			
			var path = "/" + oEvent.getParameter("arguments").Path;
			
			var detailModel = this.getModel("detailModel");
			var salesModel = this.getGlobalModel("salesModel");
			
			detailModel.setData(salesModel.getProperty(path));
			
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			
			if (jQuery.isEmptyObject(detailModel.getData())) {
				detailModel.setData(oStorage.get("salesLocalData"));
			}
			else {
				oStorage.put("salesLocalData", detailModel.getData());
			}
			if (detailModel.UID === null) {
				this.handleEmptyModel("Aktualisierung fehlgeschlagen.");
			}
		}

	});

});