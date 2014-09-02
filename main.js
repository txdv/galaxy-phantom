(function () {
	var galaxy = require('galaxy');
	require('galaxy-augment');

	var EventEmitter = require('events').EventEmitter;

	var phantom = require('streamline-phantom');

	galaxy.augment(phantom, "create", null, function (ph) {
		galaxy.augment(ph, "createPage", null, function (page) {
			['open', 'evaluate', 'set', 'get', 'setContent'].forEach(function (obj) {
				page[obj + 'Async'] = galaxy.star(page[obj]);
			});

			page.events = new EventEmitter();

			var events = [
				"onAlert",
				"onCallback",
				"onClosing",
				"onConfirm",
				"onConsoleMessage",
				"onError",
				"onFilePicker",
				"onInitialized",
				"onLoadFinished",
				"onLoadStarted",
				"onNavigationRequested",
				"onPageCreated",
				"onPrompt",
				"onResourceError",
				"onResourceReceived",
				"onResourceRequested",
				"onResourceTimeout",
				"onUrlChanged"
			];

			events.forEach(function (eventName) {
				page.set(eventName, function (value) {
					var arg = Array.prototype.slice.call(arguments);
					page.events.emit(eventName, null, arg);
					page.events.emit('event', null, {
						name: eventName,
						data: arg
					});
				});
			});

		});
		ph.createPageAsync = galaxy.star(ph.createPage);
	});
	phantom.createAsync = galaxy.star(phantom.create);

	module.exports = phantom;
})();
