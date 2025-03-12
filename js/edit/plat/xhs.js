function initXhsExe() {
    const url = window.location.href;
    if (url.includes('search_result')) {
        renderXhsHomePage();
        return;
    }

    if (url.includes('explore')) {
        if (url.match(/explore\/[a-zA-Z0-9]+/)) {
            $("")
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
    }
}


function handleProductPage() {
    // 在小红书页面下，等待1秒后，执行下面的代码
    setTimeout(function () {
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
    getCookies();
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
        });
    }
}


function makeXHSProfileBar() {
    getCookies();
    const id_div = $('.interaction-container');
    // 获取当前页的用户URL
    const account_url = 'https://www.xiaohongshu.com' + $(".username").closest('a').attr('href');
    // 清除#jjc_xhs_product元素
    id_div.find('#jjc_xhs_product').remove();

    getHtmlTemplate('jjc_xhs_product').then(function (html) {
        id_div.prepend(html);
        // 确保#logo在DOM中存在后再设置src
        getSrcUrl("src/16.png").then(function (src) {
            const logoElement = $('#logo');
            if (logoElement.length) {
                logoElement.attr('src', src);
            } else {
                console.error("#logo 元素未找到");
            }
        });

        FetchAccountPromotionData(account_url).then(function (data) {
            if (data.status === "success") {
                $("#has_promotion_a")
                    .text(data.message) // 修改文本内容
                    .addClass("text-danger") // 添加 Bootstrap 的 `text-danger` 类
                    .attr("href", data.href); // 设置 href 属性
            } else {
                $("#has_promotion_a").text(data.message).addClass("text-green");
            }
        })

        var url = OuterApi.lizhi;
        initClickEvent();


        FetchGetRequest(url).then(function (data) {
            $("#say_what").text(data.data.zh);
        });
        // 调用示例

    });
}

function makeContainerBar() {
    getCookies();
    const id_div = $('.interaction-container');
    // 获取当前页的用户URL
    const account_url = 'https://www.xiaohongshu.com' + $(".username").closest('a').attr('href');
    // 清除#jjc_xhs_product元素
    id_div.find('#xhs_container').remove();
    console.log(account_url);
    getHtmlTemplate('xhs_container').then(function (html) {
        id_div.prepend(html);
        // 确保#logo在DOM中存在后再设置src
        FetchAccountPromotionData(account_url).then(function (data) {
            if (data.status === "success") {
                $("#has_promotion_a")
                    .text(data.message) // 修改文本内容
                    .addClass("text-danger") // 添加 Bootstrap 的 `text-danger` 类
                    .attr("href", data.href); // 设置 href 属性
            } else {
                $("#has_promotion_a").text(data.message).addClass("text-green");
            }
        })
    });
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
