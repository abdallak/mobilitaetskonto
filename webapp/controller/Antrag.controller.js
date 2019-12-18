sap.ui.define(["Mobilitaetskonto/Mobilitaetskonto/controller/BaseController"], function (BaseController) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Antrag", {
		onInit: function () {
			this.getRouter().getRoute("Antrag").attachMatched(this._onRoutePatternMatched, this);
			this.resetAntrag();
		},
		_onRoutePatternMatched: function (oEvent) {
			this.resetAntrag();
		},
		resetAntrag: function () {
			var dbUserModel = this.getGlobalModel("dbUserModel").getData();
			var defaultAntrag = {};
			defaultAntrag.MID = dbUserModel.MID;
			defaultAntrag.art = "auszahlung";
			defaultAntrag.betrag = null;
			defaultAntrag.beschreibung = null;
			var oAntragModel = new sap.ui.model.json.JSONModel(defaultAntrag);
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
			var oAntragResponseModel = new sap.ui.model.json.JSONModel();
			oAntragResponseModel.loadData("/MOB_ANTRAG", oAntragData);
			var that = this;
			oAntragResponseModel.attachRequestCompleted(function (oEvent1) {
				that.getRouter().navTo("Umsatz");
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
		},
		onBeschreibungChanged: function (oEvent) {
		}
	});
});