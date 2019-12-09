sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("Mobilitaetskonto.Mobilitaetskonto.controller.Umsatz", {
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Umsatz
		 */
		onInit: function () {
			
			var that = this;
			
			var url = "/MOB_UMSATZ"; //in neo-app hinterlegt , refrenced auf destinations in der cloudplatformcockpit
			
			var request = $.get({
			async: false,
			url: url,
			dataType: "json",
			success: function() {
					sap.m.MessageToast.show("success");
			},
			error: function() {
					sap.m.MessageToast.show("error");
			}
			});
			
			request.done(function(data){
				
				var UmsatzModel = new sap.ui.model.json.JSONModel(data);
				that.getView().byId("table0").setModel(UmsatzModel, "UmsatzModel");
			
			//	console.log("UmsatzModel:", UmsatzModel); //nach oben packen:/*eslint-disable no-console, no-alert*/
			});
			
			
		},
		
		onNavToStartpage: function() {			
			this.getOwnerComponent().getRouter().navTo("Startpage");
		}
		
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Umsatz
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Umsatz
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf Mobilitaetskonto.Mobilitaetskonto.view.Umsatz
		 */
		//	onExit: function() {
		//
		//	}

	});

});