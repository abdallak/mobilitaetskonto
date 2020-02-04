sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press"
], function (Opa5, Press) {
	"use strict";

	var sViewName = "Startpage";
	var sRequestTileId = "requestTile";
	var sSalesTileId = "salesTile";
	var sRequestTableTileId = "requestTableTile";

	Opa5.createPageObjects({
		onTheStartpage: {

			actions: {

				iClickOnTheRequestTile: function () {
					return this.waitFor({
						id: sRequestTileId,
						viewName: sViewName,
						actions: [new Press()],
						errorMessage: "requestTile cannot be pressed"
					});
				},

				iClickOnTheSalesTile: function () {
					return this.waitFor({
						id: sSalesTileId,
						viewName: sViewName,
						actions: [new Press()],
						errorMessage: "salesTile cannot be pressed"
					});
				},

				iClickOnTheRequestTableTile: function () {
					return this.waitFor({
						id: sRequestTableTileId,
						viewName: sViewName,
						actions: [new Press()],
						errorMessage: "requestTableTile cannot be pressed"
					});
				}
			},

			assertions: {

				iShouldSeeTheApp: function () {
					return this.waitFor({
						id: "app",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The Startpage view is displayed");
						},
						errorMessage: "Did not find the Startpage view"
					});
				},

				iShouldSeeTheRequestTile: function () {
					return this.waitFor({
						id: sRequestTileId,
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The Request tile view is displayed");
						},
						errorMessage: "Did not find the Request tile view"
					});
				},

				iShouldSeeTheSalesTile: function () {
					return this.waitFor({
						id: sSalesTileId,
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The TableSales tile view is displayed");
						},
						errorMessage: "Did not find the TableSales tile view"
					});
				},

				iShouldSeeTheRequestTableTile: function () {
					return this.waitFor({
						id: sRequestTableTileId,
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The requestTable tile view is displayed");
						},
						errorMessage: "Did not find the requestTable tile view"
					});
				},

				iShouldSeeTheCurrentBalance: function () {
					return this.waitFor({
						// TODO: irgendwie pruefen, ob Wert != 0 oder vom Typ Currency oder ob € mit drin ist?
					});
				}
			}
		}
	});
});