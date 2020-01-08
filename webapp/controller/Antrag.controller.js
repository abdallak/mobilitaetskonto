sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Antrag", {

		onInit: function () {
			this.getRouter().getRoute("Antrag").attachMatched(this._onRoutePatternMatched, this);
			this.resetAntrag();
		},

		_onRoutePatternMatched: function (oEvent) {
			// this.resetAntrag();
		},

		cancelButton: function (oEvent) {
			this.resetAntrag();
			this.onNavBack();
		},

		resetAntrag: function () {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var defaultAntrag = {
				"MID": dbUserData.MID,
				"art": "0",
				"betrag": null,
				"beschreibung": null
			};
			var oAntragModel = new JSONModel(defaultAntrag);
			this.setModel(oAntragModel, "oAntragModel");
		},

		antragStellen: function (oEvent) {
			// FIXME workaround für: wenn Textfeld noch ausgewählt, also cursor blinkt, dann werden Änderungen nicht im Model übernommen
			oEvent.getSource().focus();

			var oAntragModel = this.getModel("oAntragModel");
			var oAntragData = oAntragModel.getData();
			if (oAntragData.betrag === null) {
				sap.m.MessageToast.show("Bitte Betrag eingeben!");
				return;
			}
			var oAntragResponseModel = new JSONModel();
			oAntragResponseModel.loadData("/MOB_ANTRAG", oAntragData);
			var that = this;
			oAntragResponseModel.attachRequestCompleted(function (oEvent1) {
				that.getRouter().navTo("Umsatz");
				that.resetAntrag();
			});
		},

		onBetragChanged: function (oEvent) {
			var oResourceBundle = this.getResourceBundle();
			var sValue = oEvent.getParameter("value");
			var oSource = oEvent.getSource();
			if (sValue && sValue.trim().length > 0) {
				oSource.setValueState("Success");
				oSource.setValueStateText(null);
			} else {
				oSource.setValueState("Error");
				oSource.setValueStateText(oResourceBundle.getText("errorEmptyBetrag"));
			}
		}

	});
});