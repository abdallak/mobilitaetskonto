sap.ui.define([
	"Mobilitaetskonto/Mobilitaetskonto/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("Mobilitaetskonto.Mobilitaetskonto.controller.SettingsCategory", {

		onInit: function () {
			this.getRouter().getRoute("SettingsCategory").attachMatched(this._onRoutePatternMatched, this);
		},

		_onRoutePatternMatched: function (oEvent) {
			this.fetchCategories();
		},

		addCategory: function () {
			// TODO network request
		},

		deleteCategory: function () {
			// TODO network request
		},

		fetchCategories: function () {
			var settings = this.prepareAjaxRequest("/MOB_KATEGORIE", "GET");
			var that = this;
			$.ajax(settings)
				.done(function (response) {
					var dbCategoryModel = new JSONModel();
					dbCategoryModel.setData(response);
					that.insertCategories(dbCategoryModel.getData());
				})
				.fail(function (jqXHR, exception) {
					that.handleNetworkError(jqXHR);
				});
		}

	});

});