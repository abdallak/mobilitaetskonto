/* eslint-disable no-console, no-alert */
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter"
], function (JSONModel, BaseController, formatter) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.DetailAD", {
		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("DetailAD").attachMatched(this._onRoutePatternMatched, this);

			var detailADModel = new JSONModel();
			this.setModel(detailADModel, "detailADModel");

			var detailADUserModel = new JSONModel();
			this.setModel(detailADUserModel, "detailADUserModel");
		},

		_onRoutePatternMatched: function (oEvent) {

			//ANTRAGSDATEN
			var detail = JSON.parse(oEvent.getParameter("arguments").Detail);

			var detailADModel = this.getModel("detailADModel");
			detailADModel.setData(detail);
			//--

			//USERDATEN
			//FIXME: workaround fuer dummiedata
			var detailADUserModel = this.getModel("detailADUserModel");
			detailADUserModel.loadData("/MOB_MITARBEITER_GETCREATE", {
				name: detail.MID,
				lastName: "dummie-Data",
				firstName: "dummie-Data"
			});

			console.log("testUser==  " + JSON.stringify(detailADUserModel.getData()));

			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);

			if (jQuery.isEmptyObject(detailADModel.getData())) {
				detailADModel.setData(oStorage.get("requestTableLocalData"));
			} else {
				oStorage.put("requestTableLocalData", detailADModel.getData());
			}
			if (detailADModel.UID === null) {
				this.handleEmptyModel("Aktualisierung fehlgeschlagen.");
			}
		}

	});

});