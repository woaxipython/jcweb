const baseUrls = {
    // remote: "https://wanming.site",
    remote: "http://127.0.0.1:5000",
};
const OuterApi = {
    "lizhi": 'https://api.vvhan.com/api/dailyEnglish?type=sj'
}

const OwnFlaskApi = {
    login: `${baseUrls.remote}/web_exe_api/login`,
    saveCookie: `${baseUrls.remote}/web_exe_api/save_cookies`,
    saveLink: `${baseUrls.remote}/web_exe_api/save_links`,
    saveSuggestKeyWord: `${baseUrls.remote}/web_exe_api/save_suggest_keyword`,
    makeAIComment: `${baseUrls.remote}/web_exe_api/make_ai_comment`,
    getExeData: `${baseUrls.remote}/web_exe_api/get_exe_data`,


    changeBrand: `${baseUrls.remote}/web_exe_api/changeBrand`,
    changeBrandFile: `${baseUrls.remote}/web_exe_api/changeBrandFile`,


    saveHotComment: `${baseUrls.remote}/web_exe_api/save_hot_comment`,

};