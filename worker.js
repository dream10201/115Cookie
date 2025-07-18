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
                    expirationDate: CONFIG.EXPIRATION_DATE
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'greet') {
        (async () => {
            try {
                await applyCookies();
                const response = await fetch('https://115.com/?ct=offline&ac=space');
                
                if (response.redirected) {
                    console.log('Login check failed: Redirected.');
                    sendResponse({ status: 'login_failed' });
                } else {
                    console.log('Login check successful.');
                    sendResponse({ status: 'login_success' });
                }
            } catch (error) {
                console.error('An error occurred during the process:', error);
                sendResponse({ status: 'error', message: error.message });
            }
        })();
        return true; 
    }
});