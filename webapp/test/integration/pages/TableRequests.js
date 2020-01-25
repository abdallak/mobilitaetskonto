sap.ui.define([
	"sap/ui/test/Opa5"
], function (Opa5) {
	"use strict";
	var sViewName = "TableRequests";
	Opa5.createPageObjects({
		onTheRequestTablePage: {

			actions: {},

			assertions: {

				iShouldSeeTheApp: function () {
					return this.waitFor({
						id: "app",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The TableRequests view is displayed");
						},
						errorMessage: "Did not find the TableRequests view"
					});
				}
			}
		}
	});

});