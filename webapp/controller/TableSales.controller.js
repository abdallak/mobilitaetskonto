/*eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator"
], function (BaseController, formatter, Filter, FilterOperator, BusyIndicator) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.TableSales", {
		formatter: formatter,

		onInit: function () {
			this.getRouter().getRoute("TableSales").attachMatched(this._onRoutePatternMatched, this);
			
			var picker = this.getView().byId("rangepicker0");
			picker.setMaxDate(new Date()); //Setzt MaxDatum zum aktuellen Zeitpunkt
		},

		_onRoutePatternMatched: function (oEvent) {
			var target = oEvent.getParameter("arguments").Target;
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
			
			this.getView().byId("rangepicker0").setValue(); //Datumwahl zuruecksetzen wenn View erneut aufgerufen
			this.filterTable();
		},

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
			var oFO = FilterOperator.LT; //echt kleiner als
			if(this.salesTable === true) oFO = FilterOperator.GE; //groesser gleich
			
			var oStateFilter = new Filter("STATUS", oFO, "2"); // Wert 2 damit entsprechnder Filteroperator die gewünschten Status zeigt
			filters.push(oStateFilter);
			
			
			binding.filter(filters);
		},
		
		

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