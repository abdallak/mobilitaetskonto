sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/Filter",
	"sap/m/MessageToast",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";

	/**
	 * The TableSales View is a table showing the employees transactions.
	 * The View is used twice, beeing accessible from two different entry points.
	 * A route paramter (target) is used to distinguish between the two display options.
	 * The actual usage doesn't vary at all. The first option, connected to the "TableSales" paramter, accessed through the 'Kontostand' tile
	 * displays transactions where the state is 'approved(genehmigt)' or 'carried out(durchgeführt)'.
	 * The second option, accessed through the 'Anträge' tile, displays transactions with state beeing 'declined(abgelehnt)' or 'pending(ausstehend)'.
	 * @class TableSales
	 */
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.TableSales", {
		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("TableSales").attachMatched(this._onRoutePatternMatched, this);
			
			var picker = this.getView().byId("rangepicker0");
			picker.setMaxDate(new Date()); //set MaxDate of daterangepicker to todays date
		},

		_onRoutePatternMatched: function (oEvent) {
			var target = oEvent.getParameter("arguments").Target; //tablename parameter to decide the content of the table 
			this.updateUserModel();
			this.getTableData();
			
			
			// set title
			var oResourceBundle = this.getResourceBundle();
			var oTitleLabel = this.byId("titleLabel");
			var sTitle;
			if (target === "TableSales") {
				sTitle = oResourceBundle.getText("salesTitle");
				this.salesTable = true;
			} else {
				sTitle = oResourceBundle.getText("startpageEmployeeRequestTableTileSub");
				this.salesTable = false;
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
			
			var settings = this.prepareAjaxRequest("/MOB_UMSATZ", "GET", params);

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
		
		filterTable: function(){
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
			var oFO = FilterOperator.LT; //LT = lesser than
			if(this.salesTable === true) oFO = FilterOperator.GE; //GE = greater or equal
			
			// transactionstates are stored as integers inside the database going from 0 to 3
			// the 2 is used here so that the choosen filteroperator displays the right data
			var oStateFilter = new Filter("STATUS", oFO, "2"); 
			filters.push(oStateFilter);
			
			
			binding.filter(filters);
		},
		
		
		/**
		* This function is used for navigation and parameter passing between the actual view and the employee's detail view.
		* The function will be triggered after selecting a single transaction inside the table.
		* The data related to the selected transactions is passed as stringified JSON Object through the router.
		*/
		onNavToDetail: function (oEvent) {
			var context = oEvent.getSource().getBindingContext("salesModel");
			var path = context.getPath();

			var detail = JSON.stringify(context.getProperty(path));

			this.getRouter().navTo("DetailEmployee", {
				Detail: detail
			});
		}
	});
});