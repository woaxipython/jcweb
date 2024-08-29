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
    // 获取api
    const api = OwnFlaskApi.saveLink;
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


function FetchGetRequest(url) {
    return GetRequestWithoutApi(url)
        .then(function (data) {
            return data; // 返回数据
        })
        .catch(function (error) {
            console.error(error);
            throw error; // 抛出错误以便调用者处理
        });
}

function saveHotComment(comment, user_name) {
    const api = OwnFlaskApi.saveHotComment;
    const data = {
        "comment": comment,
        "user_name": user_name,
        "your_data_field": api,
    };
    JsonRequest(api, data)
        .then(function (result) {
            alert(result.message);
        })
        .catch(function (error) {
            alert(error);
        });

}

function GetAiComment(article, comment, keyword = "万明") {
    // 获取api
    const api = OwnFlaskApi.makeAIComment;
    const data = {
        "article": article,
        "comment": comment,
        "keyword": $('<keyword>').text(keyword).prop('outerHTML'),
        "your_data_field": api,
    };
    JsonRequest(api, data)
        .then(function (result) {
            if (result.status === "success") {
                var message = result.message;
                alert(message);
            } else {
                alert(result.message);
            }
        })
        .catch(function (error) {
            alert(error);
        });

}