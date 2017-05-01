'use strict';

var electron = require('electron');
var remote = electron.remote;
var ipcRenderer = electron.ipcRenderer;


bindEvents(); // dom 绑定事件


/**
*   函数定义
*/

function bindEvents() {
    var soundButtons = document.querySelectorAll('.button-sound');
    var closeButton = document.querySelector('.close');
    var settingsButton = document.querySelector('.settings');

    ipcRendererEvents({
        soundButtons : soundButtons
    });

    for(var i=0,len=soundButtons.length; i<len; i++) {
        var soundButton = soundButtons[i];
        var soundName = soundButton.attributes['data-sound'].value;
        soundButtonBindEvent(soundButton, soundName);
    }

    closeButton.addEventListener('click', () => {
        ipcRenderer.send('close-main-window');
    });

    settingsButton.addEventListener('click', () => {
        ipcRenderer.send('open-settings-window');
    });
}

function soundButtonBindEvent(soundButton, soundName) {
    soundButton.querySelector('span').style.backgroundImage = `url(../statics/img/icons/${soundName}.png)`;
    var audio = new Audio(`../statics/wav/${soundName}.wav`);
    soundButton.addEventListener('click', () => {
        audio.currentTime = 0;
        audio.play();
    });
}

function ipcRendererEvents(params) {
    var soundButtons = params.soundButtons;
    ipcRenderer.on('global-shortcut', (sender, index) => {
        var event = new MouseEvent('click');
        soundButtons[index].dispatchEvent(event);
    });
}
