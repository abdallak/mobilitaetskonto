sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		setupGlobalModels: function (component) {
			// getOrCreateUser and set Model dbUserModel
			this.getOrCreateUser(component);

			this.createRole(component);
		},

		getOrCreateUser: function (component) {
			var settings = {
				"url": "/services/userapi/currentUser",
				"method": "GET",
				"timeout": 0
			};

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var oUserModel = component.getModel("userModel");
					oUserModel.setData(response);
					that.updateUserModel(component);
				})
				.fail(function (jqXHR, exception) {
					that.handleEmptyModel(jqXHR.responseText + " (" + jqXHR.status + ")");
				});
		},

		updateUserModel: function (component) {
			var oUserModel = component.getModel("userModel");

			var settings = {
				"url": "/MOB_MITARBEITER_GETCREATE",
				"method": "GET",
				"timeout": 0,
				"data": oUserModel.getData()
			};

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var dbUserModel = component.getModel("dbUserModel");
					dbUserModel.setData(response);
				})
				.fail(function (jqXHR, exception) {
					that.handleEmptyModel(jqXHR.responseText + " (" + jqXHR.status + ")");
				});
		},

		createRole: function (component) {
			var oUserModel = component.getModel("userModel");
			oUserModel.loadData();
		}

	};
});