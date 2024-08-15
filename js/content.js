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

    $(".loginExe").on('click', function () {
        const userName = prompt("请输入用户名", "")
        const password = prompt("请输入密码", "")
        console.log(userName, password)
    })

    $("#initButton").on('click', function () {
        initButtonClick()
    })
    $("#analyzeButton").on('click', function () {
        analyzeButton()
    })

    $('input.linkCheck').change(function () {
        changeInputValue(this)
    });
    $('#CheckAllLink').change(function () {
        initButtonClick();
        changeAllInputValue(this)
    });


    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        // 如果收到来自后台脚本的消息，则显示输入框以获取产品名称
        if (message.selectAllInput) {
            initButtonClick()
            // 获取当前input的checked状态
            if ($('#CheckAllLink').prop('checked')) {
                $('#CheckAllLink').prop('checked', false).trigger('change')
            } else {
                $('#CheckAllLink').prop('checked', true).trigger('change')
            }

        }
        // linkUrl为单次保存的链接
        else if (message.linkUrl) {
            const productName = prompt("请输入产品名称", "");
            // 显示输入框以获取产品名称
            // 将产品名称和链接URL发送回后台脚本
            chrome.runtime.sendMessage({productName: productName, linkUrl: message.linkUrl}, (response) => {
            });
            // selectedLinks 传递的是boolean值，表示此时点击的是否是保存所有已选链接的选项
        } else if (message.selectedLinks) {
            const productName = prompt("请输入产品名称", "");
            const selectedLinks = getSelectedLinks(productName);
            chrome.runtime.sendMessage({selectedLinks: selectedLinks}, (response) => {
            });
        }
    });

}
