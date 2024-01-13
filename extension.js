
const vscode = require('vscode');
const opn = require('open');
const platform = require('os').platform();
const defaultBrowser = require('x-default-browser');

const WIN_CHROME = 'chrome';
const OSX_CHROME = 'google chrome';
const LINUX_CHROME = 'google-chrome';
const LINUX_CHROMIUM = 'chromium-browser';

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('open-urls-in-browser.open', function () {

		const editor = vscode.window.activeTextEditor;
		const selectedText = editor.document.getText(editor.selection)
		const urlRegexp = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
		const urls = [...selectedText.matchAll(urlRegexp)];

		for (let i = 0; i < urls.length; i++) {
			defaultBrowser(function (error, result) {
				if (!error) {
					let appName = null;
					if (result.commonName === 'chrome') {
						if (platform === 'win32') {
							appName = WIN_CHROME;
						} else if (platform === 'darwin') {
							appName = OSX_CHROME;
						} else {
							appName = LINUX_CHROME;
						}
					} else if (result.commonName === 'chromium') {
						appName = LINUX_CHROMIUM;
					}
					opn(urls[i][0], { app: appName });
				}
				else {
					opn(urls[i][0]);
				}
			});
		}
  });
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
