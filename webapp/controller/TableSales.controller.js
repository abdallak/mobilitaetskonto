/*eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (BaseController, formatter, Filter, FilterOperator) {
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
			this.getTableData(target);

			// set title
			var oResourceBundle = this.getResourceBundle();
			var oTitleLabel = this.byId("titleLabel");
			var sTitle;
			if (target === "TableSales") {
				sTitle = oResourceBundle.getText("salesTitle");
			} else {
				sTitle = oResourceBundle.getText("startpageEmployeeRequestTableTileSub");
			}
			oTitleLabel.setText(sTitle);
		},

		getTableData: function (target) {
			var dbUserData = this.getGlobalModel("dbUserModel").getData();
			var params = {};
			params.mid = dbUserData.MID;
			if (target === "TableSales") {
				params.status1 = 2;
				params.status2 = 3;
			} else {
				params.status1 = 0;
				params.status2 = 1;
			}

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
			
			//Filterparameter
			var dateRangePicker = this.getView().byId("rangepicker0");
			var minDate = dateRangePicker.getDateValue();
			var maxDate = dateRangePicker.getSecondDateValue();
			
			var filters = [];
			
			if (minDate !== null && maxDate !== null) {
				var oDateFilter = new Filter("DATUM", FilterOperator.BT, minDate.toISOString(), maxDate.toISOString());
				filters.push(oDateFilter);
			}
			
			
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