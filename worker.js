const CID=""
const SEID=""
const UID=""
const newC = {
    url: 'https://115.com',
    name: '',
    value: '',
    domain: '.115.com',
    expirationDate: 253402300799,
    path: '/'
};
function setCookie(newC) {
    return new Promise((resolve, reject) => {
        chrome.cookies.set(newC, cookie => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            else if (!cookie) {
                reject(new Error('This cookie is deleted (expired)'));
            }
            else {
                resolve(cookie);
            }
        });
    });
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "greet") {
        console.log("收到消息:", message);
        chrome.cookies.get({ url: "https://115.com", name: "SEID" }, (cookie) => {
            if (CID.length > 0 && SEID.length > 0 && UID.length > 0){
                newC["name"] = "CID";
                newC["value"] = CID;
                setCookie(newC);
                newC["name"] = "SEID";
                newC["value"] = SEID;
                setCookie(newC);
                newC["name"] = "UID";
                newC["value"] = UID;
                setCookie(newC);
                if (!cookie) {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs[0]) {
                            chrome.tabs.reload(tabs[0].id);
                        }
                    });
                }
            }
        });
        const responseMessage = { reply: "你好，来自后台脚本的问候!" };
        sendResponse(responseMessage);
    }
    return true;
});

