// content.js
window.onload = function () {
    // 确定当前的页面是否是小红书主页
    initExecute()
    // 鼠标滚动时，重新执行initButtonClick()函数，并将全选设置为false
    executeOnScroll(() => {
        initButtonClick();
        $('#CheckAllLink').prop('checked', false).trigger('change')
    });
    onUrlChange(() => {
        // 如果URL发生变化，则重新执行initExecute()函数
        initExecute()
    })


// 监听来自背景脚本的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case 'promptProductName':
                const productName = prompt("请输入产品名称", "");
                makeLink(productName, request.linkUrl, request.cookiesData);
                break;
            case 'promptProductNameForAllLinks':
                const productNameForAll = prompt("请输入产品名称", "");
                makeAllLink(productNameForAll, request.cookiesData);
                break;
            case 'selectAllInput':
                toggleCheckAllInput();
                break;
            default:
                console.warn(`Unhandled action: ${request.action}`);
        }
    });

// 切换全选输入的状态
    function toggleCheckAllInput() {
        const checkBox = $('#CheckAllLink');
        checkBox.prop('checked', !checkBox.prop('checked')).trigger('change');
    }
}
