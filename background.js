/// <reference types="chrome"/>

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'selection') {
        const text = request.data;
        chrome.tts.speak(text,
            { desiredEventTypes: ['start', 'end', 'error'], voiceName: 'Evan (Enhanced)' }
        );
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            readAloud(tabs[0].id, text, 0);
        });
        sendResponse();
    }
});


async function readAloud(tabID, text, delay) {
    console.log('in readAloud');
    tabID = parseInt(tabID);
    let wordIndices = text.split(' ').reduce((acc, word) => {
        const regex = new RegExp('\\b\\w+(?:-\\w+)*\\b', 'g');
        let match = regex.exec(text);
        while (match !== null) {
            acc.push(match.index);
            match = regex.exec(text);
        }
        return acc;
    }, []);
    wordIndices = [...new Set(wordIndices)];
    wordIndices.sort((a, b) => a - b);
    const refIndices = [];
    for (let i = 0; i < wordIndices.length; i += 3) {
        refIndices.push(wordIndices[i]);
    }
    console.log('wordIndices: ' + wordIndices);
    console.log('refIndices: ' + refIndices);
    chrome.tts.speak(text,
        {
            rate: 1,
            desiredEventTypes: ['start', 'end', 'error', 'word'], voiceName: 'Evan (Enhanced)', onEvent: function (event) {
                if (event.type == 'start') {
                    chrome.tabs.sendMessage(tabID, { message: 'putBackground' }, function (response) { });
                }
                if (event.type == 'word') {
                    if (refIndices.indexOf(event.charIndex) != -1) {
                        console.log('Current text: ');
                        console.log(text.substring(event.charIndex, refIndices.indexOf(event.charIndex) < refIndices.length - 1 ? refIndices[refIndices.indexOf(event.charIndex) + 1] - 1 : text.length));
                        setTimeout(() => {
                            try {
                                chrome.tabs.sendMessage(tabID, { message: 'removeWordOnScreen' }, function (response) { });
                            } catch { };
                            const startWordIndex = refIndices[refIndices.indexOf(event.charIndex)];
                            chrome.tabs.sendMessage(
                                tabID,
                                {
                                    message: 'showWordOnScreen',
                                    data: text.substring(event.charIndex, refIndices.indexOf(event.charIndex) < refIndices.length - 1 ? refIndices[refIndices.indexOf(event.charIndex) + 1] - 1 : text.length),
                                },
                                function (response) { }
                            )
                        }, delay);
                    }
                }
                else if (event.type == 'end') {
                    chrome.tabs.sendMessage(tabID, { message: 'removeWordOnScreen' }, function (response) { });
                    chrome.tabs.sendMessage(tabID, { message: 'removeBackground' }, function (response) { });
                }
            }
        }
    );
}