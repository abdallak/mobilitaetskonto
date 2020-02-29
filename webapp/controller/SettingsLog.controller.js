sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	/**
	 * 
	 * @class SettingsLog
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.SettingsLog", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 */
		onInit: function () {
			var logModel = new JSONModel();
			this.setModel(logModel, "logModel");
			this.getLogData();
		},

		/**
		 */
		onRefreshPressed: function () {
			this.getLogData();
		},

		/**
		 */
		getLogData: function () {
			var settings = this.prepareAjaxRequest("/MOB_LOG_GET", "GET");

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var logModel = that.getModel("logModel");
					logModel.setData(response);
				})
				.fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
		}

	});

});