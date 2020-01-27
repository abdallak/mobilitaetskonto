sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, Filter, FilterOperator, JSONModel) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.TableRequests", {
		formatter: formatter,

		onInit: function () {
			var requestTableModel = new JSONModel();
			requestTableModel.setSizeLimit(500); //evt kleiner machen?
			this.setModel(requestTableModel, "requestTableModel");

			this.filterStatus(1); //Vorfiltern nach Status = ausstehend

			this.getRouter().getRoute("TableRequests").attachMatched(this._onRoutePatternMatched, this);
		},

		_onRoutePatternMatched: function (oEvent) {
			this.getTableData();
		},

		getTableData: function () {
			var settings = this.prepareAjaxRequest("/MOB_ANTRAG_TABELLE", "GET");

			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var requestTableModel = that.getModel("requestTableModel");
					requestTableModel.setData(response);
				})
				.fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
		},

		onNavToDetail: function (oEvent) {
			var context = oEvent.getSource().getBindingContext("requestTableModel");
			var path = context.getPath();
			var detail = JSON.stringify(context.getProperty(path));

			this.getRouter().navTo("DetailAdministation", {
				Detail: detail
			});
		},

		selectionChanged: function (oEvent) {
			var actionSelectValue = oEvent.getSource().getSelectedItem().getKey();
			this.filterStatus(actionSelectValue);
		},

		filterStatus: function (statusnummer) {
			var table = this.getView().byId("requestTableId");
			var binding = table.getBinding("items");

			//problematisch
			var filters = [];
			var FO = FilterOperator.EQ;
			
			if (statusnummer === 4) {
				FO = FilterOperator.LE;
			}

			filters.push(new Filter("STATUS", FO, statusnummer));
			binding.filter(filters);
		},

		handleSearch: function (oEvent) {
			var query = oEvent.getParameter("query");
			var filters = [];

			if (query && query.length > 0) {
				var filter = new Filter([
					new Filter("NAME", FilterOperator.Contains, query),
					new Filter("VORNAME", FilterOperator.Contains, query),
					//new Filter("ART", FilterOperator.Contains, query),
					new Filter("DATUM", FilterOperator.Contains, query),
					new Filter("BETRAG", FilterOperator.EQ, parseFloat(query)), //evt. noch Checken ob Number vorm parsen??
					new Filter("KATEGORIE", FilterOperator.Contains, query)
				], false);
				filters.push(filter);
			}

			// update list binding
			var list = this.getView().byId("requestTableId");
			var binding = list.getBinding("items");
			binding.filter(filters);
		}
	});
});