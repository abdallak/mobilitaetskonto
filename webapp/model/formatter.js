sap.ui.define([], function () {
	"use strict";
	return {
		statusText: function (sStatus) {
			var resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			switch (sStatus) {
			case 0:
				return resourceBundle.getText("antragStatusGenehmigt");
			default:
				return sStatus;
			}
		},

		antragArtText: function (sAntragArt) {
			var resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			switch (sAntragArt) {
			case 0:
				return resourceBundle.getText("antragArtAuszahlung");
			case 1:
				return resourceBundle.getText("antragArtGutschrift");
			case 2:
				return resourceBundle.getText("antragArtGuthaben");
			default:
				return sAntragArt;
			}
		}
	};
});