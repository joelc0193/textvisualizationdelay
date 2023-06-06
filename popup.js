document.addEventListener('DOMContentLoaded', () => {
    const readAloudButton = document.getElementById('read-aloud-btn');
    readAloudButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { message: 'getSelection' }, function (response) {
        });
    });
    });
});