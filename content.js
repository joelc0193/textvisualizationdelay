chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'getSelection') {
        chrome.runtime.sendMessage({
            message: 'selection', data: window.getSelection().toString(), function(response) {
            }
        });
        sendResponse();
    }
    if (request.message === 'showWordOnScreen') {
        showWordOnScreen(request.data);
        sendResponse();
    }
    if (request.message === 'putBackground') {
        putBackground();
        sendResponse();
    }
    if (request.message === 'removeBackground') {
        removeBackground();
        sendResponse();
    }
});

function putBackground() {
    const div = document.createElement('div');
    div.setAttribute('id', 'my-extension-background');
    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.left = '0';
    div.style.height = `${window.innerHeight}px`;
    div.style.width = `${window.innerWidth}px`;
    div.style.backgroundColor = 'white';
    document.body.appendChild(div);
}

function removeBackground() {
    const div = document.getElementById('my-extension-background');
    document.body.removeChild(div);
}

function showWordOnScreen(word) {
    const div = document.createElement('div');
    div.textContent = word;
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.left = '50%';
    div.style.transform = 'translate(-50%, -50%)';
    div.style.backgroundColor = 'white';
    div.style.padding = '10px';
    div.style.border = '1px solid black';
    const parentDiv = document.getElementById('my-extension-background');
    parentDiv.appendChild(div);
    const listener = function removeWordOnScreen(request, sender, sendResponse) {
        if (request.message === 'removeWordOnScreen') {
            parentDiv.removeChild(div);
            sendResponse();
        }
        chrome.runtime.onMessage.removeListener(removeWordOnScreen);
    };
    chrome.runtime.onMessage.addListener(listener);
}