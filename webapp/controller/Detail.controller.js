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

			var detailModel = new sap.ui.model.json.JSONModel();
			this.setModel(detailModel, "detailModel");

			var detailUserModel = new sap.ui.model.json.JSONModel();
			this.setModel(detailUserModel, "detailUserModel");
		},

		_onRoutePatternMatched: function (oEvent) {

			//ANTRAGSDATEN
			var detail = JSON.parse(oEvent.getParameter("arguments").Detail);

			var detailModel = this.getModel("detailModel");
			detailModel.setData(detail);
			//--

			//USERDATEN
			//FIXME: workaround fuer dummiedata
			var detailUserModel = this.getModel("detailUserModel");
			detailUserModel.loadData("/MOB_MITARBEITER_GETCREATE", {
				name: detail.MID,
				lastName: "dummie-Data",
				firstName: "dummie-Data"
			});

			console.log("testUser==  " + JSON.stringify(detailUserModel.getData()));

			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);

			if (jQuery.isEmptyObject(detailModel.getData())) {
				detailModel.setData(oStorage.get("salesLocalData"));
			} else {
				oStorage.put("salesLocalData", detailModel.getData());
			}
			if (detailModel.UID === null) {
				this.handleEmptyModel("Aktualisierung fehlgeschlagen.");
			}
		}

	});

});