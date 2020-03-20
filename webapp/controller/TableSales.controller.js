sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, BusyIndicator, FilterOperator) {
	"use strict";

	/**
	 * The TableSales View is a table showing the employees transactions.
	 * The View is used twice, beeing accessible from two different entry points.
	 * A route paramter (target) is used to distinguish between the two display options.
	 * The actual usage doesn't vary at all. The first option, connected to the "TableSales" paramter, accessed through the 'Kontostand' tile
	 * displays transactions where the state is 'approved(genehmigt)' or 'carried out(durchgeführt)'.
	 * The second option, accessed through the 'Anträge' tile, displays transactions with state beeing 'declined(abgelehnt)' or 'pending(ausstehend)'.
	 * 
	 * @class TableSales
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.TableSales", {
		formatter: formatter,

		/**
		 * A global JSON model which contains the current users details.
		 * 
		 * @typedef dbUserModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {string} VORNAME - Employee firstname
		 * @property {string} NAME - Employee lastname
		 * @property {string} MID - Employee id
		 */

		/**
		 * A local JSON model which contains all request details.
		 * 
		 * @typedef oRequestModel
		 * @type {sap.ui.model.json.JSONModel}
		 * @property {date} date - datum
		 * @property {(string|integer)} art - art
		 * @property {number} betrag - betrag
		 * @property {integer} kid - kid
		 * @property {integer} state - status
		 */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 */
		onInit: function () {
			this.getRouter().getRoute("TableSales").attachMatched(this._onRoutePatternMatched, this);

			var picker = this.getView().byId("rangepicker0");
			picker.setMaxDate(new Date()); //set MaxDate of daterangepicker to todays date
		},

		/**
		 * This function is called everytime the router comes across the view.
		 * Depended upon the the target view, controls are hidden or displayed.
		 * The function also chooses the right title for the displayed view.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		_onRoutePatternMatched: function (oEvent) {
			var target = oEvent.getParameter("arguments").Target; //tablename parameter to decide the content of the table 
			this.updateUserModel();
			this.getTableData();

			// set title
			var oResourceBundle = this.getResourceBundle();
			var oTitleLabel = this.byId("titleLabel");
			var sTitle;
			var balanceLabel = this.getView().byId("balanceDisplay");
			var statusLabel = this.getView().byId("stateLabel");
			var statusActionSelect = this.getView().byId("select0");

			if (target === "TableSales") {
				sTitle = oResourceBundle.getText("salesTitle");
				this.salesTable = true;
				balanceLabel.setVisible(true);
				statusActionSelect.setVisible(false);
				statusLabel.setVisible(false);
			} else {
				sTitle = oResourceBundle.getText("startpageEmployeeRequestTableTileSub");
				this.salesTable = false;
				balanceLabel.setVisible(false);
				statusActionSelect.setVisible(true);
				statusLabel.setVisible(true);
			}
			oTitleLabel.setText(sTitle);

			this.getView().byId("rangepicker0").setValue(); //clears date selection when reentering the view
			this.filterTable();
		},

		/** 
		 * Recieves ALL transactions related to the employees id.
		 * Filtering is still required after retrieving the data.
		 */
		getTableData: function () {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var params = {};
			params.mid = dbUserData.MID;

			var settings = this.prepareAjaxRequest("/MOB_TRANSACTION_EMPLOYEE", "GET", params);

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var salesModel = that.getGlobalModel("salesModel");
					salesModel.setData(response);
				})
				.fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
		},

		/**
		 * This Function is used by the two filter controls of the UI. The DateRangePicker and the ActionSelect.
		 * Everytime one of these is used, this method gets called.
		 * The method provides a final filter consisting of couple others, related to the input given by the controls.
		 * The ActionSelect is only shown inside the 'Anträge' View.
		 */
		filterTable: function () {
			//BindingContext
			var list = this.getView().byId("table0");
			var binding = list.getBinding("items");
			var filters = [];

			//Filterparameter
			var dateRangePicker = this.getView().byId("rangepicker0");
			var minDate = dateRangePicker.getDateValue();
			var maxDate = dateRangePicker.getSecondDateValue();

			//DATE FILTER
			if (minDate !== null && maxDate !== null) {
				var oDateFilter = new Filter("DATUM", FilterOperator.BT, minDate.toISOString(), maxDate.toISOString());
				filters.push(oDateFilter);
			}

			//STATE FILTER
			//This part filters the given transactions of the employee by their state.
			//This is mandatory to show the right data, based on the "selected" view.

			//Statusparameter
			var sStateKey = this.getView().byId("select0").getProperty("selectedKey");

			var oFilterOperator;
			if (this.salesTable === true) {
				oFilterOperator = FilterOperator.GE; //GE = greater or equal

				// transactionstates are stored as integers inside the database going from 0 to 3
				// the 2 is used here so that the choosen filteroperator displays the right data
				sStateKey = "2";
			} else {
				if (sStateKey === "4") {
					oFilterOperator = FilterOperator.LE; // LE = Lesser or equal
				} else {
					oFilterOperator = FilterOperator.EQ; //EQ = equals
				}
			}

			var oStateFilter = new Filter("STATUS", oFilterOperator, sStateKey);
			filters.push(oStateFilter);

			binding.filter(filters);
		},

		/**
		 * This function is used for navigation and parameter passing between the actual view and the employee's detail view.
		 * The function will be triggered after selecting a single transaction inside the table.
		 * The data related to the selected transactions is passed as stringified JSON Object through the router.
		 * 
		 * @param{sap.ui.base.Event} oEvent - oEvent
		 */
		onNavToDetail: function (oEvent) {
			var context = oEvent.getSource().getBindingContext("salesModel");
			var path = context.getPath();
			var detail = JSON.stringify(context.getProperty(path));

			var encodedVal = encodeURIComponent(detail);

			this.getRouter().navTo("DetailEmployee", {
				Detail: encodedVal
			});
		}
	});
});