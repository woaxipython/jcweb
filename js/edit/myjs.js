function initExecute() {
    var currentURL = window.location.href;
    // 读取保存到本地存储中的token
    getChromeStorageValues(['token'], function (result) {
        var token = result.token;
        // 调用函数以启用功能
        if (isTokenExpired(token)) {
            const isXHSHome = currentURL.includes('xiaohongshu');
            if (isXHSHome) {
                initXhsExe();
            }
        }

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

function hasComment(linkUrl, cookies) {
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
            "linkUrl": linkUrl,
            "userName": userName,
        }
        saveComment(linkInfo, cookies, hostname);
    });
}


function getChromeStorageValues(keys, callback) {
    chrome.storage.local.get(keys, function (result) {
        callback(result);
    });
}

function makeComments() {
// 获取当前页链接
    var currentURL = window.location.href;
    if (currentURL.includes('xiaohongshu')) {
        make_xhs_comments();
    } else if (currentURL.includes('douyin')) {
        make_xhs_comments();
    } else if (currentURL.includes('bilibili')) {
        make_xhs_comments();
    }
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
    $(".makeComments").on('click', function () {
        makeComments()
    })
    $("#showBoomTable").on('click', function () {
        makeBoomTable();
    })
}


function showSelectionIconAndText() {
    let debounceTimer;
    document.addEventListener('selectionchange', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const selectedText = window.getSelection().toString().trim();
            const existingIcons = document.querySelectorAll('#save_comment');
            existingIcons.forEach(icon => icon.remove());
            if (selectedText) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const rect = selection.getRangeAt(0).getBoundingClientRect();
                    getHtmlTemplate('save_comments').then(function (html) {
                        html.style.position = 'absolute';
                        html.style.top = `${rect.bottom + window.scrollY}px`;
                        html.style.left = `${rect.left + window.scrollX}px`;
                        html.style.zIndex = '1000';
                        document.body.appendChild(html);
                    });
                }
            }
        }, 200); // 调整时间间隔为200毫秒
    });
}

function ChangeProgress(textId, progress) {
    var progress = progress + 10
    var testSpan = $(textId)
    testSpan.closest(".progress-bar").css("width", progress + "%");
}


function makeBoomTable() {
    var data = {
        'your_data_field': OwnFlaskApi.boomtable
    }
    JsonRequest(OwnFlaskApi.boomtable, data).then(function (data) {
// 假设 data.data 是一个数组，每个元素都是一个对象
        let tableData;
        try {
            tableData = JSON.parse(data.data);
        } catch (e) {
            console.error("解析 JSON 失败:", e);
            return;
        }
        console.log(tableData)
        const tableBody = $("#BoomTable tbody");

        // 清空当前表格内容
        tableBody.empty();

        // 遍历数据并生成表格行
        tableData.forEach(function (rowData) {
            const row = $("<tr></tr>");

            const title_cell = $("<td></td>");

            const div1 = $("<div></div>")
                .css("width", "350px")
                .addClass("text-truncate d-flex justify-content-start");

            const link = $("<a></a>")
                .attr("href", rowData.link)
                .attr("data-bs-trigger", "hover")
                .attr("data-bs-toggle", "popover")
                .attr("title", "跟踪记录")
                .attr("data-bs-content", rowData.remarks_info ? rowData.remarks_info.replace(/\n/g, '&#10') : "暂无备注")
                .attr("data-bs-placement", "top")
                .attr("target", "_blank")
                .append($("<span></span>").text(rowData.title));

            div1.append(link);

            title_cell.append(div1);

            const div2 = $("<div></div>")
                .css("width", "350px")
                .addClass("text-truncate d-flex justify-content-start");

            const contentSmall = $("<small></small>")
                .addClass("text-muted")
                .append($("<span></span>").text("  "));

            if (rowData.remarks_new) {
                const remarksSmall = $("<small></small>")
                    .append($("<span></span>").text(rowData.remarks_user + ": "))
                    .append($("<span></span>").text(rowData.remarks_new))
                    .append($("<span></span>").text(rowData.remarks_time));

                contentSmall.append(remarksSmall);
            }

            div2.append(contentSmall);
            title_cell.append(div2);

            row.append(title_cell);

            const liked_cell = $("<td></td>");
            const liked_small = $("<small></small>").text(rowData.liked);
            liked_cell.append(liked_small);
            row.append(liked_cell);

            const commented_cell = $("<td></td>");
            const commented_small = $("<small></small>").text(rowData.commented);
            commented_cell.append(commented_small);
            row.append(commented_cell);

            const goods_cell = $("<td></td>");
            const goods_small = $("<small></small>").text(rowData.goods);
            goods_cell.append(goods_small);
            row.append(goods_cell);

            const user_cell = $("<td></td>");
            const user_small = $("<small></small>").text(rowData.user);
            user_cell.append(user_small);
            row.append(user_cell);

            const plat_cell = $("<td></td>");
            const plat_small = $("<small></small>").text(rowData.plat);
            plat_cell.append(plat_small);
            row.append(plat_cell);

            const date_cell = $("<td></td>");
            const date_small = $("<small></small>").text(rowData.date);
            date_cell.append(date_small);
            row.append(date_cell);

            // 将行添加到表格主体
            tableBody.append(row);
        });
        // 初始化所有的 popover
        $(function () {
            $('[data-bs-toggle="popover"]').popover();
        });


        // 显示模态框
        $("#boom_pv_modal").modal('show');
        $('#BoomTable').DataTable({
            "paging": true,
            "lengthChange": false,
            "searching": false,
            "ordering": true,
            "order": [[2, "desc"], [3, "desc"]],
            "lengthMenu": [[10, 20, -1], ["10", "20", "全部"]], // 设置显示entries的选项和对应的文本
            "columnDefs": [
                {"orderable": false, "targets": [0]},// 指定第一列不进行排序，索引从0开始
            ],
            language: {
                info: '共计 _TOTAL_ 条推广数据',
                search: "搜索：",  // 修改搜索框前的文字
                searchPlaceholder: "输入关键词搜索", // 修改搜索框的placeholder
                lengthMenu: "每页显示 _MENU_ 条数据",
                paginate: {
                    next: '下一页',
                    previous: '上一页',
                    first: '首页',
                    last: '尾页'
                },

                zeroRecords: '没有找到符合条件的数据',
                infoEmpty: '没有符合条件的数据',
                infoFiltered: '(从 _MAX_ 条数据中过滤)'

            },
        });
    });
}