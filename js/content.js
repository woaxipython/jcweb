// content.js
window.onload = function () {
    // 初始化执行函数
    showSelectionIconAndText()
    initExecute()
    onUrlChange(() => {
        const url = window.location.href;
        if (url.match(/explore\/[a-zA-Z0-9]+/)) {
            window.open(window.location.href, '_blank');
        }
    });

    $("body").on("click", "#save_comment", function () {
        const selectedText = window.getSelection().toString().trim();
        getChromeStorageValues(["user_name"], function (result) {
            const userName = result.user_name;
            if (!userName) {
                alert('请先登录.');
                return;
            }
            saveHotComment(selectedText, userName);
        });
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

