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
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.RequestTable
		 */
		onInit: function () {
				var requestTableModel = new sap.ui.model.json.JSONModel();
				requestTableModel.loadData("/MOB_ANTRAG_TABELLE");
				this.setModel(requestTableModel, "requestTableModel");
				
				requestTableModel.setSizeLimit(500); // evt kleiner machen?
				
				this.filterStatus(1); //Vorfiltern nach Status = ausstehend
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.RequestTable
			 */
			//	onBeforeRendering: function() {
			//
			//	},
			/**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
			 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.RequestTable
			 */
			//	onAfterRendering: function() {
			//
			//	},
			/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.RequestTable
			 */
			//	onExit: function() {
			//
			//	}
			,
		/**
		 *@memberOf Mobilitaetskonto.Mobilitaetskonto.controller.RequestTable
		 */
		updateFinished: function (oEvent) {
			//	var test = oEvent.getParameter("total");
		},
		
		
		onNavToDetail: function (oEvent) {
			var context = oEvent.getSource().getBindingContext("requestTableModel");
			var path = context.getPath();
			var detail = JSON.stringify(context.getProperty(path));
			this.getRouter().navTo("Detail", {
				Detail: detail
			});
		},
		
		
		/**
		 *@memberOf Mobilitaetskonto.Mobilitaetskonto.controller.RequestTable
		 */
		selectionChanged: function (oEvent) {

			var actionSelectValue = oEvent.getSource().getSelectedItem().getText();
			var filterValue;
			var filterOperator = FilterOperator.EQ;
			
			switch(actionSelectValue){
				case "Abgelehnt":
				//	filterValue = 0; //scheint nicht zu gehen als filterwert??
					filterValue = 0.1; //dirty workaround
					break;
				case "Ausstehend":
					filterValue = 1;
					break;
				case "Genehmigt":
					filterValue = 2;
					break;
				case "Durchgeführt":
					filterValue = 3;
					break;
				default:
					filterValue = 5; //was gutes überlegen..
					break;
			}
			
			this.filterStatus(filterValue);
			
		},
		
		filterStatus: function(statusnummer) {
			   
			var table = this.getView().byId("table0");
			var binding = table.getBinding("items"); //problematisch
			var filters = [];

			var FO = FilterOperator.EQ;
			
			//FIXME: bessere lösung finden? 
			if (statusnummer === 0.1){
				FO = FilterOperator.LE;
			}
			
			filters.push(new Filter("STATUS", FO , statusnummer));
			
			binding.filter(filters);
			
			console.log(binding);
		}
	});
});