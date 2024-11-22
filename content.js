const currentUrl = window.location.href;
if (currentUrl.includes('115.com')) {
    chrome.runtime.sendMessage({ action: 'greet' }, response => {
        if (chrome.runtime.lastError) {
            console.error('消息发送错误:', chrome.runtime.lastError);
        } else {
            console.log('收到后台响应:', response);
        }
    });
}