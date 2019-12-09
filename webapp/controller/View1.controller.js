sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("Mobilitaetskonto.Mobilitaetskonto.controller.View1", {
		onInit: function () {},
		
		onNavToUmsatz: function()	{
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Umsatz");
		} ,

		onNavToAntrag: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("Antrag");
		}
	});
});