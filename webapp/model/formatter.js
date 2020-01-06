sap.ui.define([], function () {
	"use strict";
	return {
		statusText: function (sStatus) {
			var resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			switch (sStatus) {
			case "0": // FIXME status als Int
				return resourceBundle.getText("antragStatusGenehmigt");
			default:
				return sStatus;
			}
		},

		antragArtText: function (sAntragArt) {
			var resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			switch (sAntragArt) {
			case "1": // FIXME art als Int
				return resourceBundle.getText("antragArtGutschrift");
			case "0":
				return resourceBundle.getText("antragArtAuszahlung");
			default:
				return sAntragArt;
			}
		}
	};
});