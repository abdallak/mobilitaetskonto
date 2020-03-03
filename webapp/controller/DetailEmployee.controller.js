sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter"
], function (JSONModel, MessageToast, BaseController, formatter) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.DetailEmployee", {
		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("DetailEmployee").attachMatched(this._onRoutePatternMatched, this);

			var detailModel = new JSONModel();
			this.setModel(detailModel, "detailModel");

			var dbUserModel = this.getGlobalModel("dbUserModel");
			this.setModel(dbUserModel, "dbUserModel");
		},

		_onRoutePatternMatched: function (oEvent) {
			//ANTRAGSDATEN
			var detail = JSON.parse(oEvent.getParameter("arguments").Detail);
			var detailModel = this.getModel("detailModel");
			detailModel.setData(detail);
			
			
 			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);

			if (jQuery.isEmptyObject(detailModel.getData())) {
				detailModel.setData(oStorage.get("salesLocalData"));
			} else {
				oStorage.put("salesLocalData", detailModel.getData());
			}
		},


		performDownloadAttachment: function (aid) {
			// TODO: vielleicht in detailModel speichern als Art Cache, damit nicht immer wieder neu geladen wird?
			var params = {};
			params.aid = aid;

			var settings = this.prepareAjaxRequest("/MOB_ANTRAG_DOWNLOAD", "GET", params);

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var oResponse = JSON.parse(response);
					var link = document.createElement("a");
					link.href = oResponse.DATA;
					link.download = oResponse.FILENAME;
					link.click();
					link = null;
				})
				.fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
		},

		onSelectChange: function (oEvent) {
			var aid = oEvent.getParameters().selectedItem.getProperty("documentId");
			this.performDownloadAttachment(aid);
			// deselect item again
			oEvent.getParameters().selectedItem.setSelected();
		}
	});

});