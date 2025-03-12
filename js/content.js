// content.js
window.onload = function () {
    // 初始化执行函数
    initExecute();
    onUrlChange(() => {
        const url = window.location.href;
        if (url.match(/explore\/[a-zA-Z0-9]+/)) {
            window.open(url, '_blank');
        }
    });

    // 监听来自背景脚本的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        handleBackgroundMessage(request);
    });


};

function handleBackgroundMessage(request) {
    let productName;
    switch (request.action) {
        // case 'saveLinkCom':
        //     productName = prompt("请输入产品名称", "");
        //     makeLink(productName, request.linkUrl, request.cookiesData, true, false);
        //     break;
        // case 'saveLinkComComment':
        //     productName = prompt("请输入产品名称", "");
        //     makeLink(productName, request.linkUrl, request.cookiesData, true, true);
        //     break;
        case 'saveLinkOwn':
            productName = prompt("请输入产品名称", "");
            makeLink(productName, request.linkUrl, request.cookiesData, false, false);
            break;
        case 'saveLinkOwnComment':
            productName = prompt("请输入产品名称", "");
            makeLink(productName, request.linkUrl, request.cookiesData, false, true);
            break;
        // case 'saveHasSetTop':
        //     productName = prompt("请输入产品名称", "");
        //     makeLink(productName, request.linkUrl, request.cookiesData, false, false,true);
        //     break;
        default:
            console.warn(`Unhandled action: ${request.action}`);
    }
}
