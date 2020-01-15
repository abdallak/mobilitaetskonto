sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"Mobilitaetskonto/Mobilitaetskonto/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("Mobilitaetskonto.Mobilitaetskonto.Component", {
		sUserPath: "/services/userapi/currentUser",

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// getOrCreateUser and set Model dbUserModel
			models.getOrCreateUser();

			// set salesModel
			this.setModel(models.createSales(), "salesModel");

			this.setModel(models.createRole(), "roleModel");
		}
	});
});