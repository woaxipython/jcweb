function JsonRequest(url, data) {
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


function GetFlaskRequest(url, data) {
    return generateHmac(data.your_data_field).then(hmac => {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                type: "GET",
                data: data,
                contentType: "application/json",
                headers: {
                    "X-HMAC": hmac,
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                },
                success: function (response) {
                    resolve(response);
                },
                error: function (xhr, status, error) {
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

function GetRequestWithoutApi(url) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: url,
            type: "GET",
            contentType: "application/json",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json",
            },
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
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
}

