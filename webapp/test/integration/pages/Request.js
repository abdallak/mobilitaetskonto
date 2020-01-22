sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";
	var sViewName = "Request";
	Opa5.createPageObjects({
		onTheRequestPage: {

			actions: {},

			assertions: {

				iShouldSeeTheApp: function () {
					return this.waitFor({
						id: "app",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The Request view is displayed");
						},
						errorMessage: "Did not find the Request view"
					});
				}
			}
		}
	});
});