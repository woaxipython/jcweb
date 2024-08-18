function initExecute() {
    var currentURL = window.location.href;
    // 读取保存到本地存储中的token
    chrome.storage.local.get('token', function (result) {
        var token = result.token;
        if (isTokenExpired(token)) {
            const isXHSHome = currentURL.includes('xiaohongshu');
            if (isXHSHome) {
                initXhsExe();
            }
        }
        InitListener()
    });
}

function InitListener() {

    // 添加点击或变动事件
    $("#initButton").on('click', function () {
        initButtonClick()
    });
    $("#analyzeButton").on('click', function () {
        analyzeButton()
    });
    $('input.linkCheck').change(function () {
        changeInputValue(this)
    });
    $('#CheckAllLink').change(function () {
        initButtonClick();
        changeAllInputValue(this)
    });
}

function getSelectedLinks(productName) {
    var checkedInputs = $('input.linkCheck:checked');
    var selectedLinks = [];

    for (var i = 0; i < checkedInputs.length; i++) {
        var selectedLink = [];
        selectedLink.push(productName);
        selectedLink.push(checkedInputs[i].value);
        selectedLinks.push(selectedLink);
    }
    return selectedLinks;
}


function changeInputValue(element) {
    var href, currentURL, base_url, $element;
    currentURL = window.location.href;
    if (currentURL.includes('xiaohongshu')) {
        base_url = 'https://www.xiaohongshu.com';
    } else if (currentURL.includes('douyin')) {
        base_url = 'https://www.douyin.com';
    } else if (currentURL.includes('bilibili')) {
        base_url = 'https://www.bilibili.com';
    }
    $element = $(element);
    if ($element.is(':checked')) {
        href = $element.closest('section').find('a').attr('href');
        $element.val(base_url + href);
    } else {
        $element.val('');
    }
}

function initButtonClick() {
    // 点击卡片时，弹出输入框以获取产品名称
    var currentURL = window.location.href;
    if (currentURL.includes('xiaohongshu')) {
        makeXhsTitle();
    } else if (currentURL.includes('douyin')) {
        douyin();
    } else if (currentURL.includes('bilibili')) {
        bilibili();
    }
}

function changeAllInputValue(element) {
    var $element = $(element);
    var isChecked = $element.is(':checked');
    $('input.linkCheck').each(function () {
        if ($(this).prop('checked') !== isChecked) {
            $(this).prop('checked', isChecked).trigger('change');
        }
    });
}

// 监听鼠标滚动事件
function executeOnScroll(callbackFunction) {
    let scrollTimeout;
    const delay = 1; // 滚动停止后重新监听的时间间隔

    // 监听滚动事件
    window.addEventListener('scroll', onScrollOrWheel);
    // 监听鼠标滚轮事件
    window.addEventListener('wheel', onScrollOrWheel);

    function onScrollOrWheel() {
        // 执行回调函数
        callbackFunction();

        // 清除之前的计时器
        clearTimeout(scrollTimeout);

        // 设置新的计时器，在滚动停止后重新监听
        scrollTimeout = setTimeout(() => {
            // 滚动停止后的逻辑
        }, delay);
    }
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


function JsonRequest(api, data) {
    // var url = "http://1.14.138.236" + api;
    // var url = "http://1.14.138.236" + api;
    var url = "https://wanming.site" + api;
    console.log(url);

    return generateHmac(data.your_data_field).then(hmac => {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                headers: {
                    "X-HMAC": hmac,
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                    // "Referer": "http://1.14.138.236/"
                },
                success: function (response) {
                    resolve(response);
                },
                error: function (xhr, status, error) {
                    // 尝试解析响应中的 JSON 并提取错误信息
                    try {
                        var errorResponse = JSON.parse(xhr.responseText);
                        reject(errorResponse.message);
                    } catch (e) {
                        console.log("An error occurred", xhr);
                        reject("An error occurred");
                    }
                }
            });
        });
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
    const allowedHosts = ['www.xiaohongshu.com', 'www.bilibili.com','www.douyin.com'];
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

function makeLink(productName, linkUrl, cookies,com=true,comment=false,) {
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






