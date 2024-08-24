function initExecute() {
    var currentURL = window.location.href;
    // 读取保存到本地存储中的token
    getChromeStorageValues(['token'], function (result) {
        var token = result.token;
        if (isTokenExpired(token)) {
            const isXHSHome = currentURL.includes('xiaohongshu');
            if (isXHSHome) {
                initXhsExe();
            }
            InitListener()
        }

    });
}

function InitListener() {
    $(".analyzeButton").on('click', function () {
        analyzeButton()
    });

}

// 监听URL变动事件
function onUrlChange(callbackFunction) {
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            callbackFunction();
        }
    }).observe(document, {subtree: true, childList: true});
}

function analyzeButton() {
    // 点击卡片时，弹出输入框以获取产品名称
    var currentURL = window.location.href;
    if (currentURL.includes('xiaohongshu')) {
        xhs();
    } else if (currentURL.includes('douyin')) {
        douyin();
    } else if (currentURL.includes('bilibili')) {
        bilibili();
    }
}

function generateHmac(data) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(123456);
    const dataToSign = encoder.encode(data);

    return crypto.subtle.importKey(
        "raw",
        keyData,
        {name: "HMAC", hash: "SHA-256"},
        false,
        ["sign"]
    ).then(key => {
        return crypto.subtle.sign("HMAC", key, dataToSign);
    }).then(signature => {
        return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
    });
}


function isTokenExpired(token) {
    // 如果token==undefined,则返回false
    if (token == undefined) {
        return false;
    }
    try {
        // 解码JWT
        var decoded = KJUR.jws.JWS.parse(token);
        var payloadObj = JSON.parse(decoded.payloadPP);

        // 获取当前时间的时间戳
        var currentTime = Math.floor(Date.now() / 1000);
        // 判断令牌是否过期,过期返回false
        if (payloadObj.exp > currentTime) {
            console.log("Token is expired");
            return true;
        } else {
            console.log("Token is valid");
            return false;
        }
    } catch (e) {
        console.error("Invalid token", e);
        return true;
    }
}


function reloadCurrentTab() {
    window.location.reload();
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (tabs.length > 0) {
            chrome.tabs.reload(tabs[0].id);
        }
    });
}

function isHostAllowed(linkUrl) {
    const allowedHosts = ['www.xiaohongshu.com', 'www.bilibili.com', 'www.douyin.com'];
    const url = new URL(linkUrl);
    return allowedHosts.includes(url.hostname);
}

function notPrompt(productName) {
    if (!productName) {
        alert('Product name input was cancelled or empty.');
        return true;
    }
    return false;
}

function makeLink(productName, linkUrl, cookies, com = true, comment = false,) {
    if (notPrompt(productName)) {
        return;
    }
    const url = new URL(linkUrl);
    const hostname = url.hostname;

    if (!isHostAllowed(linkUrl)) {
        alert('The host of the link URL is not allowed: ' + hostname);
        return;
    }

    getChromeStorageValues(["user_name"], function (result) {
        const userName = result.user_name;
        if (!userName) {
            alert('请先登录.');
            return;
        }
        const linkInfo = {
            "productName": productName,
            "linkUrl": linkUrl,
            "userName": userName,
            "com": com,
            "comment": comment

        }
        saveLink(linkInfo, cookies, hostname);
    });
}


function getChromeStorageValues(keys, callback) {
    chrome.storage.local.get(keys, function (result) {
        callback(result);
    });
}


function showModal(element_id) {
    // 先关闭之前的所有模态框
    $('.modal').modal('hide');
    // 显示模态框
    var $element = $('#' + element_id);
    $element.modal('show');
}

function initClickEvent() {
    $("#InputChangeBrand").on('click', function () {
        InputChangeBrand();
    });
    $("#changeBrandFile").on('click', function () {
        changeBrandFile(this);
    });
    $("#changeBrand").on('click', function () {
        changeBrand();
    });
    $("#showFileChangeBrandModal").on('click', function () {
        showModal('FileBrandModal');
    });
    $("#showBrandModal").on('click', function () {
        showModal('BrandModal');
    });
}



