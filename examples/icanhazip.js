var galaxy = require('galaxy');
var phantom = require('galaxy-phantom');

galaxy.main(function *() {
	var ph = yield phantom.createAsync("--proxy-type=socks5", "--proxy=127.0.0.1:9050");
	try {
		var page = yield ph.createPageAsync();
		yield page.openAsync("http://www.icanhazip.com");
		var title = yield page.evaluateAsync(function(test) {
			return document.getElementsByTagName("pre")[0].innerText.trim();
		});
		console.log(title);
	} catch (ex) {
		console.log('Error: ' + ex);
	} finally {
		ph.exit();
	}
});
