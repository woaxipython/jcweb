$(document).ready(function () {
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
        // 点击退出后，清空Chrome存储中的所有数据
        chrome.storage.local.clear(function () {
            // 清除所有上下文菜单
            chrome.contextMenus.removeAll(function () {
                if (chrome.runtime.lastError) {
                    console.error(`Error removing context menus: ${chrome.runtime.lastError}`);
                } else {
                    alert("退出成功");
                    reloadCurrentTab();
                }
            });
        });
    });

    function reloadCurrentTab() {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.reload(tabs[0].id);
            }
        });
    }


    // 登录到服务器
    $("#submitLogin").on("click", function () {
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
        loginFlask(OwnFlaskApi.login, data)
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

});

