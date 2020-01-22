	/*global QUnit*/

	sap.ui.define([
		"sap/ui/test/opaQunit",
		"./pages/Startpage",
		"./pages/Request",
		"./pages/Sales",
		"./pages/Detail"
	], function (opaTest) {
		"use strict";

		QUnit.module("Sales Journey");

		opaTest("The sales view should be reachable and show the sales table", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			// Assertions
			Then.onTheStartpage.iShouldSeeTheApp();
			Then.onTheStartpage.iShouldSeeTheSalesTile();

			//Actions
			When.onTheStartpage.iClickOnTheSalesTile();

			// Assertions
			Then.onTheSalesPage.iShouldSeeTheApp();
			Then.onTheSalesPage.iShouldSeeTheTable();
			Then.onTheSalesPage.iShouldSeeTheColumn("column0");
			Then.onTheSalesPage.iShouldSeeTheColumn("column1");
			Then.onTheSalesPage.iShouldSeeTheColumn("column2");
			Then.onTheSalesPage.iShouldSeeTheColumn("column3");
			Then.onTheSalesPage.iShouldSeeTheColumn("column4");
			Then.onTheSalesPage.iShouldSeeTheColumnListItem();

			//Cleanup
			Then.iTeardownMyApp();
		});

		opaTest("The detail view should be reachable from the sales view and show the datails", function (Given, When, Then) {
			//Arrangements
			Given.iStartMyApp();

			// FIXME: Cannot read property 'length' of null TypeError: Cannot read property 'length' of null at constructor

			//Actions
			When.onTheStartpage.iClickOnTheSalesTile();
			When.onTheSalesPage.iClickOnTheColumnListItem();

			//Assertions
			Then.onTheDetailPage.iShouldSeeTheApp();
			Then.onTheDetailPage.iShouldSeeTheFormElement("");

		});

	});