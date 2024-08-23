function initXhsExe() {
    const url = window.location.href;
    if (url.includes('search_result')) {
        renderXhsHomePage();
        return;
    }

    if (url.includes('explore')) {
        if (url.match(/explore\/[a-zA-Z0-9]+/)) {
            handleProductPage();
            return;
        }
        if (url.endsWith('/explore')) {
            renderXhsHomePage();
            return;
        }
    }

    if (url.includes('user/profile')) {
        handleProfilePage();
        // makeXhsTitle();
    }
}


function handleProductPage() {
    // 在小红书页面下，等待1秒后，执行下面的代码
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

function renderXhsHomePage() {
    makeXhsBar();
}

function makeXhsBar() {
    const id_div = $('.feeds-page');
    if (!id_div.find('#jjc_app').length) {
        getHtmlTemplate('jjc_app').then(function (html) {
            id_div.prepend(html);
            var url = OuterApi.lizhi
            FetchGetRequest(url).then(function (data) {
                $("#say_what").text(data.data.zh + "\n" + data.data.en)
            })
        });
    }

}


function makeXHSProfileBar() {
    const id_div = $('.interaction-container');
    if (!id_div.find('#jjc_xhs_product').length) {
        getHtmlTemplate('jjc_xhs_product').then(function (html) {
            id_div.prepend(html);
            var url = OuterApi.lizhi
            FetchGetRequest(url).then(function (data) {
                $("#say_what").text(data.data.zh + "\n" + data.data.en)
            })
        });
    }
}

function xhs() {
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