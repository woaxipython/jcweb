function getHtmlTemplate(templateId) {
    return fetch(chrome.runtime.getURL('html/template.html'))
        .then(response => response.text())
        .then(data => {
            var $html = $('<div>').append($.parseHTML(data)); // 创建一个容器来解析HTML字符串
            var $content = $html.find(`#${templateId}`);
            if ($content.length === 0) {
                throw new Error(`Template with ID ${templateId} not found.`);
            }

            return $content.get(0); // 返回完整的DOM元素
        })
        .catch(error => {
            console.error('Error loading HTML template:', error);
            return null;
        });
}

function getSrcUrl(src) {
    return new Promise((resolve) => {
        resolve(chrome.runtime.getURL(src));
    });
}


function makeXHSProfileCard() {
    return `
    <div class="page-wrapper pb-3 border-bottom" id="jjc_app">
    <div class="page-header d-print-none">
        <div class="container-xl mx-0">
            <div class="row g-2 align-items-center">
                <div class="col-6">
                    <h2 class="page-title">
                        景景查
                    </h2>
                </div>

            </div>
        </div>
    </div>
    <div class="page-body">
        <div class="container-xl">
            <div class="row-cards">
                <div class="row align-items-center my-3">
                    <div class="col-2 col-sm-6 ps-0">
                        <button id="initButton" class="btn btn-outline-primary form-control" style="">
                            初始化
                        </button>
                    </div>
                    <div class="col-2 col-sm-6 ps-0">
                        <button id="analyzeButton" class="btn btn-outline-primary form-control" style="">
                            分析当前页
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>

</div>`
}

function makeXHSUserCard() {
    return `
    <div class="page-wrapper pb-3 border-bottom" id="jjc_app">
    <div class="page-header d-print-none">
        <div class="container-xl mx-0">
            <div class="row g-2 align-items-center">
                <div class="col-6">
                    <h2 class="page-title">
                        景景查
                    </h2>
                </div>

            </div>
        </div>
    </div>
    <div class="page-body">
        <div class="container-xl">
            <div class="row-cards">
                <div class="row align-items-center my-3">
                    <div class="col-2 ps-0">
                        <button id="analyzeButton" class="btn btn-outline-primary form-control" style="">
                            分析当前个人页信息
                        </button>
                    </div>
                </div>
            </div>
            
        </div>
    </div>

</div>`
}