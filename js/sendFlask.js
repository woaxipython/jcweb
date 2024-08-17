function loginFlask(api, data) {
    JsonRequest(api, data)
        .then(function (result) {
            if (result.status === "success") {
                // 登录成功后保存token和user_name到本地存储
                chrome.storage.local.set({
                    user_name: result.user,
                    token: result.token
                }, () => {
                    console.log('user_name and token saved successfully');
                    alert(`${result.user} 登录成功`);
                    // 退出成功刷新当前页面，而不是popup页面
                    reloadCurrentTab();
                });

            } else {
                alert("登录失败：" + result.message);
            }
        })
        .catch(function (error) {
            alert(error)
        })
}


function saveLink(linkLists, cookies, hostname) {
    const api = "/web_exe_api/save_links";
    const data = {
        "links": linkLists,
        "your_data_field": api,
        "cookies": {
            "a1": cookies.a1,
            "web_session": cookies.web_session,
        },
        "hostname": hostname,

    };
    // 获取a1
    // 将cookie信息发送到服务器
    JsonRequest(api, data)
        .then(function (result) {
            if (result.status === "success") {
                alert("保存成功：" + result.message);
            } else {
                alert("保存失败：" + result.message);
            }
        })
        .catch(function (error) {
            alert(error);
        });
}



