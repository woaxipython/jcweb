$(document).ready(function () {
    $('#getCookiesButton').click(function () {
        chrome.runtime.sendMessage({action: 'getCookies'}, response => {
            if (response && response.cookies) {
                const cookies = response.cookies;
                cookies.your_data_field = cookies.a1;

                const cookiesText = JSON.stringify(cookies, null, 2);
                console.log('Cookies:', cookiesText);

                // 将 cookie 信息发送到服务器
                var api = "/web_exe_api/get_cookies";
                JsonRequest(api, cookies)
                    .then(function (result) {
                        if (result.git === "success") {
                            alert("保存成功：" + result.message);
                        } else {
                            alert("保存失败：" + result.message);
                        }
                    })
                    .catch(function (error) {
                        alert("请求失败：" + error);
                    });
            } else {
                alert("无法获取 cookies。");
            }
        });
    });

    $("#loginExeButton").on("click", function () {
        $("body").css({
            "width": "500px",
            "height": "500px"
        });
        $("#loginModal").modal('show');
        // 监听模态框关闭事件
        $('#loginModal').on('hidden.bs.modal', function () {
            $("body").css({
                "width": "",
                "height": ""
            });
        });
    });
    $("#outExeButton").on("click", function () {
        // 点击退出后，将保存在chrome中的token删除
        chrome.storage.local.remove('token', function () {
            alert("退出成功");
            reloadCurrentTab();
        });
    });
    // 登录到服务器
    $("#submitLogin").on("click", function () {
        var api = "/web_exe_api/login"
        const username = $('input[name="webExeName"]').val();
        const password = $('input[name="webExePassword"]').val();
        if (!username || !password) {
            alert("用户名和密码不能为空");
            return;
        }
        var data = {
            "username": username,
            "password": password,
            "your_data_field": password
        }
        loginFlask(api, data)
        $("#loginModal").modal('hide');
    });
    getChromeStorageValues(['token', 'user_name'], function (result) {
        var token = result.token;
        var userName = result.user_name;
        if (!token) {
            $("#loginExeButton").text("登录");
        } else {
            if (isTokenExpired(token)) {
                $("#loginExeButton").text(userName);
            } else {
                $("#loginExeButton").text("登录已过期");
            }
        }
    });

    function getSpecificCookiesForActiveTab(callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            if (tabs.length === 0) return; // 如果没有活动标签，则返回
            const tab = tabs[0];
            const url = new URL(tab.url);

            // 获取特定的cookie
            const cookieNames = ['a1', 'web_session'];
            let cookiesData = {};

            cookieNames.forEach(function (name) {
                chrome.cookies.get({url: url.origin, name: name}, function (cookie) {
                    if (cookie) {
                        cookiesData[name] = cookie.value;
                    }
                    // 检查是否已获取所有指定cookie
                    if (Object.keys(cookiesData).length === cookieNames.length) {
                        callback(cookiesData);
                    }
                });
            });
        });
    }

});

