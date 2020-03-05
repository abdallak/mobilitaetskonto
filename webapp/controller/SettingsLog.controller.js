sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator"
], function (BaseController, JSONModel, BusyIndicator) {
	"use strict";

	/**
	 * This is a controller managing the view for the settings log. In the log you can see different kinds of
	 * database activities, such as request submitting, employee/administration status changes or category changes.
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

			this.getEventBus().subscribe("showLog", "show", this.onBeforeShow, this);
		},

		onBeforeShow: function (evt) {
			this.getLogData();
		},

		/**
		 * Function called, when the Refresh button in the view is pressed. It calls the getLogData function to 
		 * fetch new data from the Log table in the database.
		 */
		onRefreshPressed: function () {
			BusyIndicator.show();
			this.getLogData();
		},

		/**
		 * This function manages the logModel update via ajax request. 
		 */
		getLogData: function () {
			var settings = this.prepareAjaxRequest("/MOB_LOG_GET", "GET");

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var logModel = that.getModel("logModel");
					BusyIndicator.hide();
					logModel.setData(response);
				})
				.fail(function (jqXHR, exception) {
					BusyIndicator.hide();
					that.handleNetworkError(jqXHR);
				});
		}

	});

});