
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var config = require('../config');
var ipcMain = electron.ipcMain;
var globalShortcut = electron.globalShortcut;
var path = require('path');
var url = require('url');


var mainWindow = null;
var settingsWindow = null;


appListener();
ipcListener();


/**
*	函数定义
*/

function createWindow() {
	mainWindow = new BrowserWindow({
		width : 1200,
		height : 800,
		frame : false,
		resizable : false
	});
	var URL = url.format({
		pathname : path.resolve(__dirname, '../views/index.html'),
		protocol : 'file:',
		slashes : true
	});

	mainWindow.loadURL(URL);

	mainWindow.webContents.openDevTools();


	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}


function appListener() {
	app.on('ready', createWindow);

	app.on('window-all-closed', () => {
		if(process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', () => {
		if(!mainWindow) {
			createWindow();
		}
	});
}

function ipcListener() {
	ipcMain.on('close-main-window', () => {
	
		app.quit();
	});

	ipcMain.on('open-settings-window', () => {
	
		if(settingsWindow) {
			return;
		}

		settingsWindow = new BrowserWindow({
			frame : false,
			width : 200,
			height : 200,
			resizable : false
		});

		var URL = url.format({
			pathname : path.resolve(__dirname, '../views/settings.html'),
			protocol : 'file:',
			slashes : true
		});

		settingsWindow.loadURL(URL);

		//settingsWindow.webContents.openDevTools();

		settingsWindow.on('closed', () => {
			settingsWindow = null;
		});
	});

	ipcMain.on('close-settings-window', () => {
		if(settingsWindow) {
			settingsWindow.close();
		}
	});

	ipcMain.on('set-global-shortcuts', () => {
		setGlobalShortcuts();
	});
}

function setGlobalShortcuts() {
	globalShortcut.unregisterAll();

	var shortcutKeysSettings = config.readSettings('shortcutKeys');
	var shortcutKeysPrefix = shortcutKeysSettings.length == 0 ? '' : shortcutKeysSettings.join('+') + '+';

	globalShortcut.register(shortcutKeysPrefix + '0', () => {
		mainWindow.webContents.send('global-shortcut', 0);
	});

	globalShortcut.register(shortcutKeysPrefix + '1', () => {
		mainWindow.webContents.send('global-shortcut', 1);
	});
}
