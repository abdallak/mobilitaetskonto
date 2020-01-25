/* eslint-disable no-console, no-alert */
sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"Mobilitaetskonto/Mobilitaetskonto/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, formatter, Filter, FilterOperator) {
	"use strict";
	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.RequestTable", {
		formatter: formatter,

		onInit: function () {
			var requestTableModel = new sap.ui.model.json.JSONModel();
			requestTableModel.loadData("/MOB_ANTRAG_TABELLE");
			this.setModel(requestTableModel, "requestTableModel");
			console.log(requestTableModel);

			requestTableModel.setSizeLimit(500); // evt kleiner machen?

			this.filterStatus(1); //Vorfiltern nach Status = ausstehend
		},

		updateFinished: function (oEvent) {
			//	var test = oEvent.getParameter("total");
		},

		onNavToDetail: function (oEvent) {
			var context = oEvent.getSource().getBindingContext("requestTableModel");
			var path = context.getPath();
			var detail = JSON.stringify(context.getProperty(path));

			this.getRouter().navTo("DetailAD", {
				Detail: detail
			});
		},

		selectionChanged: function (oEvent) {
			var actionSelectValue = oEvent.getSource().getSelectedItem().getKey();
			this.filterStatus(actionSelectValue);
		},

		filterStatus: function (param) {
			var statusnummer = parseFloat(param);
			var table = this.getView().byId("table0");
			var binding = table.getBinding("items");

			//problematisch
			var filters = [];
			var FO = FilterOperator.EQ;

			//FIXME: bessere lösung finden? 
			if (statusnummer === 0.1 || statusnummer === 4) {
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
			var list = this.getView().byId("table0");
			var binding = list.getBinding("items");
			binding.filter(filters);
		}
	});
});