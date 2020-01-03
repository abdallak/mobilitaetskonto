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
		}
	};
});