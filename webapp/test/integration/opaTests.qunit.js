/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
<<<<<<< HEAD
		"mobilitaetskonto/mobilitaetskonto/test/integration/AllJourneys"
=======
		"Mobilitaetskonto/Mobilitaetskonto/test/integration/AllJourneys"
>>>>>>> refs/heads/master
	], function () {
		QUnit.start();
	});
});