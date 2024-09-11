function loginFlask(api, data) {
    JsonRequest(api, data)
        .then(handleLoginResult)
        .catch(showError);
}

function handleLoginResult(result) {
    if (result.status === "success") {
        saveUserData(result.user, result.token)
            .then(() => {
                alert(`${result.user} 登录成功`);
                clearContextMenus();
            });
    } else {
        alert(`登录失败：${result.message}`);
    }
}

function saveUserData(userName, token) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({user_name: userName, token: token}, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}

function clearContextMenus() {
    chrome.contextMenus.removeAll(() => {
        if (chrome.runtime.lastError) {
            console.error(`Error removing context menus: ${chrome.runtime.lastError}`);
        } else {
            reloadCurrentTab();
        }
    });
}

function reloadCurrentTab() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.reload(tabs[0].id);
        }
    });
}

function showError(error) {
    alert(`错误：${error}`);
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

function saveSuggestKeyWord(linkUrl) {
    const url = new URL(linkUrl);
    const hostname = url.hostname;
    // 获取api
    getChromeStorageValues(["user_name"], function (result) {
        const userName = result.user_name;
        if (!userName) {
            console.log("没有登录，不能保存关联词")
            return;
        }
        const api = OwnFlaskApi.saveSuggestKeyWord;
        observeSugContainer(function (text_list) {

            const data = {
                "text_list": text_list,
                "your_data_field": api,
                "userName": userName,
                "hostname": hostname
            }
            JsonRequest(api, data)
                .then(function (result) {
                    console.log(result.message);
                })
                .catch(function (error) {
                    alert(error);
                });
        });


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

function FetchExeData() {
    return new Promise((resolve, reject) => {
        getChromeStorageValues(["user_name"], function (result) {
            const userName = result.user_name;
            if (!userName) {
                console.log("没有登录，不能保存关联词");
                reject("没有登录");
                return;
            }
            const api = OwnFlaskApi.getExeData;
            const data = {
                "username": userName,
                "your_data_field": api,
            };
            JsonRequest(api, data)
                .then(function (result) {
                    resolve(result); // 返回数据
                })
                .catch(function (error) {
                    alert(error);
                    reject(error);
                });
        });
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