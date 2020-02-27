/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Startpage",
	"./pages/Request",
	"./pages/TableSales",
	"./pages/TableRequests"
], function (opaTest) {
	"use strict";

	QUnit.module("TableRequests Journey");

	opaTest("The requestTable view should be reachable and show the requestTable table", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Assertions
		Then.onTheStartpage.iShouldSeeTheApp();
		Then.onTheStartpage.iShouldSeeTheRequestTableTile();

		// Actions
		When.onTheStartpage.iClickOnTheRequestTableTile();

		// Assertions
		Then.onTheRequestTablePage.iShouldSeeTheApp();
		Then.onTheRequestTablePage.iShouldSeeTheTable();
		Then.onTheRequestTablePage.iShouldSeeTheColumn("column0");
		Then.onTheRequestTablePage.iShouldSeeTheColumn("column1");
		Then.onTheRequestTablePage.iShouldSeeTheColumn("column2");
		Then.onTheRequestTablePage.iShouldSeeTheColumn("column3");
		Then.onTheRequestTablePage.iShouldSeeTheColumn("column4");
		Then.onTheRequestTablePage.iShouldSeeTheColumn("column5");
		Then.onTheRequestTablePage.iShouldSeeTheColumn("column6");
		Then.onTheRequestTablePage.iShouldSeeTheColumnListItem();
		Then.onTheRequestTablePage.iShouldSeeTheActionSelect("select0");
		Then.onTheRequestTablePage.iShouldSeeTheSearchField("searchField0");

		// Cleanup
		Then.iTeardownMyApp();
	});

		opaTest("The admin detail view should be reachable from the requestTable view and show the datails", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			// Actions
			When.onTheStartpage.iClickOnTheRequestTableTile();
			When.onTheRequestTablePage.iClickOnTheColumnListItem();
			
			// Assertions
		//	Then.onTheDetailPage.iShouldSeeTheApp();
		//	Then.onTheDetailPage.iShouldSeeTheFormElement("form0");

			Then.iTeardownMyApp();
		});

});