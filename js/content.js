// content.js
window.onload = function () {
    // 初始化执行函数
    initExecute();
    onUrlChange(() => {
        getChromeStorageValues(['token'], function (result) {
            var token = result.token;
            // 调用函数以启用功能
            if (isTokenExpired(token)) {
                const url = window.location.href;
                if (url.includes('explore/')) {
                    setTimeout(() => {
                        const main_bar = $("#mfContainer")
                        const user_container_bar = $("#userPostedFeeds");
                        if (main_bar.length) {
                            makeContainerBar();
                        } else if (user_container_bar.length) {
                            console.log("用户页面,跳空");
                            // makeUserContainerBar();
                        } else {
                            handleProductPage();
                        }
                    }, 500); // 延迟1秒等待DOM加载
                }
            }
        })
    })
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log(request);
        handleBackgroundMessage(request);
    });

};
window.addEventListener('load', () => {
    getCookieAlarm();
});

function getCookieAlarm() {
    const interval = 5; // 定时任务间隔时间，单位为分钟
    setInterval(() => {
        getCookies();
        // 在这里编写定时任务的逻辑
    }, 1000 * 60 * interval);
}

// 监听URL变动事件
function onUrlChange(callbackFunction) {
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            callbackFunction();
        }
    }).observe(document, {subtree: true, childList: true});
}


function handleBackgroundMessage(request) {
    let productName;
    switch (request.action) {
        case 'saveLinkOwn':
            productName = prompt("请输入产品名称", "");
            makeLink(productName, request.linkUrl, request.cookiesData, false, false);
            break;
        case 'saveLinkOwnComment':
            productName = prompt("请输入产品名称", "");
            makeLink(productName, request.linkUrl, request.cookiesData, false, true);
            break;
        default:
            getCookies();
    }
}
