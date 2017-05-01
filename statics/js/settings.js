'use strict';
var electron = require('electron');
var ipcRenderer = electron.ipcRenderer;
var config = require('../config');


bindEvents();

/**
*	函数定义
*/

function bindEvents() {

	var checkBoxs = document.querySelectorAll('.global-shortcut');
	var closeButton = document.querySelector('.close');
	closeButton.addEventListener('click', () => {

		ipcRenderer.send('close-settings-window');
	});

	var shortcutKeys = config.readSettings('shortcutKeys');

	for(var i=0,len=checkBoxs.length; i<len; i++) {
		var checkBox = checkBoxs[i];
		var value = checkBox.attributes['data-modifier-key'].value;
		checkBox.checked = shortcutKeys.indexOf(value) !== -1;
		checkBox.addEventListener('click', (event) => {
			bindCheckBoxEvent(event);
		});
	}
}

function bindCheckBoxEvent(event) {
	var shortcutKeys = config.readSettings('shortcutKeys');
    var modifierKey = event.target.attributes['data-modifier-key'].value;

    if (shortcutKeys.indexOf(modifierKey) !== -1) {
        var shortcutKeyIndex = shortcutKeys.indexOf(modifierKey);
        shortcutKeys.splice(shortcutKeyIndex, 1);
    }
    else {
        shortcutKeys.push(modifierKey);
    }

    config.saveSettings('shortcutKeys', shortcutKeys);
    ipcRenderer.send('set-global-shortcuts');
}