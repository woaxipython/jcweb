// content.js
window.onload = function () {
    // 初始化执行函数
    showSelectionIconAndText();
    initExecute();
    onUrlChange(() => {
        const url = window.location.href;
        if (url.match(/explore\/[a-zA-Z0-9]+/)) {
            window.open(url, '_blank');
        }
    });


    document.body.addEventListener("click", function (event) {
        console.log(event.target.id);
        if (event.target.id === "save_comment") {
            const selectedText = window.getSelection().toString().trim();
            getChromeStorageValues(["user_name"], function (result) {
                const userName = result.user_name;
                if (!userName) {
                    alert('请先登录.');
                    return;
                }
                saveHotComment(selectedText, userName);
            });
        }
    });

    // 监听来自背景脚本的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        handleBackgroundMessage(request);
    });


};
let window_link = "/api/sns/web/v1/search/recommend";

function handleBackgroundMessage(request) {
    let productName;
    switch (request.action) {
        case 'saveLinkCom':
            productName = prompt("请输入产品名称", "");
            makeLink(productName, request.linkUrl, request.cookiesData);
            break;
        case 'saveLinkComComment':
            productName = prompt("请输入产品名称", "");
            makeLink(productName, request.linkUrl, request.cookiesData, true, true);
            break;
        case 'saveLinkOwn':
            productName = prompt("请输入产品名称", "");
            makeLink(productName, request.linkUrl, request.cookiesData, false, false);
            break;
        case 'saveLinkOwnComment':
            productName = prompt("请输入产品名称", "");
            makeLink(productName, request.linkUrl, request.cookiesData, false, true);
            break;
        case 'saveHasComment':
            hasComment(request.linkUrl, request.cookiesData);
        case 'executeContentScript':
            if (request.linkUrl.includes(window_link)) {
                window_link = request.linkUrl;
            } else {
                saveSuggestKeyWord(request.linkUrl);
                window_link = "/api/sns/web/v1/search/recommend";
            }
            break;
        default:
            console.warn(`Unhandled action: ${request.action}`);
    }
}
