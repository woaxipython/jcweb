// content.js
window.onload = function () {
    // 初始化执行函数
    initExecute()
    onUrlChange(() => {
        // 如果URL发生变化，则重新执行initExecute()函数
        initExecute()
    })


// 监听来自背景脚本的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        var productName;
        switch (request.action) {
            case 'saveLinkCom':
                productName = prompt("请输入产品名称", "");
                makeLink(productName, request.linkUrl, request.cookiesData);
                break;
            case 'saveLinkComComment':
                productName = prompt("请输入产品名称", "");
                makeLink(productName, request.linkUrl, request.cookiesData, com = true, comment = true);
                break;
            case 'saveLinkOwn':
                productName = prompt("请输入产品名称", "");
                makeLink(productName, request.linkUrl, request.cookiesData, com = false, comment = false);
                break;
            case 'saveLinkOwnComment':
                productName = prompt("请输入产品名称", "");
                makeLink(productName, request.linkUrl, request.cookiesData, own = false, comment = true);
                break;
            default:
                console.warn(`Unhandled action: ${request.action}`);
        }
    });


}

