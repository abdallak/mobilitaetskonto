sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";
	var sViewName = "Detail";
	Opa5.createPageObjects({
		onTheDetailPage: {

			actions: {},

			assertions: {

				iShouldSeeTheApp: function () {
					return this.waitFor({
						id: "app",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The Detail view is displayed");
						},
						errorMessage: "Did not find the Detail view"
					});
				}
			}
		}
	});

});