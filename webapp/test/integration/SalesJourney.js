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
			Then.onTheSalesPage.iShouldSeeTheColumn("column0");
			Then.onTheSalesPage.iShouldSeeTheColumn("column1");
			Then.onTheSalesPage.iShouldSeeTheColumn("column2");
			Then.onTheSalesPage.iShouldSeeTheColumn("column3");
			Then.onTheSalesPage.iShouldSeeTheColumn("column4");
			
			//Actions
			When.onTheSalesPage.iClickOnTheColumnListItem();
			

			//Cleanup
			Then.iTeardownMyApp();
		});

	});