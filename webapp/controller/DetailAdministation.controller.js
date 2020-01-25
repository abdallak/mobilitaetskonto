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
			//--
			//USERDATEN
			//FIXME: workaround fuer dummiedata
			var detailADUserModel = this.getModel("detailADUserModel");
			detailADUserModel.loadData("/MOB_MITARBEITER_GETCREATE", {
				name: detail.MID,
				lastName: "dummie-Data",
				firstName: "dummie-Data"
			});

			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			if (jQuery.isEmptyObject(detailADModel.getData())) {
				detailADModel.setData(oStorage.get("requestTableLocalData"));
			} else {
				oStorage.put("requestTableLocalData", detailADModel.getData());
			}
			if (detailADModel.UID === null) {
				this.handleEmptyModel("Aktualisierung fehlgeschlagen.");
			}
		},

		updateRequest: function (state) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var detailADData = this.getModel("detailADModel").getData();

			if (!detailADData.FEEDBACK || detailADData.FEEDBACK.trim().length === 0) {
				this.handleEmptyModel("Feedback Feld ungültig.");
				return;
			}

			var oRequestData = {};
			oRequestData.amount = detailADData.BETRAG;
			oRequestData.feedback = detailADData.FEEDBACK;
			oRequestData.midA = dbUserData.MID;
			oRequestData.midE = detailADData.MID;
			oRequestData.uid = detailADData.UID;
			oRequestData.state = state.toString();

			var settings = {
				"url": "/MOB_ANTRAG_HANDLE",
				"method": "POST",
				"timeout": 0,
				"data": JSON.stringify(oRequestData)
			};

			var that = this;
			$.ajax(settings).done(function (response) {
				that.onNavBack();
			}).fail(function (jqXHR, exception) {
				that.handleEmptyModel(jqXHR.responseText + " (" + jqXHR.status + ")");
			});
		},

		approveRequestPressed: function (oEvent) {
			this.updateRequest(2);
		},

		rejectRequestPressed: function (oEvent) {
			this.updateRequest(0);
		}
	});
});