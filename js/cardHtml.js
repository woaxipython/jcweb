function makeCard() {
    return `
        <div class="card custom-header">
            <div class="card-title">
                <div class="row">
                    <h3 class="card-title">景景查</h3>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="form-check col-auto">
                        <input type="checkbox" class="form-check-input" id="customCheck1">
                        <label class="custom-control-label" for="customCheck1">全选</label>
                    </div>
                    <div class="col-auto">
                        <button id="analyzeButton" class="btn btn-outline-primary" style="margin-left: 20px;">分析当前页</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
function makeCheckBox(){
    return `
            <div class="form-check col-auto">
            <input type="checkbox" class="form-check-input" id="customCheck1">
            <label class="custom-control-label" for="customCheck1">选择当前图文</label>
        </div>
    `
}