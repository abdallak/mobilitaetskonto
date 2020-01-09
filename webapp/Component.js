sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"Mobilitaetskonto/Mobilitaetskonto/model/models"
], function (UIComponent, Device, JSONModel, models) {
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

			// set umsatzModel
			this.createUmsatz();

			this.createRole();
		},

		getOrCreateUser: function () {
			this.oUserModel = new JSONModel(this.sUserPath);
			this.oDbUserModel = new JSONModel();

			var that = this;
			this.oUserModel.attachRequestCompleted(function (oEvent) {
				that.oDbUserModel.loadData("/MOB_MITARBEITER_GETCREATE", that.oUserModel.getData());
			});

			// make available in other controllers
			sap.ui.getCore().setModel(this.oDbUserModel, "dbUserModel");
			sap.ui.getCore().setModel(this.oUserModel, "userModel");
		},

		createUmsatz: function () {
			this.oDetailModel = new JSONModel();
			sap.ui.getCore().setModel(this.oDetailModel, "umsatzModel");
		},

		createRole: function () {
			//configure roles here
			var roles = {
				verwalter: false,
				mitarbeiter: true
			};
			this.oRoleModel = new JSONModel(roles);

			//make available for other controllers
			sap.ui.getCore().setModel(this.oRoleModel, "roleModel");
		}
	});
});