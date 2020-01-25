/*global QUnit*/

sap.ui.define([], function () {
	"use strict";

	var destinationName = "MOB_UMSATZ";

	QUnit.module(destinationName + " Destination");

	QUnit.test(destinationName + " should be reachable", function (assert) {
		var done = assert.async();

		var settings = {
			"url": "/" + destinationName,
			"method": "POST",
			"timeout": 10000, // timeout 10s
			"data": JSON.stringify({
				name: destinationName
			})
		};

		$.ajax(settings)
			.done(function (data, statusText, xhr) {
				assert.ok(true, "Connection to " + destinationName + " established. Response returned: " + xhr.status);
				done();
			})
			.fail(function (jqXHR, exception) {
				if (jqXHR.status === 400) {
					assert.ok(true, "Connection to " + destinationName + " established. Response returned: " + jqXHR.status);
				} else {
					assert.ok(false, "Connection to " + destinationName + " could not be established. Response returned: " + jqXHR.status);
				}

				done();
			});
	});
});