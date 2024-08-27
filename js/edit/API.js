const baseUrls = {
    // remote: "https://1.14.138.236",
    remote: "http://127.0.0.1:5000",
};
const OuterApi = {
    "lizhi": 'https://api.vvhan.com/api/dailyEnglish?type=sj'
}

const OwnFlaskApi = {
    login: `${baseUrls.remote}/web_exe_api/login`,
    saveCookie: `${baseUrls.remote}/web_exe_api/save_cookies`,
    saveLink: `${baseUrls.remote}/web_exe_api/save_links`,
    makeAIComment: `${baseUrls.remote}/web_exe_api/make_ai_comment`,
};