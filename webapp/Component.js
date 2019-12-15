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

			// getOrCreateUser and set Models: userModel + dbUserModel
			this.getOrCreateUser();

		},
		getOrCreateUser: function () {
			this.oUserModel = new sap.ui.model.json.JSONModel(this.sUserPath);
			this.oDbUserModel = new sap.ui.model.json.JSONModel();

			var that = this;
			this.oUserModel.attachRequestCompleted(function (oEvent) {
				// wird die Zeile wirklich gebraucht?
				// that.oUserModel.setData(this.oUserModel.getData());
				that.oDbUserModel.loadData("/MOB_MITARBEITER_GETCREATE", this.oUserModel);
			});

			// this.oDbUserModel.attachRequestCompleted(function (data1) {
			// 	this.oDbUserModel.setData(this.oDbUserModel.getData());
			// });

			sap.ui.getCore().setModel(this.oDbUserModel, "dbUserModel");
			sap.ui.getCore().setModel(this.oUserModel, "userModel");
		}
	});
});