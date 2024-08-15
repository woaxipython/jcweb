function makeCard() {
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
            <div class="row row-cards">
                <div class="row  align-items-center my-3">
                    <div class="col-2 ps-0">
                        <button id="initButton" class="btn btn-outline-primary form-control" style="">
                            初始化
                        </button>
                    </div>
                    <div class="col-2 ps-0">
                        <button id="analyzeButton" class="btn btn-outline-primary form-control" style="">
                            分析当前页
                        </button>
                    </div>
                </div>
            </div>
            <div class="row row-cards">
                <div class="row  align-items-center">
                    <div class="form-check col-2">
                        <input type="checkbox" class="form-check-input" id="CheckAllLink">
                        <label class="custom-control-label" for="customCheck1">全选当前页所有图文</label>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>
    `
};

function makeCheckBox() {
    return `
            <div class="form-check col-auto">
            <input type="checkbox" class="form-check-input linkCheck" id="customCheck1">
            <label class="custom-control-label" for="customCheck1">选择当前图文</label>
        </div>
    `
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