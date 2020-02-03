/*eslint-disable no-console, no-alert */
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
			this.setModel(requestTableModel, "requestTableModel");
			this.filterStatus("1"); //Vorfiltern nach Status = ausstehend
			
			var picker = this.getView().byId("rangepicker0");
			picker.setMaxDate(new Date()); //Setzt MaxDatum zum aktuellen Zeitpunkt
			
			
			
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

			this.getRouter().navTo("DetailAdministration", {
				Detail: detail
			});
		},

		
		filterStatus: function (statusnummer) {
		
			var FO = FilterOperator.EQ; 
			if (statusnummer === "4"){ FO = FilterOperator.LE;}

			
			var filters = [];
			filters.push(new Filter("STATUS", FO, statusnummer));
			
			this.bindFilters(filters);
		},

		
		onMarkAsTransacted: function (oEvent){
			var oTab = this.byId("requestTableId");
			var aSelected = [];
			
			oTab.getItems().forEach(function(item){ // loop over all the items in the table
            	var oCheckBoxCell = item.getCells()[6]; //fetch the cell which holds the checkbox for that row.
            	if (oCheckBoxCell.getSelected()){
            		var iUID = oCheckBoxCell.getBindingContext("requestTableModel").getProperty("UID");
            		aSelected.push(iUID);
            	}
        	});
        	if (aSelected.length === 0) {
        		return;
        	}
			
			var oSelected = {selection: aSelected};
			
			sap.m.MessageBox.show(this.getView().getModel("i18n").getResourceBundle().getText("markAsTransactedMessageBox"), {
        		actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
        		onClose: function (oAction) {
        			if (oAction === "YES"){
        				var settings = this.prepareAjaxRequest("/MOB_ANTRAG_DURCHGEFUEHRT", "POST", JSON.stringify(oSelected));
        				
						var that = this;
						$.ajax(settings)
							.done(function (response) {
								that._onRoutePatternMatched(null);
							})
							.fail(function (jqXHR, exception) {
								that.handleNetworkError(jqXHR);
							});
				
        			} else {
        				this.resetSelection();
        			}	
        		}.bind(this)
        	});
    	},
    	
		resetSelection: function(){
			var oTab = this.byId("requestTableId");
			
			oTab.getItems().forEach(function(item){ // loop over all the items in the table
            	var oCheckBoxCell = item.getCells()[6]; //fetch the cell which holds the checkbox for that row.
            	oCheckBoxCell.setSelected(false);
            	});
		},
		
		filterTable: function(){
		
			var dateRangePicker = this.getView().byId("rangepicker0");
			var minDate = dateRangePicker.getDateValue();
			var maxDate = dateRangePicker.getSecondDateValue();
			var sSearchQuery = this.getView().byId("searchField0").getProperty("value");
			var sStateKey = this.getView().byId("select0").getProperty("selectedKey");
			
			var filters = [];
			var singleFilters = [];
			var oFoState = FilterOperator.EQ;
			
			
			//STATUS FILTER
			if (sStateKey === "4"){
				oFoState = FilterOperator.LE; //alle Status(plural)
			} 
			var oStateFilter = new Filter("STATUS", oFoState, sStateKey);
			singleFilters.push(oStateFilter);
			
			
			//SEARCHBAR FILTER
			if(sSearchQuery !== ""){
				
				var oSearchFilter = new Filter([
					new Filter("NAME", FilterOperator.Contains, sSearchQuery),
					new Filter("VORNAME", FilterOperator.Contains, sSearchQuery),
					new Filter("BETRAG", FilterOperator.EQ, parseFloat(sSearchQuery))],
					false);
						 
				singleFilters.push(oSearchFilter);			 
			}
			
			//DATE FILTER
			if(minDate !== null && maxDate !== null){
				var oDateFilter = new Filter("DATUM", FilterOperator.BT, minDate.toISOString(), maxDate.toISOString());
				singleFilters.push(oDateFilter);
			}
			
			
			var oFinalFilter = new Filter(singleFilters, true);
			filters.push(oFinalFilter);
			
			this.bindFilters(filters);	
		},
		
		bindFilters : function(filterArr){
			var list = this.getView().byId("requestTableId");
			var binding = list.getBinding("items");
			binding.filter(filterArr);
		}
	});
});