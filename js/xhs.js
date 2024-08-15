function xhs() {
    // alert('当前URL为：' + window.location.href);
    // 此时只判断的当前的URL链接是包含"xiaohongshu"的，但是不确认是哪个页面
    // 1. 所以需要判断一下当前页面是哪个框架
    // 如果是search页面，那么就判断是否包含"search"，如果包含，那么就执行下面的代码
    // 首先，弹出弹框“请登录小红书后使用本插件，否则数据有可能不准确”
    alert('请登录小红书后使用本插件，否则数据有可能不准确')
    // 1. 判断是否为搜索页面
    const currentURL = window.location.href;
    if (currentURL.includes('search_result')) {
        //     search页面的URL格式为：https://www.xiaohongshu.com/search_result?keyword=%25E9%259E%258B%25E8%2583%25B6&source=web_explore_feed
        //     此时为search页面，弹出弹框
        // alert("已经进入到search页面")
        // 计算当前页下.feeds-container中secction的数量
        var section_count = $('.feeds-page .feeds-container section').length;
        alert("当前页面下有" + section_count + "个section")

    }else{
        //     不是search页面，弹出弹框
        alert("当前页面不是search页面")
        var section_count = $('.feeds-page .feeds-container section').length;
        alert("当前页面下有" + section_count + "个section")
    }

}