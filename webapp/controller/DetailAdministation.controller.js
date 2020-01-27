sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter"
], function (JSONModel, BaseController, formatter) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.DetailAdministation", {
		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("DetailAdministation").attachMatched(this._onRoutePatternMatched, this);

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

			//USERDATEN
			this.performRequestEmployee(detail.MID);

			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			if (jQuery.isEmptyObject(detailADModel.getData())) {
				detailADModel.setData(oStorage.get("requestTableLocalData"));
			} else {
				oStorage.put("requestTableLocalData", detailADModel.getData());
			}
		},

		performRequestEmployee: function (mid) {
			var params = {};
			params.mid = mid;

			var settings = this.prepareAjaxRequest("/MOB_MITARBEITER_GET", "GET", params);

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var detailADUserModel = that.getModel("detailADUserModel");
					detailADUserModel.setData(response);
				})
				.fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
		},

		performRequestUpdate: function (state) {
			var oRequestData = this.prepareRequestData(state);

			if (!oRequestData.feedback || oRequestData.feedback.trim().length === 0) {
				this.handleEmptyModel("Feedback Feld ungültig.");
				return;
			}

			var settings = this.prepareAjaxRequest("/MOB_ANTRAG_HANDLE", "POST", JSON.stringify(oRequestData));

			var that = this;
			$.ajax(settings).done(function (response) {
				that.onNavBack();
			}).fail(function (jqXHR, exception) {
				that.handleNetworkError(jqXHR);
			});
		},

		prepareRequestData: function (state) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var detailADData = this.getModel("detailADModel").getData();

			var oRequestData = {};
			oRequestData.amount = detailADData.BETRAG;
			oRequestData.feedback = detailADData.FEEDBACK;
			oRequestData.midA = dbUserData.MID;
			oRequestData.midE = detailADData.MID;
			oRequestData.uid = detailADData.UID;
			oRequestData.state = state.toString();

			return oRequestData;
		},

		approveRequestPressed: function (oEvent) {
			// workaround für: wenn Textfeld noch ausgewählt, also cursor blinkt, dann werden Änderungen nicht im Model übernommen
			oEvent.getSource().focus();

			this.performRequestUpdate(2);
		},

		rejectRequestPressed: function (oEvent) {
			// workaround für: wenn Textfeld noch ausgewählt, also cursor blinkt, dann werden Änderungen nicht im Model übernommen
			oEvent.getSource().focus();

			this.performRequestUpdate(0);
		}
	});
});