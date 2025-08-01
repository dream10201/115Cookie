const CONFIG = {
    SITES: [
        { url: 'https://115.com', domain: '.115.com' },
        { url: 'https://anxia.com', domain: '.anxia.com' }
    ],
    COOKIE_VALUES: {
        CID: '',
        SEID: '',
        UID: '',
        KID: ''
    },
    EXPIRATION_DATE: 253402300799 
};
const expirationTimestamp = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return Math.floor(d.getTime() / 1000);
})();
async function setCookie(cookieDetails) {
    return new Promise((resolve, reject) => {
        chrome.cookies.set(cookieDetails, (cookie) => {
            if (chrome.runtime.lastError) {
                return reject(new Error(chrome.runtime.lastError.message));
            }
            resolve(cookie);
        });
    });
}
async function applyCookies() {
    console.log("Starting to apply cookies...");
    const tasks = [];
    for (const site of CONFIG.SITES) {
        for (const [name, value] of Object.entries(CONFIG.COOKIE_VALUES)) {
            if (value && value.length > 0) {
                const cookieDetails = {
                    url: site.url,
                    domain: site.domain,
                    name: name,
                    value: value,
                    path: '/',
                    expirationDate: expirationTimestamp
                };
                tasks.push(setCookie(cookieDetails));
            }
        }
    }
    const results = await Promise.allSettled(tasks);
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`Cookie successfully set:`, result.value.name);
        } else {
            console.error(`Failed to set cookie:`, result.reason.message);
        }
    });
    console.log("Cookie application process finished.");
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'greet') {
        (async () => {
            try {
                await applyCookies();
            } catch (error) {
                sendResponse({ status: 'error', message: error.message });
            }
        })();
        return true; 
    }
});
