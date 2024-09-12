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
        } else if (url.endsWith('/explore')) {
            renderXhsHomePage();
            return;
        } else if (url.includes('channel_type')) {
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
            getSrcUrl("src/16.png").then(function (src) {
                $('#logo').attr('src', src)
                $('#user_avatar').attr('src', src)
            });
            getChromeStorageValues(['user_name'], function (result) {
                var userName = result.user_name;
                if (!userName) {
                    $("#user_name").text("未登录");
                } else {
                    $("#user_name").text(userName);
                }
            });
            var url = OuterApi.lizhi;
            initClickEvent();
            FetchGetRequest(url).then(function (data) {
                $("#say_what").text(data.data.zh + "\n" + data.data.en);
            });
            FetchExeData().then(function (data) {
                console.log("获取的数据：", data);
                $("#has_send").text(data.has_send[0])
                ChangeProgress("#has_send", data.has_send[2]);
                $("#has_collected_m").text(data.has_collected_m[0])
                ChangeProgress("#has_collected_m", data.has_collected_m[2]);
                $("#has_collected_d").text(data.has_collected_d[0])
                ChangeProgress("#has_collected_d", data.has_collected_d[2]);
                $("#has_collected_hotcom_m").text(data.has_collected_hotcom_m[0])
                ChangeProgress("#has_collected_hotcom_m", data.has_collected_hotcom_m[2]);
                $("#has_collected_hotcom_d").text(data.has_collected_hotcom_d[0])
                ChangeProgress("#has_collected_hotcom_d", data.has_collected_hotcom_d[2]);
            })
        });
    }
}


function makeXHSProfileBar() {
    const id_div = $('.interaction-container');

    // 清除#jjc_xhs_product元素
    id_div.find('#jjc_xhs_product').remove();

    getHtmlTemplate('jjc_xhs_product').then(function (html) {
        id_div.prepend(html);
        console.log("写入了html");
        // 确保#logo在DOM中存在后再设置src
        getSrcUrl("src/16.png").then(function (src) {
            const logoElement = $('#logo');
            if (logoElement.length) {
                logoElement.attr('src', src);
            } else {
                console.error("#logo 元素未找到");
            }
        });
        var url = OuterApi.lizhi;
        initClickEvent();
        console.log("进行了初始化点击事件");

        FetchGetRequest(url).then(function (data) {
            console.log("获取了句子");
            $("#say_what").text(data.data.zh);
        });
        // 调用示例

    });
}

function observeSugContainer(callback) {
    setTimeout(() => {
        const text_list = [];
        $('.sug-item').each(function () {
            const text = $(this).text().trim();
            text_list.push(text);
        });
        console.log(text_list); // 输出收集到的文本列表
        if (callback) callback(text_list);
    }, 1000); // 延迟1秒
}

function make_xhs_comments() {
    var title = $('<title>').text($('#detail-title').text());
    var content = $('<content>').text($("#detail-desc").text());
    var article = $('<article>').append(title).append(content).prop('outerHTML');

    var commentTexts = $('.comment-inner-container .content').map(function () {
        return $(this).text();
    }).get().join(' ');
    var comment = $('<comment>').text(commentTexts).prop('outerHTML');
    var key_word = $('select[name="InsertKeyWord"] option:selected').val();
    GetAiComment(article, comment, key_word);
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
