sap.ui.define([], function () {
	"use strict";
	return {

		statusText: function (iStatus) {
			var resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			switch (iStatus) {
			case 0:
				return resourceBundle.getText("antragStatusAbgelehnt");
			case 1:
				return resourceBundle.getText("antragStatusAusstehend");
			case 2:
				return resourceBundle.getText("antragStatusGenehmigt");
			case 3:
				return resourceBundle.getText("antragStatusDurchgefuehrt");
			default:
				return iStatus;
			}
		},

		statusIndicator: function (iStatus) {
			switch (iStatus) {
			case 0:
				// color: dark red
				return "Indication01";
			case 1:
				// color: orange
				return "Indication03";
			case 2:
				// color: green
				return "Indication04";
			case 3:
				// color: blue
				return "Indication05";
			default:
				// color: grey?
				return "None";
			}
		},

		antragArtText: function (iAntragArt) {
			var resourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			switch (iAntragArt) {
			case 0:
				return resourceBundle.getText("antragArtAuszahlung");
			case 1:
				return resourceBundle.getText("antragArtGutschrift");
			case 2:
				return resourceBundle.getText("antragArtGuthaben");
			default:
				return iAntragArt;
			}
		}

	};
});