/*global QUnit*/

sap.ui.define([
<<<<<<< HEAD
	"mobilitaetskonto/mobilitaetskonto/controller/View1.controller"
=======
<<<<<<< HEAD
	"mobilitaetskonto/mobilitaetskonto/controller/View1.controller"
=======
	"Mobilitaetskonto/Mobilitaetskonto/controller/View1.controller"
>>>>>>> refs/heads/master
>>>>>>> refs/heads/master
], function (Controller) {
	"use strict";

	QUnit.module("View1 Controller");

	QUnit.test("I should test the View1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});