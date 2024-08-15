// content.js
window.onload = function () {
    // 确定当前的页面是否是小红书主页
    var currentURL = window.location.href;
    const isXHSHome = currentURL.indexOf('xiaohongshu') > -1;

    if (isXHSHome) {
        // 如果是小红书页，则在id=app的div中添加一个卡片
        const id_div = $('#app');
        const cardHtml = makeCard();
        id_div.prepend(cardHtml);

        // 在每一个section的最下面添加一个checkBox
        var checkBox = makeCheckBox();
        $('a.title').before(checkBox);
        
    }
    $("#analyzeButton").on('click', function () {
        // 点击卡片时，弹出输入框以获取产品名称
        var currentURL = window.location.href;
        if (currentURL.includes('xiaohongshu')) {
            xhs();
        } else if (currentURL.includes('douyin')) {
            douyin();
        } else if (currentURL.includes('bilibili')) {
            bilibili();
        }
    })

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.linkUrl) {
            // 显示输入框以获取产品名称
            const productName = prompt("请输入产品名称", "");
            if (productName !== null) {
                // 将产品名称和链接URL发送回后台脚本
                chrome.runtime.sendMessage({productName: productName, linkUrl: message.linkUrl}, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error('SendMessage Error:', chrome.runtime.lastError);
                    } else {
                        console.log('Response received:', response);
                        if (response.status === 'success') {
                            console.log('Operation was successful:', response.data);
                        } else {
                            console.error('Operation failed:', response.error);
                        }
                    }
                });

            }
        }
    });
}
