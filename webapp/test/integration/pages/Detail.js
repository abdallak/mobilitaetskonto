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
				},
				
				iShouldSeeTheFormElement: function (sId) {
					return this.waitFor({
						id: sId,
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The form container " + sId + " is displayed");
						},
						errorMessage: "Did not the form container" + sId
					});
				}
				
			}
		}
	});

});