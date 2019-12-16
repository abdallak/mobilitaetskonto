/* eslint-disable no-console, no-alert */
sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Umsatz", {
		

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Umsatz
		 */
		onInit: function () {
			sap.ui.core.UIComponent.getRouterFor(this).getRoute("Umsatz").attachMatched(this._onRoutePatternMatched, this);
			
			// TODO aktualisieren von daten
			this.dbUserModel = sap.ui.getCore().getModel("dbUserModel").getData();
			this.getView().byId("nameLabel").setText(this.dbUserModel.VORNAME + " " + this.dbUserModel.NAME);
			this.getView().byId("guthabenLabel").setText(this.dbUserModel.GUTHABEN + " EUR");
			
			this.getTableData();
			this.mid = this.dbUserModel.MID;
		},
		
		_onRoutePatternMatched: function(oEvent) {
			var umsatzModel = sap.ui.getCore().getModel("umsatzModel");
			
			var params = {}; //TODO kuerzen
			params.mid = this.dbUserModel.MID;
			var paramsString = jQuery.param(params);
			
			umsatzModel.loadData("/MOB_UMSATZ", paramsString);
		},
		
		onNavToStartpage: function () {
			this.getOwnerComponent().getRouter().navTo("Startpage");
		},
		
		onNavToDetailansicht: function () {
			this.getOwnerComponent().getRouter().navTo("Detailansicht");
		},
		
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Umsatz
		 */
		//onBeforeRendering: function () {},
		
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Umsatz
		 */
		//	onAfterRendering: function() {
		//	},
		/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Umsatz
			//	onExit: function() {
			//
			//	}
			, */
		
		
		getTableData : function() {
			var table = this.getView().byId("table0");
		
			var params = {};
			params.mid = this.dbUserModel.MID;
			
			var paramsString = jQuery.param(params);
			
			var url = "/MOB_UMSATZ";
			
			var umsatzModel = sap.ui.getCore().getModel("umsatzModel");
			umsatzModel.loadData(url, paramsString);
			
			table.setModel(umsatzModel, "umsatzModel");
			console.log("UmsatzModel:", umsatzModel); //nach oben packen:eslint-disable no-console, no-alert
		},
		
		
		detailFunc: function (oEvent) {
    		
    		var context = oEvent.getSource().getBindingContext("umsatzModel");
			var path = context.getPath();
			
			var umsatzModel = sap.ui.getCore().getModel("umsatzModel");
    		var detailModel = sap.ui.getCore().getModel("detailModel");
    		detailModel.setData(umsatzModel.getProperty(path));
    		
			this.onNavToDetailansicht();
		}
		
	});
});