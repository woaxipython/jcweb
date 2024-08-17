function initXhsExe() {
    const url = window.location.href;
    if (url.includes('search_result')) {
        renderXhsComponents();
    } else if (url.includes('explore')) {
        if (url.match(/explore\/[a-zA-Z0-9]+/)) {
            handleProductPage();
        } else if (url.endsWith('/explore')) {
            renderXhsComponents();
        }
    } else if (url.includes('user/profile')) {
        handleProfilePage();
        makeXhsTitle();
    }
}

function handleProductPage() {
    setTimeout(function () {
        console.log("定时等待结束");
        makeXHSProfileBar();
    }, 1000);
}

function handleProfilePage() {
    const container = $('#userPageContainer .user');
    if (!container.find('#jjc_app').length) {
        container.after(makeXHSUserCard());
    }
}

function renderXhsComponents() {
    makeXhsBar();
    makeXhsTitle();
}

function makeXhsBar() {
    const id_div = $('.feeds-page');
    if (!id_div.find('#jjc_app').length) {
        id_div.prepend(makeCard());
    }
}

function makeXHSProfileBar() {
    const container = $('.interaction-container');
    if (!container.find('#jjc_app').length) {
        container.prepend(makeXHSProfileCard());
    }
}

function xhs() {
    // alert('当前URL为：' + window.location.href);
    // 此时只判断的当前的URL链接是包含"xiaohongshu"的，但是不确认是哪个页面
    // 1. 所以需要判断一下当前页面是哪个框架
    // 如果是search页面，那么就判断是否包含"search"，如果包含，那么就执行下面的代码
    // 首先，弹出弹框“请登录小红书后使用本插件，否则数据有可能不准确”
    // 1. 判断是否为搜索页面
    const currentURL = window.location.href;
    if (currentURL.includes('search_result')) {
        //     search页面的URL格式为：https://www.xiaohongshu.com/search_result?keyword=%25E9%259E%258B%25E8%2583%25B6&source=web_explore_feed
        //     此时为search页面，弹出弹框
        // alert("已经进入到search页面")
        // 计算当前页下.feeds-container中secction的数量
        var section_count = $('.feeds-page .feeds-container section').length;
        alert("当前页面下有" + section_count + "个section")

    } else {
        //不是search页面，弹出弹框
        var section_count = $('.feeds-page .feeds-container section').length;
        alert("当前页面下有" + section_count + "个section")
    }

}

function makeXhsTitle() {
    var checkBox = makeCheckBox();
    // 在 section中查找“form-check",如果不存在，则创建一个，如果存在，则直接返回
    var formCheck = $('section .form-check');
    if (formCheck.length == 0) {
        $('a.title').before(checkBox);
    } else {
        return
    }

}