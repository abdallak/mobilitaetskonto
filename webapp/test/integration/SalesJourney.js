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

		opaTest("There should be a clickable sales tile on the startpage", function (Given, When, Then) {
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
			Then.onTheSalesPage.iShouldSeeTheColumns("column0");
			Then.onTheSalesPage.iShouldSeeTheColumns("column1");
			Then.onTheSalesPage.iShouldSeeTheColumns("column2");
			Then.onTheSalesPage.iShouldSeeTheColumns("column3");
			Then.onTheSalesPage.iShouldSeeTheColumns("column4");

			//Cleanup
			Then.iTeardownMyApp();
		});

	});