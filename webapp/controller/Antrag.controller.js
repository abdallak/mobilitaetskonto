sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	return Controller.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Antrag", {

		onInit: function () {},

		antragStellen: function (oEvent) {
			//This code was generated by the layout editor.
			
			var art = this.getView().byId("art").getSelectedKey();
			var betrag = this.getView().byId("betrag").getValue();
			var beschreibung = this.getView().byId("beschreibung").getValue();
			
			if (betrag === "") {
				sap.m.MessageToast.show("Bitte Betrag eingeben!");
				return;
			}
			
			var that = this;
			
			var url = "/MOB_ANTRAG?art=" + art + "&betrag=" + betrag + "&beschreibung=" + beschreibung;  //in neo-app hinterlegt , refrenced auf destinations in der cloudplatformcockpit
			
			var request = $.get({
			async: false,
			url: url,
			dataType: "json",
			success: function() {
				sap.m.MessageToast.show("success");
			},
			error: function() {
				sap.m.MessageBox.alert("error");
			}
			});
			
			request.done(function(data){
				// sap.m.MessageToast.show("Art: " + art + "\nBetrag: " + betrag + "\nBeschreibung: " + beschreibung);
				that.getOwnerComponent().getRouter().navTo("Umsatz");
			});
			
		},
		
		onNavToStartpage: function() {
			this.getOwnerComponent().getRouter().navTo("View1");
		}
	
	});
});