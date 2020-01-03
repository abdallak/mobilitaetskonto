sap.ui.define([], function () {
	"use strict";
	return {
		statusText: function (sStatus) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();

			switch (sStatus) {
			case "genehmigt":
				return resourceBundle.getText("antragStatusGenehmigt");
			default:
				return sStatus;
			}
		},

		antragArtText: function (sAntragArt) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();

			switch (sAntragArt) {
			case "gutschrift":
				return resourceBundle.getText("antragArtGutschrift");
			case "auszahlung":
				return resourceBundle.getText("antragArtAuszahlung");
			default:
				return sAntragArt;
			}
		}
	};
});