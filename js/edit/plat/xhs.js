function initXhsExe() {
    const url = window.location.href;
    if (url.includes('search_result')) {
        makeXhsBar();
    } else if (url.endsWith('/explore')) {
        makeXhsBar();
    } else if (url.includes('channel_type')) {
        makeXhsBar();
    } else if (url.includes('user/profile')) {
        handleProfilePage();
    } else {
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
    const userPageContainer = $("#userPageContainer")
    const account_url = window.location.href;

    userPageContainer.find('#xhs_container').remove();
    getHtmlTemplate('xhs_container').then(function (html) {
        container.after(html);
        // 确保#logo在DOM中存在后再设置src
        FetchAccountPromotionData(account_url).then(function (data) {
            $('#has_promotion_a').html(data.message)
        })
    });
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
            initClickEvent();
        });
    }
}


function makeXHSProfileBar() {
    // getCookies();
    const id_div = $('.interaction-container');
    console.log("测试")
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
            $('#has_promotion_a').html(data.message)
        })

        initClickEvent();
        // 调用示例

    });
}

function makeContainerBar() {
    // getCookies();
    const id_div = $('.interaction-container');
    // 获取当前页的用户URL
    const account_url = 'https://www.xiaohongshu.com' + $(".username").closest('a').attr('href');
    // 清除#jjc_xhs_product元素
    id_div.find('#xhs_container').remove();
    getHtmlTemplate('xhs_container').then(function (html) {
        id_div.prepend(html);
        // 确保#logo在DOM中存在后再设置src
        FetchAccountPromotionData(account_url).then(function (data) {
            $('#has_promotion_a').html(data.message)
        })
    });
}

