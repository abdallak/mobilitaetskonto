sap.ui.define([], function () {
	"use strict";
	return {
		/**
		 * This as a formatter to provide funtions that match our database content(integers) with their
		 * exact meaning.
		 * @class formatter
		 */

		/**
		 * This function matches integers between 0 and 3 with a request status.
		 * @param {integer} iStatus - status as integer
		 * @returns {string} - matched status as string 
		 * @returns {integer} iStatus - for invalid iStatus
		 */
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

		/**
		 * This function matches integers between 0 and 3 with an indication value.
		 * @param {integer} iStatus - indication value as integer
		 * @returns {string} - matched indication value as string 
		 * @returns {string} "None" - for invalid iStatus
		 */
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

		/**
		 * This function matches integers between 0 and 2 with a request type.
		 * @param {integer} iAntragArt - request type as integer
		 * @returns {string} - matched request type as string 
		 * @returns {integer} iAntragArt - for invalid iAntragArt
		 */
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