'use strict';

var nconf = require('nconf');

var config = nconf.file({
	file : getUserHome() + '/sound-machine-config.json'
});




exports.saveSettings = saveSettings;
exports.readSettings = readSettings;




/**
*	函数定义
*/

// 设置属性
function saveSettings(key, value) {
	config.set(key, value);
	config.save();
}

// 保存属性
function readSettings(key) {
	config.load();
	return config.get(key);
}


function getUserHome() {
	/*
	var platform = process.platform;
	var flag = 'HOME';

	if(platform == 'win32') {
		flag = 'USERPROFILE';
	}

	return process.env[flag];
	*/

	return './configure';
}