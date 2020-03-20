sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/BusyIndicator"
], function (BaseController, JSONModel, Filter, FilterOperator, BusyIndicator) {
	"use strict";

	/**
	 * This is a controller managing the view for the settings log. In the log you can see different kinds of
	 * database activities, such as request submitting, employee/administration status changes or category changes.
	 * @class SettingsLog
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.SettingsLog", {
		/**
		 * @typedef logModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {integer} LID - log ID
		 * @property {string} MID - administraton member ID
		 * @property {string} NAME - name of administration member
		 * @property {string} VORNAME - firstname of administration member
		 * @property {string} AKTION - database activity
		 * @property {string} DATUM - date and time of activity as sap hana date time
		 */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 */
		onInit: function () {
			var logModel = new JSONModel();
			this.setModel(logModel, "logModel");

			this.getEventBus().subscribe("showLog", "show", this.onBeforeShow, this);
		},

		/**
		 * This is a workaround to update the navigation containers everytime the view appears
		 * The main settings view sends an EventBus event to the viewId e.g. "showLog" with a "show" message.
		 * 
		 * @param{string} evt - viewId
		 */
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
		},

		/**
		 * This Function is used by the SearchBar control of the UI.
		 * Everytime one of these is used, this method gets called.
		 */
		filterTable: function () {
			var sSearchQuery = this.getView().byId("searchField0").getProperty("value");
			var filters = [];

			//SEARCHBAR FILTER
			if (sSearchQuery !== "") {
				var oSearchFilter = new Filter([
						new Filter("MID", FilterOperator.Contains, sSearchQuery),
						new Filter("DATUM", FilterOperator.Contains, sSearchQuery),
						new Filter("AKTION", FilterOperator.Contains, sSearchQuery)
					],
					false);

				filters.push(oSearchFilter);
			}

			this.bindFilters(filters);
		},

		/**
		 * TODO
		 */
		bindFilters: function (filterArr) {
			var list = this.getView().byId("table0");
			var binding = list.getBinding("items");
			binding.filter(filterArr);
		}

	});

});