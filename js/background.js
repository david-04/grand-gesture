importScripts("./purify.js");
importScripts("./gbk.js");

const devMode = false;
let config, defaultConf, _SYNC, browserType, timerSaveConf;
let localConfig;
let alarmCounter = 0;

//check browser
if (navigator.userAgent.toLowerCase().indexOf("firefox") !== -1) {
    browserType = "fx";
} else if (navigator.userAgent.toLowerCase().indexOf("edge") !== -1) {
    browserType = "msg";
} else {
    browserType = "cr";
}
if (browserType !== "cr") {
    chrome = browser;
    chrome.storage.sync = chrome.storage.local;
}

var getDefault = {
    i18n: str => {
        var _i18n = chrome.i18n.getMessage(str);
        return _i18n ? _i18n : str;
        //msg cant return chrome.i18n.getMessage("");
    },
    value: () => {
        var config = {
            version: 46,
            plus: {},
            apps: {
                appslist: {
                    n_closebox: true,
                },
            },
            general: {
                settings: {
                    timeout: true,
                    timeoutvalue: 2000,
                    timeout_nomenu: true,
                    minlength: 10,
                    autosave: true,
                    icon: true,
                    theme: "colorful",
                    notif: false,
                    appnotif: false,
                    esc: true,
                },
                fnswitch: {
                    fnmges: true,
                    fnsdrg: true,
                    fndrg: false,
                    fnrges: false,
                    fnwges: false,
                    fnpop: false,
                    fnicon: false,
                    fnctm: false,
                    fndca: false,
                },
                engine: {
                    txtengine: [
                        { name: "Google", content: "https://www.google.com/search?q=%s" },
                        { name: "Bing", content: "https://www.bing.com/search?q=%s" },
                    ],
                    imgengine: [
                        { name: "Google Images", content: "https://lens.google.com/uploadbyurl?url=%s" },
                        { name: "Bing Images", content: "https://www.bing.com/images/search?q=imgurl:%s" },
                    ],
                },
                script: {
                    script: [
                        { name: "Test Script 1", content: "alert('Test script 1')" },
                        { name: "Test Script 2", content: "alert('Test script 2')" },
                    ],
                },
                linux: {
                    cancelmenu: true,
                },
                sync: {
                    autosync: true,
                },
                exclusion: {
                    exclusion: false,
                    exclusiontype: "black",
                    black: ["*.test.com/*"],
                    white: ["*.example.com/*"],
                },
            },
            mges: {
                settings: {
                    model: 2,
                    holdkey: "none",
                    txttourl: true,
                    lnktoimg: false,
                },
                ui: {
                    line: {
                        enable: true,
                        color: "#3369E8",
                        width: 3,
                        opacity: 90,
                    },
                    direct: {
                        enable: false,
                        color: "#8e9bd5",
                        width: 32,
                        opacity: 80,
                        style: "center",
                    },
                    tip: {
                        enable: true,
                        color: "#ffffff",
                        bgcolor: "#5677fc",
                        width: 18,
                        opacity: 80,
                        style: "follow", //center hover
                        withdir: false,
                    },
                    note: {
                        enable: true,
                        color: "#f75620",
                        opacity: 90,
                        width: 12,
                        style: "hover",
                    },
                    allaction: {
                        enable: false,
                        color: "#ffffff",
                        bgcolor: "#576f71",
                        width: 24,
                        opacity: 70,
                        style: "ui_bottom",
                    },
                },
                actions: [
                    {
                        direct: "L",
                        name: "back",
                    },
                    {
                        direct: "R",
                        name: "forward",
                    },
                    {
                        direct: "U",
                        name: "scroll",
                        mydes: { type: true, value: getDefault.i18n("init_scroll_up") },
                        selects: [{ type: "n_scroll", value: "s_up" }],
                        checks: [{ type: "n_effect", value: true }],
                    },
                    {
                        direct: "D",
                        name: "scroll",
                        mydes: { type: true, value: getDefault.i18n("init_scroll_down") },
                        selects: [{ type: "n_scroll", value: "s_down" }],
                        checks: [{ type: "n_effect", value: true }],
                    },
                    {
                        direct: "RU",
                        name: "scroll",
                        mydes: { type: true, value: getDefault.i18n("init_scroll_top") },
                        selects: [{ type: "n_scroll", value: "s_top" }],
                        checks: [{ type: "n_effect", value: true }],
                    },
                    {
                        direct: "RD",
                        name: "scroll",
                        mydes: { type: true, value: getDefault.i18n("init_scroll_bottom") },
                        selects: [{ type: "n_scroll", value: "s_bottom" }],
                        checks: [{ type: "n_effect", value: true }],
                    },
                    {
                        direct: "DL",
                        name: "newtab",
                        selects: [
                            { type: "n_optype", value: "n_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "DR",
                        name: "close",
                        mydes: { type: true, value: getDefault.i18n("init_close_current") },
                        selects: [
                            { type: "n_tab", value: "s_current" },
                            { type: "n_close_sel", value: "s_default" },
                        ],
                        checks: [
                            { type: "n_close_keep", value: false },
                            { type: "n_closePin", value: false },
                            { type: "n_closeConfirm", value: true },
                        ],
                    },
                    {
                        direct: "UL",
                        name: "switchtab",
                        mydes: { type: true, value: getDefault.i18n("init_switch_left") },
                        selects: [{ type: "n_tab_lrhl", value: "s_left" }],
                    },
                    {
                        direct: "UR",
                        name: "switchtab",
                        mydes: { type: true, value: getDefault.i18n("init_switch_right") },
                        selects: [{ type: "n_tab_lrhl", value: "s_right" }],
                    },
                    {
                        direct: "DRL",
                        name: "reopen",
                    },
                    {
                        direct: "LU",
                        name: "txtsearch",
                        selects: [
                            { type: "n_txtengine", value: "0" },
                            { type: "n_encoding", value: "s_uri" },
                            { type: "n_optype", value: "s_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "LD",
                        name: "txtsearch",
                        mydes: { type: true, value: getDefault.i18n("init_searchtxt_bg") },
                        selects: [
                            { type: "n_txtengine", value: "0" },
                            { type: "n_encoding", value: "s_uri" },
                            { type: "n_optype", value: "s_back" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "UD",
                        name: "reload",
                        mydes: { type: true, value: getDefault.i18n("init_reload_current") },
                        selects: [{ type: "n_tab", value: "s_current" }],
                        checks: [{ type: "n_reload_clear", value: false }],
                    },
                    {
                        direct: "UDU",
                        name: "reload",
                        mydes: { type: true, value: getDefault.i18n("init_reload_clear") },
                        selects: [{ type: "n_tab", value: "s_current" }],
                        checks: [{ type: "n_reload_clear", value: true }],
                    },
                    {
                        direct: "DRU",
                        name: "appslist",
                    },
                    {
                        direct: "RDLU",
                        name: "optionspage",
                    },
                ],
            },
            sdrg: {
                settings: {
                    holdkey: "ctrl",
                    holdimgkey: "alt",
                    drgbox: false,
                    drgtobox: true,
                    drgurl: true,
                    drgimg: true,
                    txt: true,
                    lnk: true,
                    img: true,
                    draggable: true,
                },
                tsdrg: [
                    {
                        direct: "L",
                        name: "txtsearch",
                        mydes: { type: true, value: getDefault.i18n("init_searchtxt_bg") },
                        selects: [
                            { type: "n_txtengine", value: "0" },
                            { type: "n_encoding", value: "s_uri" },
                            { type: "n_optype", value: "s_back" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "U",
                        name: "none",
                    },
                    {
                        direct: "R",
                        name: "txtsearch",
                        selects: [
                            { type: "n_txtengine", value: "0" },
                            { type: "n_encoding", value: "s_uri" },
                            { type: "n_optype", value: "s_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "D",
                        name: "copytxt",
                    },
                    {
                        direct: "l",
                        name: "none",
                    },
                    {
                        direct: "u",
                        name: "none",
                    },
                    {
                        direct: "r",
                        name: "none",
                    },
                    {
                        direct: "d",
                        name: "none",
                    },
                ],
                lsdrg: [
                    {
                        direct: "L",
                        name: "openlnk",
                        mydes: { type: true, value: getDefault.i18n("init_openlnk_bg") },
                        selects: [
                            { type: "n_optype", value: "s_back" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "U",
                        name: "none",
                    },
                    {
                        direct: "R",
                        name: "openlnk",
                        selects: [
                            { type: "n_optype", value: "s_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "D",
                        name: "none",
                    },
                    {
                        direct: "l",
                        name: "none",
                    },
                    {
                        direct: "u",
                        name: "none",
                    },
                    {
                        direct: "r",
                        name: "none",
                    },
                    {
                        direct: "d",
                        name: "none",
                    },
                ],
                isdrg: [
                    {
                        direct: "L",
                        name: "openimg",
                        mydes: { type: true, value: getDefault.i18n("init_openimg_bg") },
                        selects: [
                            { type: "n_optype", value: "s_back" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "U",
                        name: "none",
                    },
                    {
                        direct: "R",
                        name: "openimg",
                        selects: [
                            { type: "n_optype", value: "s_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "D",
                        name: "none",
                    },
                    {
                        direct: "l",
                        name: "none",
                    },
                    {
                        direct: "u",
                        name: "none",
                    },
                    {
                        direct: "r",
                        name: "none",
                    },
                    {
                        direct: "d",
                        name: "none",
                    },
                ],
            },
            drg: {
                settings: {
                    holdkey: "ctrl",
                    holdimgkey: "alt",
                    drgbox: false,
                    drgtobox: true,
                    drgurl: true,
                    drgimg: true,
                    txt: true,
                    lnk: true,
                    img: true,
                    draggable: true,
                },
                ui: {
                    line: {
                        enable: false,
                        color: "#008080",
                        width: 3,
                        opacity: 90,
                    },
                    direct: {
                        enable: false,
                        color: "#8e9bd5",
                        width: 32,
                        opacity: 80,
                        style: "center",
                    },
                    tip: {
                        enable: true,
                        color: "#000000",
                        bgcolor: "#cbc8f9",
                        width: 18,
                        opacity: 80,
                        style: "follow",
                        withdir: true,
                    },
                    note: {
                        enable: true,
                        color: "#f75620",
                        opacity: 90,
                        width: 12,
                        style: "hover",
                    },
                    allaction: {
                        enable: false,
                        color: "#ffffff",
                        bgcolor: "#576f71",
                        width: 24,
                        opacity: 70,
                        style: "ui_bottom",
                    },
                },
                tdrg: [
                    {
                        direct: "L",
                        name: "txtsearch",
                        mydes: { type: true, value: getDefault.i18n("init_searchtxt_bg") },
                        selects: [
                            { type: "n_txtengine", value: "0" },
                            { type: "n_encoding", value: "s_uri" },
                            { type: "n_optype", value: "s_back" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "R",
                        name: "txtsearch",
                        selects: [
                            { type: "n_txtengine", value: "0" },
                            { type: "n_encoding", value: "s_uri" },
                            { type: "n_optype", value: "s_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "LDR",
                        name: "copytxt",
                    },
                ],
                ldrg: [
                    {
                        direct: "L",
                        name: "openlnk",
                        mydes: { type: true, value: getDefault.i18n("init_openlnk_bg") },
                        selects: [
                            { type: "n_optype", value: "s_back" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "R",
                        name: "openlnk",
                        selects: [
                            { type: "n_optype", value: "s_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "LDR",
                        name: "copylnkurl",
                    },
                ],
                idrg: [
                    {
                        direct: "L",
                        name: "imgsearch",
                        mydes: { type: true, value: getDefault.i18n("init_searchimg_bg") },
                        selects: [
                            { type: "n_imgengine", value: "0" },
                            { type: "n_encoding", value: "s_uri" },
                            { type: "n_optype", value: "s_back" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "R",
                        name: "imgsearch",
                        selects: [
                            { type: "n_imgengine", value: "0" },
                            { type: "n_encoding", value: "s_uri" },
                            { type: "n_optype", value: "s_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "U",
                        name: "openimg",
                        selects: [
                            { type: "n_optype", value: "s_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "LDR",
                        name: "copyimgurl",
                    },
                ],
            },
            rges: {
                actions: [
                    {
                        name: "switchtab",
                        mydes: { type: true, value: getDefault.i18n("init_switch_right") },
                        selects: [{ type: "n_tab_lrhl", value: "s_right" }],
                    },
                    {
                        name: "switchtab",
                        mydes: { type: true, value: getDefault.i18n("init_switch_left") },
                        selects: [{ type: "n_tab_lrhl", value: "s_left" }],
                    },
                ],
            },
            wges: {
                actions: [
                    {
                        name: "none",
                    },
                    {
                        name: "none",
                    },
                    {
                        name: "switchtab",
                        mydes: { type: true, value: getDefault.i18n("init_switch_left") },
                        selects: [{ type: "n_tab_lrhl", value: "s_left" }],
                    },
                    {
                        name: "switchtab",
                        mydes: { type: true, value: getDefault.i18n("init_switch_right") },
                        selects: [{ type: "n_tab_lrhl", value: "s_right" }],
                    },
                ],
            },
            pop: {
                settings: {
                    type: "front",
                    last: false,
                },
                actions: [
                    {
                        name: "reload",
                        mydes: { type: true, value: getDefault.i18n("init_reload_current") },
                        selects: [{ type: "n_tab", value: "s_current" }],
                        checks: [{ type: "n_reload_clear", value: false }],
                    },
                    {
                        name: "newtab",
                        selects: [
                            { type: "n_optype", value: "n_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                ],
            },
            icon: {
                settings: {
                    type: "back",
                    tip: true,
                },
                actions: [
                    {
                        name: "newtab",
                        selects: [
                            { type: "n_optype", value: "n_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                ],
            },
            ctm: {
                settings: {
                    disable: true,
                    opt: true,
                    fnswitch: false,
                    homepage: true,
                },
                actions: [
                    {
                        name: "newtab",
                        selects: [
                            { type: "n_optype", value: "n_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                ],
            },
            touch: {
                settings: {
                    txttourl: true,
                    lnktoimg: false,
                },
                ui: {
                    line: {
                        enable: false,
                        color: "#808080",
                        width: 5,
                        opacity: 50,
                    },
                    direct: {
                        enable: false,
                        color: "#8e9bd5",
                        width: 32,
                        opacity: 80,
                        style: "center",
                    },
                    tip: {
                        enable: true,
                        color: "#ffffff",
                        bgcolor: "#5677fc",
                        width: 18,
                        opacity: 80,
                        style: "leftbottom",
                        withdir: false,
                    },
                    note: {
                        enable: false,
                        color: "#f75620",
                        opacity: 90,
                        width: 12,
                        style: "hover",
                    },
                    allaction: {
                        enable: false,
                        color: "#ffffff",
                        bgcolor: "#576f71",
                        width: 24,
                        opacity: 70,
                        style: "ui_bottom",
                    },
                },
                actions: [
                    {
                        direct: "DL",
                        name: "newtab",
                        selects: [
                            { type: "n_optype", value: "n_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                    {
                        direct: "DR",
                        name: "close",
                        mydes: { type: true, value: getDefault.i18n("init_close_current") },
                        selects: [
                            { type: "n_tab", value: "s_current" },
                            { type: "n_close_sel", value: "s_default" },
                        ],
                        checks: [{ type: "n_close_keep", value: false }],
                    },
                    {
                        direct: "DRL",
                        name: "reopen",
                    },
                    {
                        direct: "DRU",
                        name: "appslist",
                    },
                    {
                        direct: "RDLU",
                        name: "optionspage",
                    },
                ],
            },
            dca: {
                settings: {
                    keytype: "none",
                    hotkey: "ctrl",
                    cuskey: "",
                    confirm: false,
                    box: false,
                    selnothing: true,
                },
                actions: [
                    {
                        name: "newtab",
                        selects: [
                            { type: "n_optype", value: "n_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                    },
                ],
            },
            ksa: {
                settings: {
                    timeout: 1000,
                },
                actions: [
                    {
                        name: "newtab",
                        selects: [
                            { type: "n_optype", value: "n_new" },
                            { type: "n_position", value: "s_default" },
                        ],
                        checks: [{ type: "n_pin", value: false }],
                        codes: [78, 69, 87],
                        ctrl: false,
                        alt: false,
                        shift: false,
                    },
                ],
            },
            about: {
                donatedev: {
                    ad: true,
                },
            },
        };
        switch (navigator.language.toLowerCase()) {
            case "zh-cn":
                var OBJ = {};
                OBJ.name = "\u767e\u5ea6";
                OBJ.content = "https://www.baidu.com/s?wd=%s";
                config.general.engine.txtengine.push(OBJ);
                var imgobj = {};
                imgobj.name = "\u767e\u5ea6";
                imgobj.content = "https://image.baidu.com/pcdutu?queryImageUrl=%s";
                config.general.engine.imgengine.push(imgobj);
                break;
            case "ru":
                var OBJ = {};
                OBJ.name = "\u042f\u043d\u0434\u0435\u043a\u0441";
                OBJ.content = "https://www.yandex.com/yandsearch?text=%s";
                config.general.engine.txtengine.push(OBJ);
                break;
        }
        return config;
    },
};
defaultConf = getDefault.value();
const loadLocalConfig = async () => {
    localConfig = (await chrome.storage.local.get("local")).local;
};
const loadConfig = async (noInit, type) => {
    if (!type) {
        if (chrome.storage.sync) {
            const { sync } = await chrome.storage.local.get("sync");
            if (sync === null || sync === undefined) {
                await chrome.storage.local.set({ sync: "true" });
                type = "sync";
            } else {
                type = sync === "true" ? "sync" : "local";
            }
        } else {
            await chrome.storage.local.set({ sync: "false" });
            type = "local";
        }
    }
    if (type === "sync") {
        const items = await chrome.storage.sync.get();
        if (!items.general) {
            config = getDefault.value();
            await chrome.storage.sync.set(config);
        } else {
            config = items;
        }
    } else {
        const items = await chrome.storage.local.get();
        if (items.version && items.version < 41) {
            //for old version
            config = items;
        } else {
            if (!items.config) {
                const _obj = {};
                config = getDefault.value();
                _obj.config = config;
                await chrome.storage.local.set(_obj);
            } else {
                config = items.config;
            }
        }
    }
    await sub.init();
};

var appConfmodel = {
    rss: {
        feed: ["https://www.cnet.com/rss/news/"],
        n_optype: "s_back",
        n_position: "s_default",
        n_pin: false,
        n_closebox: false,
    },
    tablist: { n_closebox: true },
    recentbk: { n_optype: "s_back", n_position: "s_default", n_pin: false, n_num: 10, n_closebox: false },
    recentht: { n_optype: "s_back", n_position: "s_default", n_pin: false, n_num: 10, n_closebox: false },
    speaker: { n_rate: 1, n_pitch: 1, n_volume: 1, n_gender: "s_female", n_voicename: "native" },
    appslist: { n_closebox: true },
    recentclosed: { n_num: 10, n_closebox: true },
    synced: { n_closebox: true },
    jslist: { n_closebox: true },
    homepage: {
        n_optype: "s_new",
        n_position: "s_default",
        n_pin: false,
        n_closebox: true,
        n_homepage_icon: true,
        n_homepage_bg: true,
        n_homepage_resize: true,
        n_homepage_last: true,
        type: "topsites",
        sitegroup: [chrome.i18n.getMessage("homepage_groupdefault")],
        sites: [[{ title: "Grand Gesture", url: "https://github.com/david-04/grand-gesture/" }]],
        site: [{ title: "Google", url: "https://www.google.com" }],
    },
    tbkjx: { n_num: 50, n_optype: "s_new", n_position: "s_default", n_pin: false },
    extmgm: {
        n_uninstallconfirm: true,
        n_enableallconfirm: true,
        n_disableallconfirm: true,
        always: [],
    },
    notepad: {
        n_notepad_delconfirm: true,
        n_notepad_switchsave: true,
        n_notepad_last: true,
    },
    shorturl: {
        n_qr: true,
        n_suyourls: true,
        n_yourls: "",
        n_sign: "",
    },
};

var sub = {
    getCurrentTabId: async () => {
        return sub.curTab?.id ?? (await chrome.tabs.query({ active: true, currentWindow: true }))?.[0]?.id;
    },
    temp: {
        zoom: [],
    },
    cons: {
        pretab: [],
        fullstate: null,
        per_write: false,
        scroll: {},
        permissions: {},
        os: "win",
    },
    extID: chrome.runtime.id,
    checkMouseup: async () => {
        if (chrome.browserSettings?.contextMenuShowEvent) {
            browser.browserSettings.contextMenuShowEvent.set({ value: "mouseup" });
            config.general.linux.cancelmenu = false;
            sub.saveConf();
        } else if (
            browserType === "fx" &&
            (await chrome.storage.local.get("flag_mouseup")).flag_mouseup === null &&
            (sub.cons.os === "linux" || sub.cons.os === "mac")
        ) {
            sub.checkPermission(["browserSettings"], null, null, sub.getI18n("perdes_browsersettings"));
            await chrome.storage.local.set({ flag_mouseup: "true" });
        }
    },
    init: async () => {
        sub.upgrade.up();
        sub.initpers();
        sub.initIcon();
        sub.initEvent();
        config.general.fnswitch.fnctm && chrome.contextMenus ? await sub.initCTM() : null;
    },
    initEvent: () => {
        for (let i = 0; config.mges && config.mges.actions && i < config.mges.actions.length; i++) {
            if (config.mges.actions[i].name === "pretab" && !chrome.tabs.onActivated.hasListeners()) {
                chrome.tabs.onActivated.addListener(sub.handleEvent.onTabsActivated);
                break;
            }
        }
    },
    handleEvent: {
        onTabsActivated: info => {
            sub.cons.pretab.unshift(info);
        },
        onTabsRemoved: info => {},
    },
    initIcon: () => {
        if (config.general.fnswitch.fnicon) {
            chrome.action.setPopup({ popup: "" });
            if (config.icon.settings.tip) {
                chrome.action.setTitle({
                    title:
                        config.icon.actions[0].mydes &&
                        config.icon.actions[0].mydes.type &&
                        config.icon.actions[0].mydes.value
                            ? config.icon.actions[0].mydes.value
                            : sub.getI18n(config.icon.actions[0].name),
                });
            }
        } else {
            chrome.action.setPopup({ popup: "../html/popup.html" });
            chrome.action.setTitle({ title: sub.getI18n("ext_name") });
        }
    },
    nextContextMenuId: 0,
    initCTM: async () => {
        const nextId = () => `${sub.nextContextMenuId++}`;
        await chrome.contextMenus.removeAll();
        if (!config.general.fnswitch.fnctm) {
            return;
        }
        // actions
        sub.ctm = { actions: [], fn: [], menuDisable: "", menuOpt: "" };
        let hasActions = false;
        for (var i = 0; i < config.ctm.actions.length; i++) {
            var menuId = chrome.contextMenus.create({
                id: nextId(),
                contexts: ["all"],
                title:
                    config.ctm.actions[i].mydes && config.ctm.actions[i].mydes.type
                        ? config.ctm.actions[i].mydes.value
                        : sub.getI18n(config.ctm.actions[i].name),
            });
            sub.ctm.actions.push({ id: i, menuId: menuId });
            hasActions = true;
        }
        // Add to homepage
        if (config.ctm.settings.homepage) {
            sub.ctm.menuHomepage = chrome.contextMenus.create({
                id: nextId(),
                contexts: ["all"],
                title: sub.getI18n("homepage_ctm"),
            });
            hasActions = true;
        }

        // Separator
        if (hasActions && (config.ctm.settings.fnswitch || config.ctm.settings.disable || config.ctm.settings.opt)) {
            if (config.ctm.settings.disable || config.ctm.settings.opt) {
                chrome.contextMenus.create({ id: nextId(), contexts: ["all"], type: "separator" });
            }
        }

        // Options
        if (config.ctm.settings.opt) {
            sub.ctm.menuOpt = chrome.contextMenus.create({
                id: nextId(),
                contexts: ["all"],
                title: sub.getI18n("ctm_opt"),
            });
        }

        // Enable/disable features
        if (config.ctm.settings.fnswitch) {
            const parentId = nextId();
            chrome.contextMenus.create({
                id: parentId,
                contexts: ["all"],
                title: sub.getI18n("ctm_fnswitch"),
            });
            var fnArray = ["mges", "sdrg", "drg", "rges", "wges", "pop", "icon", "ctm"];
            for (var i = 0; i < fnArray.length; i++) {
                const menuId = chrome.contextMenus.create({
                    id: nextId(),
                    contexts: ["all"],
                    title: sub.getI18n(fnArray[i]),
                    type: "checkbox",
                    checked: config.general.fnswitch["fn" + fnArray[i]],
                    enabled: fnArray[i] === "ctm" ? false : true,
                    parentId,
                });
                sub.ctm.fn.push({ id: i, fnName: "fn" + fnArray[i], menuId });
            }
        }

        // Disable in this tab
        if (config.ctm.settings.disable) {
            sub.ctm.menuDisable = chrome.contextMenus.create({
                id: nextId(),
                contexts: ["all"],
                title: sub.getI18n("ctm_disable"),
            });
        }
    },
    CTMclick: async (info, tab) => {
        for (var i = 0; i < sub.ctm.actions.length; i++) {
            if (info.menuItemId === sub.ctm.actions[i].menuId) {
                var theConf = config.ctm.actions[sub.ctm.actions[i].id];
                sub.theConf = theConf;
                var selObj = {
                    lnk: info.linkUrl || "",
                    txt: info.selectionText || "",
                    img: info.srcUrl || "",
                    str: "",
                };
                sub.message = { type: "action_ctm", selEle: selObj };
                sub.initCurrent(null, sub.theConf);
                break;
            }
        }
        for (var i = 0; i < sub.ctm.fn.length; i++) {
            if (info.menuItemId === sub.ctm.fn[i].menuId) {
                var fnName = sub.ctm.fn[i].fnName;
                if (info.checked) {
                    config.general.fnswitch[fnName] = true;
                    if (fnName === "fndrg") {
                        config.general.fnswitch.fnsdrg = false;
                    }
                    if (fnName === "fnsdrg") {
                        config.general.fnswitch.fndrg = false;
                    }
                    if (fnName === "fnpop") {
                        config.general.fnswitch.fnicon = false;
                    }
                    if (fnName === "fnicon") {
                        config.general.fnswitch.fnpop = false;
                    }
                } else {
                    config.general.fnswitch[fnName] = false;
                }
                sub.saveConf();
                break;
            }
        }
        if (info.menuItemId === sub.ctm.menuOpt) {
            sub.action.optionspage();
        }
        if (info.menuItemId === sub.ctm.menuDisable) {
            await sub.action.extdisable();
        }
        if (info.menuItemId === sub.ctm.menuHomepage) {
            chrome.tabs.query({ highlighted: true, currentWindow: true }, async tabs => {
                var theFunction = () => {
                    var _appname = "homepage";
                    sub.initAppconf(_appname);
                    chrome.topSites.get(async sites => {
                        const _obj = {};
                        _obj.sites = sites;
                        _obj.listId = (await chrome.storage.local.get("homepageListId")).homepageListId;
                        _obj.ctm = tab;
                        sub.cons[_appname] = _obj;
                        await chrome.scripting.executeScript({
                            args: [_appname],
                            func: async _appname => {
                                const response = await chrome.runtime.sendMessage({
                                    type: "apps_test",
                                    apptype: _appname,
                                    value: sue.apps.enable,
                                    ctm: true,
                                    appjs: appType[_appname],
                                });
                                console.log(response);
                            },
                            injectImmediately: true,
                            target: { tabId: await sub.getCurrentTabId() },
                            world: chrome.scripting.ExecutionWorld.MAIN,
                        });
                    });
                };
                var thepers = ["topSites"];
                var theorgs;
                sub.checkPermission(thepers, theorgs, theFunction);
            });
        }
    },
    getConfValue: (type, value) => {
        var _value = "";
        for (var i = 0; i < (sub.theConf[type] ? sub.theConf[type].length : 0); i++) {
            if (sub.theConf[type][i].type === value) {
                _value = sub.theConf[type][i].value;
                break;
            }
        }
        return _value;
    },
    getConfData: (type, value) => {
        var _data;
        for (var i = 0; i < (sub.theConf[type] ? sub.theConf[type].length : 0); i++) {
            if (sub.theConf[type][i].type === value) {
                _data = sub.theConf[type][i];
                break;
            }
        }
        return _data;
    },
    getId: async value => {
        var theId = [];
        switch (value) {
            case "s_default":
                theId.push(value);
                break;
            case "s_current":
                theId.push(await sub.getCurrentTabId());
                break;
            case "s_head":
                theId.push(sub.curWin.tabs[0].id);
                break;
            case "s_last":
                theId.push(sub.curWin.tabs[sub.curWin.tabs.length - 1].id);
                break;
            case "s_left":
                if (sub.curTab.index === 0) {
                    theId.push(sub.curWin.tabs[sub.curWin.tabs.length - 1].id);
                    break;
                }
                for (var i = 0; i < sub.curWin.tabs.length && sub.curWin.tabs.length > 1; i++) {
                    if (sub.curWin.tabs[i].index === sub.curTab.index - 1) {
                        theId.push(sub.curWin.tabs[i].id);
                        break;
                    }
                }
                break;
            case "s_right":
                if (sub.curTab.index === sub.curWin.tabs.length - 1) {
                    theId.push(sub.curWin.tabs[0].id);
                    break;
                }
                for (var i = 0; i < sub.curWin.tabs.length && sub.curWin.tabs.length > 1; i++) {
                    if (sub.curWin.tabs[i].index === sub.curTab.index + 1) {
                        theId.push(sub.curWin.tabs[i].id);
                        break;
                    }
                }
                break;
            case "s_lefts_and_current":
            case "s_lefts":
                if (sub.curTab.index === 0) {
                    break;
                }
                for (var i = 0; i < sub.curWin.tabs.length && sub.curWin.tabs.length > 1; i++) {
                    if (sub.curWin.tabs[i].index < sub.curTab.index) {
                        theId.push(sub.curWin.tabs[i].id);
                    }
                }
                if (value === "s_lefts_and_current") {
                    theId.push(sub.curTab.id);
                }
                break;
            case "s_rights_and_current":
            case "s_rights":
                if (sub.curTab.index === sub.curWin.tabs.length - 1) {
                    break;
                }
                for (var i = 0; i < sub.curWin.tabs.length && sub.curWin.tabs.length > 1; i++) {
                    if (sub.curWin.tabs[i].index > sub.curTab.index) {
                        theId.push(sub.curWin.tabs[i].id);
                    }
                }
                if (value === "s_rights_and_current") {
                    theId.push(sub.curTab.id);
                }
                break;
            case "s_others":
                if (sub.curWin.tabs.length === 1) {
                    theId = [];
                    break;
                }
                for (var i = 0; i < sub.curWin.tabs.length && sub.curWin.tabs.length > 1; i++) {
                    if (sub.curWin.tabs[i].index !== sub.curTab.index) {
                        theId.push(sub.curWin.tabs[i].id);
                    }
                }
                break;
            case "s_all":
                for (var i = 0; i < sub.curWin.tabs.length; i++) {
                    theId.push(sub.curWin.tabs[i].id);
                }
                break;
        }
        return theId;
    },
    getIndex: (value, type) => {
        var _new = type === "new" ? true : false;
        var theIndex = [];
        switch (value) {
            case "s_current":
                theIndex.push(sub.curTab.index);
                break;
            case "s_default":
                theIndex.push(false);
                break;
            case "s_head":
                theIndex.push(0);
                break;
            case "s_last":
                if (_new) {
                    theIndex.push(sub.curWin.tabs.length);
                } else {
                    theIndex.push(sub.curWin.tabs.length - 1);
                }
                break;
            case "s_left":
                if (_new) {
                    theIndex.push(sub.curTab.index === 0 ? 0 : sub.curTab.index);
                    break;
                }
                theIndex.push(sub.curTab.index === 0 ? sub.curWin.tabs.length - 1 : sub.curTab.index - 1);
                break;
            case "s_right":
                if (_new) {
                    theIndex.push(
                        sub.curTab.index === sub.curWin.tabs.length - 1 ? sub.curWin.tabs.length : sub.curTab.index + 1
                    );
                    break;
                }
                theIndex.push(sub.curTab.index === sub.curWin.tabs.length - 1 ? 0 : sub.curTab.index + 1);
                break;
        }
        return theIndex;
    },
    date: {
        date: new Date(),
        get: function () {
            var _newDate =
                this.date.getFullYear().toString() +
                (this.date.getMonth() + 1 < 10
                    ? "0" + (this.date.getMonth() + 1)
                    : (this.date.getMonth() + 1).toString()) +
                (this.date.getDate() < 10 ? "0" + this.date.getDate() : this.date.getDate().toString());
            return Number(_newDate);
        },
        getTime: function () {
            return this.date.getTime();
        },
    },
    showNotif: async (type, title, txt) => {
        await chrome.notifications.create("", {
            iconUrl: "image/grand-gesture-icon-096.png",
            type: type,
            title: title,
            message: txt,
        });
    },
    initAppconf: appname => {
        if (!config.apps) {
            config.apps = {};
        }
        if (config.apps[appname]) {
            for (var i in appConfmodel[appname]) {
                if (config.apps[appname][i] === undefined) {
                    config.apps[appname][i] = appConfmodel[appname][i];
                }
            }
        } else {
            config.apps[appname] = appConfmodel[appname];
        }
    },
    insertTest: async appname => {
        await chrome.scripting.executeScript({
            args: [appname],
            func: async _appname => {
                const response = await chrome.runtime.sendMessage({
                    type: "apps_test",
                    apptype: _appname,
                    value: sue.apps.enable,
                    appjs: appType[_appname],
                });
                console.log(response);
            },
            injectImmediately: true,
            target: { tabId: sub.curTab.id },
            world: chrome.scripting.ExecutionWorld.ISOLATED,
        });
    },
    checkPermission: (thepers, theorgs, theFunction, msg) => {
        if (!chrome.permissions) {
            return theFunction();
        }
        if (thepers && theorgs) {
            chrome.permissions.contains({ permissions: thepers, origins: theorgs }, result => {
                checkPers(result);
            });
        } else if (thepers) {
            chrome.permissions.contains({ permissions: thepers }, result => {
                checkPers(result);
            });
        } else if (theorgs) {
            chrome.permissions.contains({ origins: theorgs }, result => {
                checkPers(result);
            });
        }
        var getPers = (thepers, theorgs) => {
            sub.cons.permissions = {
                pers: thepers,
                orgs: theorgs,
            };
            msg ? (sub.cons.permissions.msg = msg) : null;
            chrome.windows.create({
                url: "../html/getpermissions.html",
                /*focused:true,*/ type: "popup",
                width: 800,
                height: 500,
            });
            return;
        };
        var checkPers = result => {
            if (result) {
                theFunction();
            } else {
                getPers(thepers, theorgs);
            }
        };
    },
    setIcon: async (status, tabId, changeInfo, tab) => {
        switch (status) {
            case "normal":
                break;
            case "warning":
                await chrome.action.setIcon({ tabId, path: "../image/grand-gesture-icon-016-gray.png" });
                await chrome.action.setTitle({ tabId, title: sub.getI18n("icon_tip") });
                break;
        }
    },
    getI18n: str => chrome.i18n.getMessage(str) || str,
    checkAction: (type, direct) => {
        var theName = "",
            theConf = "";
        for (var i = 0; i < config.mges.mges.length; i++) {
            if (config.mges.mges[i].direct === direct) {
                theName = config.mges.mges[i].name;
                theConf = config.mges.mges[i];
                break;
            }
            if (i === config.mges.mges.length - 1) {
                theConf = { name: null, mydes: null };
            }
        }
        sub.theConf = theConf;
        return sub.theConf;
    },
    initCurrent: (sender, theConf) => {
        //sender?sub.extID=sender.id:null;
        chrome.windows.getCurrent({ populate: true }, window => {
            sub.curWin = window;
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                sub.curTab = tabs[0];
                if (sub.action[sub.theConf.name]) {
                    sub.action[sub.theConf.name](sub.theConf);
                }
            });
        });
    },
    action: {
        none: () => {},
        //group nav
        back: async () => {
            //chk
            try {
                await chrome.tabs.goBack();
            } catch {}
        },
        forward: async () => {
            //chk
            try {
                await chrome.tabs.goForward();
            } catch {}
        },
        scroll: async () => {
            var _effect = sub.getConfValue("checks", "n_effect"),
                _scroll = sub.getConfValue("selects", "n_scroll").substring(2);
            sub.cons.scroll.effect = _effect;
            sub.cons.scroll.type = _scroll; //scrolltype;//sub.theConf.name;
            await chrome.scripting.executeScript({
                files: ["js/inject/scroll.js"],
                injectImmediately: true,
                target: { allFrames: true, tabId: sub.curTab.id },
                world: chrome.scripting.ExecutionWorld.ISOLATED,
            });
        },
        reload: async () => {
            //chk
            var ids = await sub.getId(sub.getConfValue("selects", "n_tab"));
            var clear = sub.getConfValue("checks", "n_reload_clear");
            //fix edge
            if (!chrome.tabs.reload) {
                for (let i = 0; ids && i < ids.length; i++) {
                    chrome.scripting.executeScript({
                        func: () => window.location.reload(),
                        injectImmediately: true,
                        target: { tabId: ids[i] },
                        world: chrome.scripting.ExecutionWorld.MAIN,
                    });
                }
            }
            for (let i = 0; ids && i < ids.length; i++) {
                void chrome.tabs.reload(ids[i], { bypassCache: clear });
            }
        },
        stop: async () => {
            //chk
            const ids = await sub.getId(sub.getConfValue("selects", "n_tab"));
            for (let i = 0; ids && i < ids.length; i++) {
                chrome.scripting.executeScript({
                    func: () => window.stop(),
                    injectImmediately: true,
                    target: { tabId: ids[i] },
                    world: chrome.scripting.ExecutionWorld.MAIN,
                });
            }
        },
        next: async () => {
            if (sub.message.npok) {
                sub.open(sub.message.url, sub.cons.next.optype, sub.cons.next.index, sub.cons.next.pin);
                sub.cons.next = {};
            } else {
                sub.cons.next = {};
                sub.cons.next.index = sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0];
                sub.cons.next.pin = sub.getConfValue("checks", "n_pin");
                sub.cons.next.optype = sub.getConfValue("selects", "n_optype");
                sub.cons.next.keywds = (
                    sub.getConfValue("texts", "n_npkey_n") || sub.getConfValue("texts", "n_npkey_p")
                ).split(",");
                await chrome.scripting.executeScript({
                    files: ["js/namespace.js", "js/inject/np.js"],
                    injectImmediately: true,
                    target: { allFrames: true, tabId: sub.curTab.id },
                    world: chrome.scripting.ExecutionWorld.ISOLATED,
                });
            }
        },
        previous: () => {
            sub.action.next();
        },
        pretab: async () => {
            const ids = [];
            const curTabId = sub.curTab.id;
            for (let i = 0; i < sub.curWin.tabs.length; i++) {
                ids.push(sub.curWin.tabs[i].id);
            }
            console.log({ curTab: sub.curTab, ids, pretab: sub.cons.pretab });
            for (let i = 1; i < sub.cons.pretab.length; i++) {
                if (sub.cons.pretab[i].tabId !== curTabId && ids.includes(sub.cons.pretab[i].tabId)) {
                    console.log(`switching from ${curTabId} to ${sub.cons.pretab[i].tabId}`);
                    await chrome.tabs.update(sub.cons.pretab[i].tabId, { active: true });
                    break;
                }
            }
        },
        close: async () => {
            var ids = await sub.getId(sub.getConfValue("selects", "n_tab"), "close"),
                selid = await sub.getId(sub.getConfValue("selects", "n_close_sel"))[0],
                selvalue = sub.getConfValue("selects", "n_close_sel"),
                _closeKeep = sub.getConfValue("checks", "n_close_keep");
            const value_closePin = sub.getConfValue("checks", "n_closePin");
            const funClose = async () => {
                const _funClose = async () => {
                    if (sub.curWin.tabs.length === ids.length && !sub.curWin.incognito && _closeKeep) {
                        await chrome.tabs.create({});
                    }
                    await chrome.tabs.remove(ids);
                    selvalue !== "s_default" ? await chrome.tabs.update(selid, { active: true }) : null;
                };
                if (ids.length > 1 && sub.getConfValue("checks", "n_closeConfirm")) {
                    chrome.tabs.sendMessage(sub.curTab.id, { type: "set_confirm" }, response => {
                        if (response.message) {
                            _funClose();
                        }
                    });
                } else {
                    await _funClose();
                }
            };
            if (value_closePin) {
                let i = 0,
                    ii = 0;
                const tabs = await chrome.tabs.query({ pinned: true });
                for (i = 0; i < tabs.length; i++) {
                    for (ii = 0; ii < ids.length; ii++) {
                        if (tabs[i].id === ids[ii]) {
                            ids.splice(ii, 1);
                            continue;
                        }
                    }
                }
            }
            await funClose();
        },
        newtab: () => {
            //chk
            var theTarget = sub.getConfValue("selects", "n_optype"),
                theIndex = sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0],
                thePin = sub.getConfValue("checks", "n_pin");
            var theURL = "";
            sub.open(theURL, theTarget, theIndex, thePin, "newtab");
        },
        upperlevel: () => {
            let _optype = sub.getConfValue("selects", "n_optype"),
                _index = sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0],
                _pin = sub.getConfValue("checks", "n_pin"),
                _url = "";
            let _urlA = sub.curTab.url;
            if (_urlA.substr(-1) === "/") {
                _urlA = _urlA.substr(0, _urlA.length - 1);
            }
            const _urlB = _urlA.split("/");
            if (_urlB.length > 3) {
                _urlB.length = _urlB.length - 1;
            }
            const _urlC = _urlB.join("/");
            _url = _urlC === _urlA ? "" : _urlC;
            sub.open(_url, _optype, _index, _pin);
        },
        increment: () => {
            let _optype = sub.getConfValue("selects", "n_optype"),
                _index = sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0],
                _pin = sub.getConfValue("checks", "n_pin"),
                _url = "";
            const _urlA = sub.curTab.url;
            const _urlB = _urlA.split("/");
            let i = 0,
                _urlC = "";
            const setNum = txt => {
                const _array = txt.match(/(\d*)/g);
                let i = 0,
                    _num = "",
                    _numNew,
                    _index;
                for (i = _array.length - 1; i > -1; i--) {
                    if (!isNaN(Number.parseInt(_array[i]))) {
                        _num = _array[i];
                        break;
                    }
                }
                if (_num === "") {
                    return false;
                } else {
                    _numNew = Number.parseInt(_num) + 1;
                    if (_numNew.toString().length < _num.length) {
                        _numNew = "0".repeat(_num.length - _numNew.toString().length) + _numNew;
                    }
                    _index = txt.lastIndexOf(_num);
                    if (_index !== -1) {
                        txt = txt.substr(0, _index) + _numNew.toString() + txt.substr(_index + _num.length);
                    }
                    return txt;
                }
            };

            for (i = _urlB.length - 1; i > 2; i--) {
                _urlC = _urlB[i];
                setNum(_urlC);
                if (setNum(_urlC)) {
                    _urlB[i] = setNum(_urlC);
                    _url = _urlB.join("/");
                    _url = _url === _urlA ? "" : _url;
                    sub.open(_url, _optype, _index, _pin);
                    break;
                }
            }
        },
        decrement: () => {
            let _optype = sub.getConfValue("selects", "n_optype"),
                _index = sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0],
                _pin = sub.getConfValue("checks", "n_pin"),
                _url = "";
            const _urlA = sub.curTab.url;
            const _urlB = _urlA.split("/");
            let i = 0,
                _urlC = "";
            const setNum = txt => {
                const _array = txt.match(/(\d*)/g);
                let i = 0,
                    _num = "",
                    _numNew,
                    _index;
                for (i = _array.length - 1; i > -1; i--) {
                    if (!isNaN(Number.parseInt(_array[i]))) {
                        _num = _array[i];
                        break;
                    }
                }
                if (_num === "") {
                    return false;
                } else {
                    _numNew = Number.parseInt(_num) - 1;
                    if (_numNew.toString().length < _num.length) {
                        _numNew = "0".repeat(_num.length - _numNew.toString().length) + _numNew;
                    }
                    _index = txt.lastIndexOf(_num);
                    if (_index !== -1) {
                        txt = txt.substr(0, _index) + _numNew.toString() + txt.substr(_index + _num.length);
                    }
                    return txt;
                }
            };
            for (i = _urlB.length - 1; i > 2; i--) {
                _urlC = _urlB[i];
                setNum(_urlC);
                if (setNum(_urlC)) {
                    _urlB[i] = setNum(_urlC);
                    _url = _urlB.join("/");
                    _url = _url === _urlA ? "" : _url;
                    sub.open(_url, _optype, _index, _pin);
                    break;
                }
            }
        },
        extdisable: async () => {
            const tabId = await sub.getCurrentTabId();
            await chrome.action.setIcon({ tabId, path: "../image/grand-gesture-icon-016-gray.png" });
            chrome.tabs.sendMessage(tabId, { type: "extdisable" }, () => {});
        },
        reopen: () => {
            var theFunction = () => {
                chrome.sessions.restore();
            };
            var thepers = ["sessions"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        reopenincognito: () => {
            chrome.windows.create(
                {
                    url: sub.curTab.url,
                    incognito: true,
                    state: sub.getConfValue("selects", "n_optype") === "s_incog" ? "normal" : "minimized",
                },
                window => {
                    if (!sub.getConfValue("checks", "n_reopenkeep")) {
                        chrome.tabs.remove(sub.curTab.id);
                    }
                }
            );
        },
        open: () => {
            //chk
            sub.open(
                sub.getConfValue("texts", "n_url"),
                sub.getConfValue("selects", "n_optype"),
                sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0],
                sub.getConfValue("checks", "n_pin")
            );
        },
        openclip: () => {
            //chk
            var theFunction = async () => {
                var theTarget = sub.getConfValue("selects", "n_optype"),
                    theIndex = sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0],
                    thePin = sub.getConfValue("checks", "n_pin");
                const result = await chrome.scripting.executeScript({
                    injectImmediately: true,
                    func: () => navigator.clipboard.readText(),
                    target: { tabId: sub.curTab.id },
                    world: chrome.scripting.ExecutionWorld.ISOLATED,
                });
                const url = result[0]?.result;
                if (url) {
                    sub.open(url, theTarget, theIndex, thePin);
                }
            };
            var thepers = ["clipboardRead"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        switchtab: async () => {
            const id = (await sub.getId(sub.getConfValue("selects", "n_tab_lrhl")))[0];

            //fix contextmenu from switchtab by rges or wges
            if (
                (sub.message.type === "action_wges" || sub.message.type === "action_rges") &&
                sub.message.sendValue.buttons === 2
            ) {
                await chrome.tabs.sendMessage(id, { type: "fix_switchtab", value: "contextmenu" });
                await chrome.tabs.update(id, { active: true });
            } else {
                await chrome.tabs.update(id, { active: true });
            }
        },
        move: () => {
            const index = sub.getIndex(sub.getConfValue("selects", "n_position_lrhl"))[0];
            chrome.tabs.move(sub.curTab.id, { index: index });
        },
        detach: async () => {
            if (sub.curWin.tabs.length === 1) {
                return;
            }
            var _target = sub.getConfValue("selects", "n_tab"),
                ids = await sub.getId(_target);
            if (ids == false || _target === "s_all") {
                return;
            }
            chrome.windows.create({ tabId: ids[0] }, window => {
                if (ids.length > 1) {
                    ids.splice(0, 1);
                    chrome.tabs.move(ids, { windowId: window.id, index: -1 });
                }
            });
        },
        pin: async () => {
            var ids = await sub.getId(sub.getConfValue("selects", "n_tab"));
            if (ids.length === 1) {
                chrome.tabs.get(ids[0], tab => {
                    var _pin = tab.pinned ? false : true;
                    chrome.tabs.update(ids[0], { pinned: _pin });
                });
            } else {
                chrome.windows.getCurrent({ populate: true }, window => {
                    for (var i = 0; i < window.tabs.length; i++) {
                        if (!ids.contains(window.tabs[i].id)) {
                            continue;
                        }
                        _pin = window.tabs[i].pinned ? false : true;
                        chrome.tabs.update(window.tabs[i].id, { pinned: _pin });
                    }
                });
            }
        },
        duplicate: async () => {
            var _target = sub.getConfValue("selects", "n_tab"),
                ids = await sub.getId(_target);
            for (var i = 0; i < ids.length; i++) {
                chrome.tabs.duplicate(ids[i], tab => {
                    if (sub.getConfValue("checks", "n_duplicatetype")) {
                        chrome.tabs.update(sub.curTab.id, { highlighted: true });
                    }
                });
            }
        },
        copytabele: () => {
            var theFunction = () => {
                var theIndex = sub.getIndex(sub.getConfValue("selects", "n_tab_single"))[0];
                chrome.tabs.query({ index: theIndex, currentWindow: true }, async tabs => {
                    const value = (() => {
                        var cptarget = tabs[0];
                        var cpcontent = sub.getConfValue("selects", "n_copytabele_content");
                        switch (cpcontent) {
                            case "s_tabele_title":
                                return cptarget.title;
                            case "s_tabele_url":
                                return cptarget.url;
                            case "s_tabele_aslnk":
                                return '<a href="' + cptarget.url + '">' + cptarget.title + "</a>";
                        }
                        return undefined;
                    })();
                    if (value) {
                        await chrome.scripting.executeScript({
                            args: [value],
                            injectImmediately: true,
                            func: value => navigator.clipboard.writeText(value),
                            target: { tabId: sub.curTab.id },
                            world: chrome.scripting.ExecutionWorld.ISOLATED,
                        });
                    }
                });
            };
            var thepers = ["clipboardWrite"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        newwin: () => {
            //chk
            var theType = sub.getConfValue("selects", "n_wintype").substr(2),
                theIncog = sub.getConfValue("checks", "n_winincog");
            chrome.windows.create({
                type: theType,
                incognito: theIncog,
                url: browserType === "fx" ? undefined : "chrome://newtab",
            });
        },
        closewin: () => {
            var theWin = sub.getConfValue("selects", "n_win");
            if (theWin === "s_current") {
                chrome.windows.remove(sub.curWin.id);
            } else {
                chrome.windows.getAll({ populate: true }, windows => {
                    for (var i = 0; i < windows.length; i++) {
                        if (theWin === "s_others") {
                            if (windows[i].id !== sub.curWin.id) {
                                chrome.windows.remove(windows[i].id);
                            }
                        } else {
                            chrome.windows.remove(windows[i].id);
                        }
                    }
                });
            }
        },
        max: () => {
            chrome.windows.update(
                sub.curWin.id,
                { state: sub.curWin.state === "normal" ? "maximized" : "normal" },
                window => {
                    sub.curWin.state = window.state;
                }
            );
        },
        min: () => {
            chrome.windows.update(sub.curWin.id, { state: "minimized" });
        },
        full: () => {
            var t;
            if (sub.curWin.state !== "fullscreen") {
                sub.cons.winstate = sub.curWin.state;
                t = "fullscreen";
            } else {
                t = sub.cons.winstate;
            }
            chrome.windows.update(sub.curWin.id, { state: t }, window => {});
        },
        mergewin: () => {
            sub.cons.mergewin = sub.cons.mergewin || { lastwins: [] };
            let i = 0,
                ii = 0,
                tabIds = [],
                win = [],
                _win = [],
                winState = sub.getConfValue("selects", "n_winstate").substr(2);
            chrome.windows.getCurrent(window => {
                chrome.windows.getAll({ populate: true, windowTypes: ["normal"] }, windows => {
                    for (i = 0; i < windows.length; i++) {
                        if (windows[i].id === window.id) {
                            continue;
                        }
                        _win = [];
                        for (ii = 0; ii < windows[i].tabs.length; ii++) {
                            tabIds.push(windows[i].tabs[ii].id);
                            _win.push(windows[i].tabs[ii].id);
                        }
                        win.push(_win);
                    }
                    sub.cons.mergewin.lastwins = win.length > 0 ? win : sub.cons.mergewin.lastwins;
                    if (tabIds.length > 0 && windows.length > 1) {
                        chrome.tabs.move(tabIds, { windowId: window.id, index: -1 }, () => {
                            if (winState !== "normal") {
                                chrome.windows.update(window.id, { state: winState });
                            }
                        });
                    } else if (sub.cons.mergewin.lastwins.length > 0) {
                        for (i = 0; i < sub.cons.mergewin.lastwins.length; i++) {
                            var _temp = i;
                            ((_temp, winId) => {
                                chrome.windows.create({ tabId: sub.cons.mergewin.lastwins[_temp][0] }, window => {
                                    if (sub.cons.mergewin.lastwins[_temp].length > 1) {
                                        sub.cons.mergewin.lastwins[_temp].splice(0, 1);
                                        chrome.tabs.move(
                                            sub.cons.mergewin.lastwins[_temp],
                                            { windowId: window.id, index: -1 },
                                            () => {
                                                if (_temp === sub.cons.mergewin.lastwins.length - 1) {
                                                    chrome.windows.update(winId, { focused: true });
                                                }
                                            }
                                        );
                                    }
                                });
                            })(i, window.id);
                        }
                    }
                });
            });
            return;
        },
        //txt
        copytxt: () => {
            //chk
            if (!sub.message.selEle.txt) {
                return;
            }
            var theFunction = async () => {
                await chrome.scripting.executeScript({
                    args: [sub.message.selEle.txt],
                    injectImmediately: true,
                    func: txt => navigator.clipboard.writeText(txt),
                    target: { tabId: sub.curTab.id },
                    world: chrome.scripting.ExecutionWorld.ISOLATED,
                });
            };
            var thepers = ["clipboardWrite"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        txtsearch: () => {
            //chk
            if (!sub.message.selEle.txt) {
                return;
            }
            var theURL, enTxt;
            var theEngine = sub.getConfValue("selects", "n_txtengine"),
                theTarget = sub.getConfValue("selects", "n_optype"),
                theCode = sub.getConfValue("selects", "n_encoding"),
                theIndex = sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0],
                thePin = sub.getConfValue("checks", "n_pin");
            switch (theCode) {
                case "s_unicode":
                    enTxt = escape(sub.message.selEle.txt);
                    break;
                case "s_uri":
                    enTxt = encodeURI(sub.message.selEle.txt);
                    break;
                case "s_uric":
                    enTxt = encodeURIComponent(sub.message.selEle.txt);
                    break;
                case "s_uricgbk":
                    enTxt = GBK.URI.encodeURI(sub.message.selEle.txt);
                    break;
                default:
                    enTxt = sub.message.selEle.txt;
                    break;
            }
            var _engine = config.general.engine.txtengine[theEngine].content;
            theURL = _engine.replace(/%s/g, enTxt);

            sub.open(theURL, theTarget, theIndex, thePin);
        },
        txtsearchclip: () => {
            var theFunction = () => {
                let _str,
                    _obj = document.body.appendChild(document.createElement("textarea"));
                _obj.focus();
                document.execCommand("paste");
                _str = _obj.value;
                _obj.remove();

                let _url,
                    _txt,
                    _engine = sub.getConfValue("selects", "n_txtengine"),
                    _target = sub.getConfValue("selects", "n_optype"),
                    _code = sub.getConfValue("selects", "n_encoding"),
                    _index = sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0],
                    _pin = sub.getConfValue("checks", "n_pin");
                switch (_code) {
                    case "s_unicode":
                        _txt = escape(_str);
                        break;
                    case "s_uri":
                        _txt = encodeURI(_str);
                        break;
                    case "s_uric":
                        _txt = encodeURIComponent(_str);
                        break;
                    case "s_uricgbk":
                        _txt = GBK.URI.encodeURI(_str);
                        break;
                    default:
                        _txt = _str;
                        break;
                }
                _engine = config.general.engine.txtengine[_engine].content;
                _url = _engine.replace(/%s/g, _txt);
                sub.open(_url, _target, _index, _pin);
            };
            var thepers = ["clipboardRead"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        tts: () => {
            if (!sub.message.selEle.txt) {
                return;
            }
            var theFunction = () => {
                var _text = sub.message.selEle.txt,
                    _voicename = sub.getConfValue("selects", "n_voicename")
                        ? sub.getConfValue("selects", "n_voicename")
                        : "native",
                    _gender = "female"; //sub.getConfValue("selects","n_gender")?sub.getConfValue("selects","n_gender").substr(2):"female",
                (_rate = sub.getConfValue("ranges", "n_rate") ? Number(sub.getConfValue("ranges", "n_rate")) : 1),
                    (_pitch = sub.getConfValue("ranges", "n_pitch")
                        ? Number(sub.getConfValue("ranges", "n_pitch"))
                        : 1),
                    (_volume = sub.getConfValue("ranges", "n_volume")
                        ? Number(sub.getConfValue("ranges", "n_volume"))
                        : 1);
                chrome.tts.speak(_text, {
                    voiceName: _voicename,
                    gender: _gender,
                    rate: _rate,
                    pitch: _pitch,
                    volume: _volume,
                });
            };
            theFunction();

            return;
            var theorgs;
        },
        //link
        openlnk: () => {
            //lnk
            if (!sub.message.selEle.lnk && !sub.message.selEle.objLnk) {
                return;
            }
            var _optype = sub.getConfValue("selects", "n_optype"),
                _url = sub.message.selEle.lnk || sub.message.selEle.objLnk.href,
                _position = sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0],
                _pin = sub.getConfValue("checks", "n_pin");
            sub.open(_url, _optype, _position, _pin);
        },
        bookmarklnk: () => {
            sub.checkPermission(["bookmarks"], undefined, async () => {
                var _url = sub.message.selEle.lnk ? sub.message.selEle.lnk : null,
                    _str = sub.message.selEle.str ? sub.message.selEle.str : null,
                    _notif = sub.getConfValue("checks", "n_notif");
                if (!_url) {
                    return;
                }
                const nodes = await chrome.bookmarks.search({ url: _url });
                if (nodes.length) {
                    for (const node of nodes) {
                        await chrome.bookmarks.remove(node.id);
                    }
                    _notif === "s_yes"
                        ? sub.showNotif("basic", sub.getI18n("notif_title"), sub.getI18n("notif_con_bkdel"))
                        : null;
                } else {
                    await chrome.bookmarks.create({ url: _url, title: _str });
                    _notif === "s_yes"
                        ? sub.showNotif("basic", sub.getI18n("notif_title"), sub.getI18n("notif_con_bkadd"))
                        : null;
                }
                console.log("Bookmarks after:", await chrome.bookmarks.search({}));
            });
        },
        copylnkurl: () => {
            if (!sub.message.selEle.lnk) {
                return;
            }
            sub.checkPermission(["clipboardWrite"], undefined, async () => {
                await chrome.scripting.executeScript({
                    args: [sub.message.selEle.lnk],
                    injectImmediately: true,
                    func: value => navigator.clipboard.writeText(value),
                    target: { tabId: sub.curTab.id },
                    world: chrome.scripting.ExecutionWorld.ISOLATED,
                });
            });
        },
        copylnktxt: () => {
            if (!sub.message.selEle.str) {
                return;
            }
            sub.checkPermission(["clipboardWrite"], undefined, async () => {
                await chrome.scripting.executeScript({
                    args: [sub.message.selEle.str],
                    injectImmediately: true,
                    func: value => navigator.clipboard.writeText(value),
                    target: { tabId: sub.curTab.id },
                    world: chrome.scripting.ExecutionWorld.ISOLATED,
                });
            });
        },
        copylnkaslnk: () => {
            if (!sub.message.selEle.lnk) {
                return;
            }
            sub.checkPermission(["clipboardWrite"], undefined, async () => {
                await chrome.scripting.executeScript({
                    args: ['<a href="' + sub.message.selEle.lnk + '">' + sub.message.selEle.str + "</a>"],
                    injectImmediately: true,
                    func: value => navigator.clipboard.writeText(value),
                    target: { tabId: sub.curTab.id },
                    world: chrome.scripting.ExecutionWorld.ISOLATED,
                });
            });
        },
        copylnkas: () => {},
        //img
        openimg: () => {
            //chk
            if (!sub.message.selEle.img) {
                return;
            }
            var _optype = sub.getConfValue("selects", "n_optype"),
                _position = sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0],
                _pin = sub.getConfValue("checks", "n_pin"),
                _url = sub.message.selEle.img;
            sub.open(_url, _optype, _position, _pin);
        },
        saveimg: () => {
            if (!sub.message.selEle.img) {
                return;
            }
            var theFunction = () => {
                var _url = sub.message.selEle.img,
                    _notif = sub.getConfValue("checks", "n_notif");
                chrome.downloads.download({ url: _url }, id => {
                    if (!id) {
                        _notif
                            ? sub.showNotif("basic", sub.getI18n("notif_title"), sub.getI18n("notif_con_dnimgerr"))
                            : null;
                    } else {
                        _notif
                            ? sub.showNotif("basic", sub.getI18n("notif_title"), sub.getI18n("notif_con_dnimg"))
                            : null;
                    }
                });
            };
            var thepers = ["downloads"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        saveimgas: () => {
            if (!sub.message.selEle.img) {
                return;
            }
            var theFunction = () => {
                var _url = sub.message.selEle.img,
                    _notif = sub.getConfValue("checks", "n_notif");
                chrome.downloads.download({ url: _url, saveAs: true }, id => {
                    if (!id) {
                        _notif
                            ? sub.showNotif("basic", sub.getI18n("notif_title"), sub.getI18n("notif_con_dnimgerr"))
                            : null;
                    } else {
                        _notif
                            ? sub.showNotif("basic", sub.getI18n("notif_title"), sub.getI18n("notif_con_dnimg"))
                            : null;
                    }
                });
            };
            var thepers = ["downloads"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        copyimgurl: () => {
            if (!sub.message.selEle.img) {
                return;
            }
            sub.checkPermission(["clipboardWrite"], undefined, async () => {
                await chrome.scripting.executeScript({
                    args: [sub.message.selEle.img],
                    injectImmediately: true,
                    func: value => navigator.clipboard.writeText(value),
                    target: { tabId: sub.curTab.id },
                    world: chrome.scripting.ExecutionWorld.ISOLATED,
                });
            });
        },
        copyimg: async () => {
            if (!sub.message.selEle.img) {
                return;
            }
            await chrome.scripting.executeScript({
                files: ["js/inject/copyimg.js"],
                injectImmediately: true,
                target: { allFrames: true, tabId: sub.curTab.id },
                world: chrome.scripting.ExecutionWorld.ISOLATED,
            });
        },
        imgsearch: () => {
            if (!sub.message.selEle.img) {
                return;
            }
            var enURL;
            var _optype = sub.getConfValue("selects", "n_optype"),
                _position = sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0],
                _pin = sub.getConfValue("checks", "n_pin"),
                _code = sub.getConfValue("selects", "n_encoding"),
                _url = sub.getConfValue("selects", "n_imgengine");

            switch (_code) {
                case "s_unicode":
                    enURL = escape(sub.message.selEle.img);
                    break;
                case "s_uri":
                    enURL = encodeURI(sub.message.selEle.img);
                    break;
                case "s_uric":
                    enURL = encodeURIComponent(sub.message.selEle.img);
                    break;
                case "s_uricgbk":
                    enURL = GBK.URI.encodeURI(sub.message.selEle.img);
                    break;
                default:
                    enURL = sub.message.selEle.img;
                    break;
            }
            _url = config.general.engine.imgengine[_url].content;
            _url = _url.replace(/%s/g, enURL);
            sub.open(_url, _optype, _position, _pin);
        },
        crpages: () => {
            var theURL = "",
                theTarget = sub.getConfValue("selects", "n_optype"),
                _url = sub.getConfValue("selects", "n_crpages"),
                theIndex = sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0],
                thePin = sub.getConfValue("checks", "n_pin");
            switch (_url) {
                case "s_cr_set":
                    theURL = "chrome://settings";
                    break;
                case "s_cr_ext":
                    theURL = "chrome://extensions";
                    break;
                case "s_cr_history":
                    theURL = "chrome://history";
                    break;
                case "s_cr_app":
                    theURL = "chrome://apps";
                    break;
                case "s_cr_bookmark":
                    theURL = "chrome://bookmarks";
                    break;
                case "s_cr_dl":
                    theURL = "chrome://downloads";
                    break;
                case "s_cr_flag":
                    theURL = "chrome://flags";
                    break;
                case "s_cr_about":
                    theURL = "chrome://about";
                    break;
            }
            sub.open(theURL, theTarget, theIndex, thePin);
        },
        restart: () => {
            chrome.tabs.create({ url: "chrome://restart/", active: false });
        },
        exit: () => {
            chrome.tabs.create({ url: "chrome://quit/", active: false });
        },
        optionspage: () => {
            var theTarget = "s_new",
                theURL = chrome.runtime.getURL("/html/options.html");
            (theIndex = false), (thePin = false);
            sub.open(theURL, theTarget, theIndex, thePin);
        },
        reloadext: () => {
            chrome.runtime.reload();
        },
        closeapps: async () => {
            await chrome.scripting.executeScript({
                args: [_code],
                func: () => {
                    const eles = document.querySelectorAll("smartup.su_apps");
                    const _fun = ele => window.setTimeout(() => ele.remove(), 500);
                    for (let i = 0; i < eles.length; i++) {
                        eles[i].style.cssText += "transition:all .4s ease-in-out;opacity:0;top:0;";
                        _fun(eles[i]);
                    }
                },
                injectImmediately: true,
                target: { tabId: sub.curTab.id },
                world: chrome.scripting.ExecutionWorld.MAIN,
            });
        },
        dldir: () => {
            var theFunction = () => {
                chrome.downloads.showDefaultFolder();
            };
            var thepers = ["downloads"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        capture: () => {
            chrome.tabs.captureVisibleTab({ format: "png" }, dataURL => {
                chrome.tabs.create({ url: dataURL });
            });
        },
        bookmark: () => {
            var theFunction = async () => {
                var ids = await sub.getId(sub.getConfValue("selects", "n_tab"));
                var _notif = sub.getConfValue("checks", "n_notif"),
                    _close = sub.getConfValue("checks", "n_closetab");
                for (var i = 0; i < ids.length; i++) {
                    chrome.tabs.get(ids[i], tab => {
                        chrome.bookmarks.search({ url: tab.url }, nodes => {
                            if (nodes.length) {
                                chrome.bookmarks.remove(nodes[0].id, () => {
                                    _notif
                                        ? sub.showNotif(
                                              "basic",
                                              sub.getI18n("notif_title"),
                                              sub.getI18n("notif_con_bkdel")
                                          )
                                        : null;
                                    _close ? chrome.tabs.remove(tab.id) : null;
                                });
                            } else {
                                chrome.bookmarks.create({ url: tab.url, title: tab.title }, bk => {
                                    _notif
                                        ? sub.showNotif(
                                              "basic",
                                              sub.getI18n("notif_title"),
                                              sub.getI18n("notif_con_bkadd")
                                          )
                                        : null;
                                    _close ? chrome.tabs.remove(tab.id) : null;
                                });
                            }
                        });
                    });
                }
            };
            var thepers = ["bookmarks"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        script: async () => {
            var _script = sub.getConfValue("selects", "n_script");
            await chrome.scripting.executeScript({
                args: [config.general.script.script[_script].content],
                func: script => eval(script),
                injectImmediately: true,
                target: { tabId: sub.curTab.id },
                world: chrome.scripting.ExecutionWorld.MAIN,
            });
        },
        source: () => {
            var theTarget = sub.getConfValue("selects", "n_optype"),
                theURL = "view-source:" + sub.curTab.url,
                theIndex = sub.getIndex(sub.getConfValue("selects", "n_position"), "new")[0];
            thePin = sub.getConfValue("checks", "n_pin");
            sub.open(theURL, theTarget, theIndex, thePin);
        },
        zoom: async () => {
            if (!chrome.tabs.setZoom) {
                sub.cons.zoom = sub.getConfValue("selects", "n_zoom");
                await chrome.scripting.executeScript({
                    files: ["js/inject/zoom.js"],
                    injectImmediately: true,
                    target: { tabId: sub.curTab.id },
                    world: chrome.scripting.ExecutionWorld.ISOLATED,
                });
            } else {
                var factorDefault = 1;
                sub.getConfData("checks", "c_factor");
                var _confData = sub.getConfData("checks", "c_factor");
                var factorCus = _confData.value
                        ? _confData.valueOption === "cl_factorcustom"
                            ? Number.parseInt(_confData.valueSetting) / 100
                            : false
                        : false,
                    factorLoaded = _confData.value
                        ? _confData.valueOption === "cl_factorloaded"
                            ? true
                            : false
                        : false;
                if (factorLoaded) {
                    factorDefault = sub.temp.zoom[sub.curTab.id];
                } else {
                    factorDefault = factorCus ? factorCus : 1;
                }

                var zoomRange = [25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500];

                switch (sub.theConf.selects[0].value) {
                    case "s_in":
                        chrome.tabs.getZoom(zoom => {
                            zoom = Number.parseFloat(zoom.toFixed(2));
                            for (var i = zoomRange.length - 1; i >= 0; i--) {
                                if (zoom >= Number.parseFloat((zoomRange[i] / 100).toFixed(2))) {
                                    zoom = Number.parseFloat(
                                        (zoomRange[i === zoomRange.length - 1 ? 0 : i + 1] / 100).toFixed(2)
                                    );
                                    zoom = zoom < factorDefault ? factorDefault : zoom;
                                    chrome.tabs.setZoom(zoom);
                                    break;
                                }
                            }
                        });
                        break;
                    case "s_out":
                        chrome.tabs.getZoom(zoom => {
                            zoom = Number.parseFloat(zoom.toFixed(2));
                            for (var i = 0; i < zoomRange.length; i++) {
                                if (zoom < Number.parseFloat((zoomRange[i] / 100).toFixed(2))) {
                                    zoom = Number.parseFloat((zoomRange[i === 0 ? 0 : i - 2] / 100).toFixed(2));
                                    zoom = zoom < factorDefault ? zoom : factorDefault;
                                    chrome.tabs.setZoom(zoom);
                                    break;
                                }
                            }
                        });
                        break;
                    case "s_reset":
                        chrome.tabs.setZoom(factorDefault);
                        break;
                }
            }
        },
        savepage: () => {
            var theFunction = async () => {
                var ids = await sub.getId(sub.getConfValue("selects", "n_tab"));
                var _close = sub.getConfValue("checks", "n_closetab"),
                    _dlbar = sub.getConfValue("checks", "n_dlbar"),
                    _notif = sub.getConfValue("checks", "n_notif");
                for (var i = 0; i < ids.length; i++) {
                    chrome.tabs.get(ids[i], tab => {
                        chrome.pageCapture.saveAsMHTML({ tabId: tab.id }, data => {
                            var url = window.URL.createObjectURL(data);
                            chrome.downloads.setShelfEnabled(_dlbar);
                            chrome.downloads.download({ url: url, filename: tab.title + ".mhtml" }, dlid => {
                                if (_close && dlid) {
                                    chrome.tabs.remove(tab.id);
                                }
                                if (_notif && dlid) {
                                    sub.showNotif("basic", sub.getI18n("notif_title"), sub.getI18n("notif_con_dlok"));
                                }
                            });
                        });
                    });
                }
            };
            var thepers = ["pageCapture", "downloads"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        mail: () => {
            var urls = [],
                titles = [];
            var _mail = sub.getConfValue("selects", "n_mail"),
                _domain = sub.getConfValue("texts", "n_mail_domain"),
                _prefix = sub.getConfValue("texts", "n_mail_prefix"),
                _index = sub.getIndex(sub.getConfValue("selects", "n_tab"));
            var _sub = _prefix,
                _body = "";
            for (var i = 0; i < _index.length; i++) {
                urls.push(sub.curWin.tabs[_index[i]].url);
                titles.push(sub.curWin.tabs[_index[i]].title);
            }
            titles.length === 1 ? (_sub += titles[0]) : (_sub += titles.length + " " + "pages");
            for (var i = 0; i < titles.length; i++) {
                _body += titles[i] + " - " + encodeURIComponent(urls[i]) + "        ";
            }

            if (_mail === "s_defaultmail") {
                chrome.tabs.update(sub.curTab.id, { url: "mailto:?subject=" + _sub + "&body=" + _body });
            } else {
                chrome.tabs.create({
                    url:
                        "https://mail.google.com" +
                        (_mail === "s_gmailapps" ? "/a/" + _domain : "") +
                        "/mail/?view=cm&fs=1&tf=1&su=" +
                        _sub +
                        "&body=" +
                        _body,
                });
            }
        },
        print: async () => {
            await chrome.scripting.executeScript({
                func: () => window.print(),
                injectImmediately: true,
                target: { tabId: sub.curTab.id },
                world: chrome.scripting.ExecutionWorld.MAIN,
            });
        },
        zoom_dep: async () => {
            for (let i = 0; i < (sub.theConf.selects ? sub.theConf.selects.length : 0); i++) {
                if (sub.theConf.selects[i].type === "n_zoom") {
                    sub.cons.zoom = sub.theConf.selects[i].value;
                }
            }
            await chrome.scripting.executeScript({
                files: ["js/inject/zoom.js"],
                injectImmediately: true,
                target: { tabId: sub.curTab.id },
                world: chrome.scripting.ExecutionWorld.ISOLATED,
            });
        },
        mute: async () => {
            var ids = [];
            var _mute = sub.getConfValue("selects", "n_mute");
            if (_mute === "s_audible") {
                chrome.windows.getAll({ populate: true }, windows => {
                    for (var i = 0; i < windows.length; i++) {
                        chrome.tabs.query({ audible: true, windowId: windows[i].id }, tabs => {
                            for (var i = 0; i < tabs.length; i++) {
                                ids.push(tabs[i].id);
                                var _audio = tabs[i].mutedInfo.muted ? false : true;
                                chrome.tabs.update(tabs[i].id, { muted: _audio });
                            }
                        });
                    }
                });
            } else {
                ids = await sub.getId(_mute);
                if (ids.length === 1) {
                    chrome.tabs.get(ids[0], tab => {
                        _mute = tab.mutedInfo.muted ? false : true;
                        chrome.tabs.update(ids[0], { muted: _mute });
                    });
                } else {
                    chrome.windows.getCurrent({ populate: true }, window => {
                        for (var i = 0; i < window.tabs.length /*&&ids.contains(window.tabs[i].id)*/; i++) {
                            if (!ids.contains(window.tabs[i].id)) {
                                continue;
                            }
                            _mute = window.tabs[i].mutedInfo.muted ? false : true;
                            chrome.tabs.update(window.tabs[i].id, { muted: _mute });
                        }
                    });
                }
            }
        },
        snap: () => {
            if (sub.cons.snapstate) {
                const { snapstate } = sub.cons;
                chrome.windows.update(sub.curWin.id, sub.cons.snapstate, () => delete sub.cons.snapstate);
                return;
            }

            const _snap = sub.getConfValue("selects", "n_snap");
            const [_height, _width] = [
                screen.availHeight,
                _snap === "s_left" ? 0 : Number.parseInt(screen.availWidth / 2),
            ];

            sub.cons.snapstate = {
                height: sub.curWin.height,
                width: sub.curWin.width,
                left: sub.curWin.left,
                top: sub.curWin.top,
                state: sub.curWin.state,
            };

            chrome.windows.update(sub.curWin.id, { height: _height, width: _width, top: 0, left: _width });
        },
        set_bk: () => {
            const theFunction = () => {
                chrome.browserSettings.openBookmarksInNewTabs.get({}).then(result => {
                    if (result) {
                        chrome.browserSettings.openBookmarksInNewTabs.set({ value: !result.value });
                    }
                });
            };
            var thepers = ["browserSettings"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        set_search: () => {
            const theFunction = () => {
                chrome.browserSettings.openSearchResultsInNewTabs.get({}).then(result => {
                    if (result) {
                        chrome.browserSettings.openSearchResultsInNewTabs.set({ value: !result.value });
                    }
                });
            };
            var thepers = ["browserSettings"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        readermode: () => {
            if (sub.curTab.isArticle && chrome.tabs.toggleReaderMode) {
                chrome.tabs.toggleReaderMode();
            }
        },

        //mini apps
        shorturl: () => {
            var _appname = "shorturl";
            sub.initAppconf(_appname);
            sub.insertTest(_appname);
        },
        notepad: () => {
            var _appname = "notepad";
            sub.initAppconf(_appname);
            sub.insertTest(_appname);
        },
        magnet: () => {
            var _appname = "magnet";
            sub.initAppconf(_appname);
            var _obj = {};
            _obj.seltxt = sub.message.selEle ? sub.message.selEle.txt : "";
            _obj.drawtype = sub.message.drawType;
            sub.cons[_appname] = _obj;
            sub.insertTest(_appname);
        },
        tbkjx: () => {
            var _appname = "tbkjx";
            sub.initAppconf(_appname);
            sub.insertTest(_appname);
        },
        homepage: () => {
            var theFunction = () => {
                var _appname = "homepage";
                sub.initAppconf(_appname);
                chrome.topSites.get(async sites => {
                    const _obj = {};
                    _obj.sites = sites;
                    _obj.listId = (await chrome.storage.local.get("homepageListId")).homepageListId;
                    sub.cons[_appname] = _obj;
                    sub.insertTest(_appname);
                });
            };
            var thepers = ["topSites"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        autoreload: () => {
            var _appname = "autoreload";
            sub.insertTest(_appname);
        },
        convertcase: () => {
            var _appname = "convertcase";
            sub.insertTest(_appname);
        },
        pxmovie: () => {
            var _appname = "pxmovie";
            sub.insertTest(_appname);
        },
        speaker: () => {
            var theFunction = () => {
                var _appname = "speaker";
                sub.initAppconf(_appname);
                var _obj = {};
                chrome.tts.getVoices(voice => {
                    var _voicename = [];
                    for (var i = 0; i < voice.length; i++) {
                        if (voice[i].voiceName === "native") {
                            _voicename.splice(0, 0, voice[i].voiceName);
                        } else {
                            _voicename.push(voice[i].voiceName);
                        }
                    }
                    _obj.voicename = _voicename;
                    _obj.seltxt = sub.message.selEle ? sub.message.selEle.txt : "";
                    sub.cons[_appname] = _obj;
                    sub.insertTest(_appname);
                });
            };
            theFunction();
            return;
        },
        jslist: call_appslist => {
            var _appname = "jslist";
            sub.initAppconf(_appname);
            var _obj = {};
            _obj.js = config.general.script.script;
            sub.cons[_appname] = _obj;
            sub.insertTest(_appname);
        },
        tablist: call_appslist => {
            var _appname = "tablist";
            sub.initAppconf(_appname);
            var _obj = {};
            chrome.tabs.query({ currentWindow: true }, tabs => {
                _obj.list = tabs;
                _obj.curtab = sub.curTab;
                sub.cons[_appname] = _obj;
                sub.insertTest(_appname);
            });
        },
        recentbk: call_appslist => {
            var theFunction = () => {
                var _appname = "recentbk";
                sub.initAppconf(_appname);
                var _obj = {};
                chrome.bookmarks.getRecent(Number.parseInt(config.apps[_appname].n_num), bkArray => {
                    _obj.bk = bkArray;
                    sub.cons[_appname] = _obj;
                    sub.insertTest(_appname);
                });
            };
            var thepers = ["bookmarks"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        recentht: call_appslist => {
            var theFunction = () => {
                var _appname = "recentht";
                sub.initAppconf(_appname);
                var _obj = {};
                chrome.history.search({ text: "", maxResults: Number.parseInt(config.apps[_appname].n_num) }, items => {
                    _obj.ht = items;
                    sub.cons[_appname] = _obj;
                    sub.insertTest(_appname);
                });
            };
            var thepers = ["history"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        recentclosed: call_appslist => {
            var theFunction = () => {
                var _appname = "recentclosed";
                sub.initAppconf(_appname);
                var _obj = {};
                chrome.sessions.getRecentlyClosed(
                    { maxResults: Number.parseInt(config.apps[_appname].n_num) },
                    items => {
                        _obj.tabs = items;
                        sub.cons[_appname] = _obj;
                        sub.insertTest(_appname);
                    }
                );
            };
            var thepers = ["sessions"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        synced: () => {
            var theFunction = () => {
                var _appname = "synced";
                sub.initAppconf(_appname);
                var _obj = {};
                _obj.sync = [];
                chrome.sessions.getDevices(items => {
                    _obj.sync = items;
                    sub.cons[_appname] = _obj;
                    sub.insertTest(_appname);
                });
            };
            var thepers = ["sessions"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        appslist: () => {
            var _appname = "appslist";
            sub.initAppconf(_appname);
            var _obj = {};
            _obj.apps = [
                "rss",
                "tablist",
                "random",
                "extmgm",
                "recentbk",
                "recentht",
                "recentclosed",
                "synced",
                "base64",
                "qr",
                "numc",
                "speaker",
                "jslist",
                "convertcase",
                "autoreload",
                "homepage",
                "magnet" /*,"notepad","shorturl"*/,
            ];
            chrome.tabs.saveAsPDF ? _obj.apps.push("savepdf") : null;
            navigator.language === "zh-CN" ? _obj.apps.push("tbkjx") : null;
            sub.cons[_appname] = _obj;
            sub.insertTest(_appname);
        },
        base64: () => {
            var _appname = "base64";
            sub.initAppconf(_appname);
            sub.insertTest(_appname);
        },
        qr: () => {
            var _appname = "qr";
            sub.initAppconf(_appname);
            var _obj = {};
            _obj.seltxt = sub.message.selEle ? sub.message.selEle.txt : "";
            _obj.sellnk = sub.message.selEle ? sub.message.selEle.lnk : "";
            _obj.drawtype = sub.message.drawType;
            sub.cons[_appname] = _obj;
            sub.insertTest(_appname);
        },
        savepdf: () => {
            const _appname = "savepdf";
            sub.insertTest(_appname);
        },
        numc: () => {
            var _appname = "numc";
            sub.initAppconf(_appname);
            sub.insertTest(_appname);
        },
        random: () => {
            var _appname = "random";
            sub.insertTest(_appname);
        },
        rss: () => {
            var _appname = "rss";
            sub.initAppconf(_appname);
            sub.insertTest(_appname);
        },
        extmgm: () => {
            var theFunction = () => {
                var _appname = "extmgm";
                sub.initAppconf(_appname);
                var _obj = {};
                _obj.ext_enabled = [];
                _obj.ext_disabled = [];
                _obj.extLast = [];
                _obj.extID = sub.extID;

                if (!config.apps.extmgm.exts) {
                    const _newExts = [
                        {
                            gpname: chrome.i18n.getMessage("extmgm_defaultgroup"),
                            id: [],
                        },
                    ];
                    chrome.management.getAll(exts => {
                        for (var i = 0; i < exts.length; i++) {
                            if (exts[i].enabled) {
                                _newExts[0].id.push(exts[i].id);
                            }
                        }
                        config.apps.extmgm.exts = _newExts;
                        sub.insertTest(_appname);
                    });
                } else {
                    sub.insertTest(_appname);
                }

                chrome.management.getAll(exts => {
                    for (var i = 0; i < exts.length; i++) {
                        exts[i].iconBase64 = "";
                        if (exts[i].enabled) {
                            if (exts[i].id !== sub.extID) {
                                _obj.extLast.push(exts[i].id);
                            }
                        }
                    }
                    _obj.exts = exts;
                    sub.cons[_appname] = _obj;
                });
            };
            var thepers = ["management"];
            var theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        dllink: () => {
            const theFunction = () => {
                var _url = sub.message.selEle.lnk,
                    _dialog = sub.getConfValue("checks", "n_dialog");
                chrome.downloads.download({ url: _url, saveAs: _dialog }, id => {
                    if (!id) {
                        _notif ? sub.showNotif("basic", sub.getI18n("notif_title"), sub.getI18n("notif_dlok")) : null;
                    } else {
                        _notif ? sub.showNotif("basic", sub.getI18n("notif_title"), sub.getI18n("notif_dlerr")) : null;
                    }
                });
            };
            const thepers = ["downloads"];
            let theorgs;
            sub.checkPermission(thepers, theorgs, theFunction);
        },
        apps_saveconf: (message, sendResponse) => {
            config.apps[message.apptype] = message.config;
            sub.saveConf();
            sendResponse({ type: message.apptype, value: sub.getI18n("notif_con_appsave") });
        },
    },
    open: (url, target, position, pin, flag) => {
        var fixURL = url => {
            var fixstrs = [
                "http://",
                "https://",
                "ftp://",
                "chrome://",
                "extension://",
                "chrome-extension://",
                "view-source:chrome-extension://",
                "view-source:",
                "moz-extension://",
                "ms-browser-extension://",
                "about:",
                "file:///",
            ];
            var theFlag = false;
            for (var i = 0; i < fixstrs.length; i++) {
                if (url.indexOf(fixstrs[i]) === 0) {
                    theFlag = true;
                    break;
                }
            }
            if (!theFlag) {
                return "http://" + url;
            } else {
                return url;
            }
        };
        if (!url) {
            if (flag === "newtab") {
            } else {
                return;
            }
        } else {
            url = fixURL(url);
        }
        if (!url) {
            url = browserType === "fx" ? undefined : "chrome://newtab";
        }
        var theTarget = target,
            theURL = url,
            thePos = position,
            thePin = pin;
        if (theTarget === "s_current") {
            chrome.tabs.update({ url: theURL, pinned: thePin });
            return;
        } else if (theTarget === "s_currentwin") {
            chrome.tabs.remove(sub.curTab.id);
            chrome.tabs.create({ url: theURL, index: sub.curTab.index });
            return;
        } else if (theTarget === "s_win") {
            //fix fx unsupport focused
            var _obj = browserType === "fx" ? { url: theURL } : { url: theURL, focused: true };
            chrome.windows.create(_obj, window => {
                chrome.tabs.update(window.tabs[0].id, { pinned: thePin });
            });
            return;
        } else if (theTarget === "s_winback") {
            //fix fx unsupport focused
            var _obj = browserType === "fx" ? { url: theURL } : { url: theURL, focused: true };
            chrome.windows.create(_obj, window => {
                chrome.tabs.update(window.tabs[0].id, { pinned: thePin });
            });
            return;
        } else if (theTarget === "s_incog") {
            chrome.windows.getAll(windows => {
                var _flag = false;
                for (var i = 0; i < windows.length; i++) {
                    if (windows[i].incognito /*||i==windows.length-1*/) {
                        _flag = windows[i].id;
                        break;
                    }
                }
                if (_flag === 0 || _flag) {
                    chrome.windows.update(_flag, { focused: true });
                    chrome.tabs.create({
                        windowId: _flag,
                        url: theURL,
                        active: theTarget === "s_back" ? false : true,
                        index: thePos,
                        pinned: thePin,
                    });
                } else {
                    chrome.windows.create(
                        { url: theURL || flag === "newtab" ? theURL : "", incognito: true },
                        window => {
                            if (!window) {
                                return;
                            }
                            chrome.tabs.update(window.tabs[0].id, { pinned: thePin });
                        }
                    );
                }
            });
            return;
        }
        let createProperties = {};
        createProperties = {
            active: theTarget === "s_back" ? false : true,
            pinned: thePin,
            index: thePos,
            url: theURL,
        };
        if (!theURL) {
            delete createProperties.url;
        }
        if (!(thePos || thePos === 0)) {
            delete createProperties.index;
        }
        chrome.tabs.create(createProperties);
    },
    initpers: () => {
        if (!chrome.permissions) {
            console.log("chrome.permissions is not available");
            return;
        }
        sub.cons.permissions = null;
        sub.cons.origins = null;
        chrome.permissions.contains({ permissions: ["clipboardWrite"] }, result => {
            sub.cons.per_write = result;
        });
        chrome.permissions.getAll(pers => {
            sub.cons.permissions = pers.permissions;
            sub.cons.origins = pers.origins;
        });
    },
    saveConf: async (noInit, sendResponse) => {
        const _isSync = config.general.sync.autosync && chrome.storage.sync;
        if (_isSync) {
            await chrome.storage.local.set({ sync: "true" });
            await chrome.storage.sync.clear();
            await chrome.storage.sync.set(config);
            if (chrome.runtime.lastError) {
                sub.showNotif(
                    "basic",
                    sub.getI18n("notif_title_conferr"),
                    sub.getI18n("msg_conferr0") +
                        "\n" +
                        chrome.runtime.lastError.message +
                        "\n" +
                        sub.getI18n("msg_conferr1")
                );
                sub.cons.lastErr = chrome.runtime.lastError.message;
                await chrome.storage.sync.set(sub.cons.lastConf);
                await loadConfig();
                await chrome.runtime.sendMessage({ type: "confErr", lastErr: sub.cons.lastErr });
            } else {
                await loadConfig();
                await chrome.runtime.sendMessage({ type: "confOK" });
            }
        } else {
            const items = await chrome.storage.local.get();
            const _obj = {};
            _obj.sync = "false";
            _obj.config = config;
            _obj.localConfig = items.localConfig;
            await chrome.storage.local.clear();
            await chrome.storage.local.set(_obj);
            await loadConfig();
            await chrome.runtime.sendMessage({ type: "confOK" });
        }
    },
    reset: () => {},
    setBackup: ver => {
        var dbname = "backup";
        var request = indexedDB.open(dbname, 1);
        request.onupgradeneeded = e => {
            db = e.target.result;
            db.createObjectStore("config", { keyPath: "id" });
        };
        request.onsuccess = e => {
            db = e.target.result;
            var dbobj = db.transaction(["config"], "readwrite").objectStore("config");
            var dbadd = dbobj.put({ config: config, id: config.version });
            dbadd.onsuccess = e => {
                sub.upgrade["_" + ver](ver !== defaultConf.version ? true : false);
            };
        };
    },
    getBackup: (id, saveas) => {
        var dbname = "backup";
        var request = indexedDB.open(dbname, 1);
        request.onsuccess = e => {
            db = e.target.result;
            var dbobj = db.transaction(["config"], "readwrite").objectStore("config");
            var dbget = dbobj.get(id);
            dbget.onsuccess = e => {
                if (e.target.result) {
                    _conf = e.target.result.config;
                    if (saveas) {
                        saveAs();
                    }
                }
            };
        };
    },
    upgrade: {
        up: () => {
            if (!(config.version < defaultConf.version)) {
                return;
            }
            if (config.version < 1.1) {
                sub.upgrade.f1to1_1();
            } else if (config.version < 1.3) {
                sub.upgrade.f1_1to1_3();
            } else if (config.version < 1.4) {
                sub.upgrade.f1_3to1_4();
            } else if (config.version < 1.5) {
                sub.upgrade.f1_4to1_5();
            } else if (config.version < 1.6) {
                sub.upgrade.f1_5to1_6();
            } else if (config.version < 2) {
                sub.upgrade.f1_6to2_0();
            } else if (config.version < 2.2) {
                sub.upgrade.f2_0to2_2();
            } else if (config.version < 2.3) {
                sub.upgrade.f2_2to2_3();
            } else if (config.version < 2.4) {
                sub.upgrade.f2_3to2_4();
            } else if (config.version < 2.41) {
                sub.upgrade.f2_4to2_41();
            } else if (config.version < 2.5) {
                sub.upgrade.f2_41to2_5();
            } else if (config.version < 2.6) {
                sub.upgrade.f2_5to2_6();
            } else if (config.version < 2.7) {
                sub.upgrade.f2_6to2_7();
            } else if (config.version < 2.8) {
                sub.upgrade.f2_7to2_8();
            } else if (config.version < 2.9) {
                sub.upgrade.f2_8to2_9();
            } else if (config.version < 30) {
                sub.upgrade.f29tof30();
            } else if (config.version < 31) {
                sub.setBackup("31");
            } else if (config.version < 32) {
                sub.setBackup("32");
            } else if (config.version < 33) {
                sub.setBackup("33");
            } else if (config.version < 34) {
                sub.setBackup("34");
            } else if (config.version < 35) {
                sub.setBackup("35");
            } else if (config.version < 36) {
                sub.setBackup("36");
            } else if (config.version < 37) {
                sub.setBackup("37");
            } else if (config.version < 38) {
                sub.setBackup("38");
            } else if (config.version < 39) {
                sub.setBackup("39");
            } else if (config.version < 40) {
                sub.setBackup("40");
            } else if (config.version < 41) {
                sub.setBackup("41");
            } else if (config.version < 42) {
                sub.setBackup("42");
            } else if (config.version < 43) {
                sub.setBackup("43");
            } else if (config.version < 44) {
                sub.setBackup("44");
            } else if (config.version < 45) {
                sub.setBackup("45");
            } else if (config.version < 46) {
                sub.setBackup("46");
            }
        },
        _46: () => {
            config.version = 46;
            sub.saveConf(true);
        },
        _45: () => {
            config.touch = {};
            config.touch = defaultConf.touch;
            config.version = 45;
            sub.saveConf(true);
        },
        _44: () => {
            let _type = ["mges", "wges", "rges", "pop", "icon", "ctm"],
                i = 0,
                ii = 0;
            for (i = 0; i < _type.length; i++) {
                for (ii = 0; ii < config[_type[i]].actions.length; ii++) {
                    if (config[_type[i]].actions[ii].name === "close") {
                        if (!config[_type[i]].actions[ii].checks) {
                            config[_type[i]].actions[ii].checks = [];
                        }
                        config[_type[i]].actions[ii].checks.push({ type: "n_closePin", value: false });
                        config[_type[i]].actions[ii].checks.push({ type: "n_closeConfirm", value: false });
                    }
                }
            }
            config.version = 44;
            sub.saveConf(true);
        },
        _43: () => {
            config.general.settings.timeoutvalue = config.general.settings.timeoutvalue * 1000;
            const _array = ["allaction", "direct", "line", "note", "tip"];
            const _type = ["mges", "drg"];
            for (var i = 0; i < _type.length; i++) {
                for (var ii = 0; ii < _array.length; ii++) {
                    if (config[_type[i]].ui[_array[ii]] && config[_type[i]].ui[_array[ii]].opacity) {
                        config[_type[i]].ui[_array[ii]].opacity = config[_type[i]].ui[_array[ii]].opacity * 100;
                    }
                }
            }

            config.version = 43;
            sub.saveConf(true);
        },
        _42: () => {
            if (config.drg.settings.draggable === undefined) {
                config.drg.settings.draggable = true;
            }
            if (config.sdrg.settings.draggable === undefined) {
                config.sdrg.settings.draggable = true;
            }
            config.version = 42;
            sub.saveConf(true);
        },
        _41: () => {
            config.version = 41;
            sub.saveConf(true);
        },
        _40: () => {
            var _obj = [config.mges.actions, config.pop.actions, config.icon.actions, config.ctm.actions];
            for (var j = 0; j < _obj.length; j++) {
                for (var i = 0; i < _obj[j].length; i++) {
                    if (_obj[j][i].name === "openclip") {
                        _obj[j][i].selects.push({ type: "n_position", value: "s_default" });
                    }
                    if (_obj[j][i].name === "duplicate") {
                        _obj[j][i].selects = [{ type: "n_tab", value: "s_current" }];
                    }
                    if (_obj[j][i].tip) {
                        delete _obj[j][i].tip;
                    }
                }
            }
            if (config.wges.settings) {
                delete config.wges.settings;
            }
            if (config.rges.settings) {
                delete config.rges.settings;
            }
            config.version = 40;
            sub.saveConf(true);
        },
        _39: () => {
            config.drg.settings.drgtobox = true;
            config.sdrg.settings.drgtobox = true;
            config.version = 39;
            sub.saveConf(true);
        },
        _38: () => {
            if (config.mges.settings.model !== 2) {
                config.mges.settings.model = 4;
            }
            if (!config.apps) {
                config.apps = { appslist: { n_closebox: true } };
            }

            config.version = 38;
            sub.saveConf(true);
        },
        _37: () => {
            config.mges.actions = config.mges.mges;
            delete config.mges.mges;

            config.pop = defaultConf.pop;
            config.icon = defaultConf.icon;
            config.ctm = defaultConf.ctm;
            delete config.general.settings.icon;

            config.version = 37;
            sub.saveConf(true);
        },
        _36: () => {
            if (config.apps) {
                if (config.apps.rss) {
                    config.apps.rss.n_pin = config.apps.rss.n_pin === "s_unpin" ? false : true;
                }
                if (config.apps.recentht) {
                    config.apps.recentht.n_pin = config.apps.recentht.n_pin === "s_unpin" ? false : true;
                }
                if (config.apps.recentbk) {
                    config.apps.recentbk.n_pin = config.apps.recentbk.n_pin === "s_unpin" ? false : true;
                }
            }

            config.version = 36;
            sub.saveConf(true);
        },
        _35: () => {
            config.rges = defaultConf.rges;
            config.wges = defaultConf.wges;

            config.version = 35;
            sub.saveConf(true);
        },
        _34: async () => {
            config.general.sync.autosync = true;
            await chrome.storage.local.set({ first: "true" });
            const items = await chrome.storage.local.get();
            if (items & items.apps) {
                items.local = {};
                items.local.apps = items.apps;
                delete items.apps;
            }

            for (var i = 0; i < config.mges.mges.length; i++) {
                if (config.mges.mges[i].name === "newtab") {
                    for (var ii = 0; ii < config.mges.mges[i].selects.length; ii++) {
                        if (config.mges.mges[i].selects[ii].type === "n_optype") {
                            config.mges.mges[i].selects[ii].value = "s_new";
                        }
                    }
                }
            }

            config.version = 34;
            sub.saveConf(true);
        },
        _33: async () => {
            config.general.sync.autosync = true;
            await chrome.storage.local.set({ first: "true" });
            const items = await chrome.storage.local.get();
            if (items & items.apps) {
                items.local = {};
                items.local.apps = items.apps;
                delete items.apps;
            }
            config.version = 33;
            sub.saveConf(true);
        },
        _32: () => {
            var acname0 = ["mges", "drg", "sdrg"],
                acname1 = ["mges", "tdrg", "ldrg", "idrg", "tsdrg", "lsdrg", "isdrg"];
            for (var i = 0; i < acname0.length; i++) {
                for (var ii = 0; ii < acname1.length; ii++) {
                    for (
                        var iii = 0;
                        config[acname0[i]][acname1[ii]] && iii < config[acname0[i]][acname1[ii]].length;
                        iii++
                    ) {
                        var _obj = config[acname0[i]][acname1[ii]][iii];
                        !_obj.checks ? (_obj.checks = []) : null;
                        !_obj.selects ? (_obj.selects = []) : null;
                        if (_obj.name === "saveimg" || _obj.name === "saveimgas") {
                            for (var j = 0; _obj.selects && j < _obj.selects.length; j++) {
                                if (["n_notif", "n_dlbar"].contains(_obj.selects[j].type)) {
                                    _obj.checks.push({
                                        type: _obj.selects[j].type,
                                        value: _obj.selects[j].value === "s_yes" ? true : false,
                                    });
                                    _obj.selects.splice(j, 1);
                                }
                            }
                        } else if (_obj.name === "bookmarklnk") {
                            for (var j = 0; _obj.selects && j < _obj.selects.length; j++) {
                                if (["n_notif"].contains(_obj.selects[j].type)) {
                                    _obj.checks.push({
                                        type: _obj.selects[j].type,
                                        value: _obj.selects[j].value === "s_yes" ? true : false,
                                    });
                                    _obj.selects.splice(j, 1);
                                }
                            }
                        } else if (_obj.name === "savepage") {
                            _obj.checks = [];
                            _obj.checks.push({ type: "n_closetab", value: false });
                            _obj.checks.push({ type: "n_notif", value: false });
                            _obj.checks.push({ type: "n_dlbar", value: true });
                        } else if (_obj.name === "bookmark") {
                            _obj.checks = [];
                            _obj.checks.push({ type: "n_notif", value: false });
                            _obj.checks.push({ type: "n_closetab", value: false });
                        } else if (_obj.name === "newwin") {
                            for (var j = 0; _obj.selects && j < _obj.selects.length; j++) {
                                if (["n_winincog"].contains(_obj.selects[j].type)) {
                                    _obj.checks.push({
                                        type: _obj.selects[j].type,
                                        value: _obj.selects[j].value === "s_yes" ? true : false,
                                    });
                                    _obj.selects.splice(j, 1);
                                }
                            }
                        } else if (_obj.name === "reload") {
                            for (var j = 0; _obj.selects && j < _obj.selects.length; j++) {
                                if (["n_reload_clear"].contains(_obj.selects[j].type)) {
                                    _obj.checks.push({
                                        type: _obj.selects[j].type,
                                        value: _obj.selects[j].value === "s_yes" ? true : false,
                                    });
                                    _obj.selects.splice(j, 1);
                                }
                            }
                        } else if (_obj.name === "script") {
                            for (var j = 0; _obj.selects && j < _obj.selects.length; j++) {
                                if (["n_jq"].contains(_obj.selects[j].type)) {
                                    _obj.checks.push({
                                        type: _obj.selects[j].type,
                                        value: _obj.selects[j].value === "s_yes" ? true : false,
                                    });
                                    _obj.selects.splice(j, 1);
                                }
                            }
                        } else if (
                            [
                                "next",
                                "previous",
                                "newtab",
                                "open",
                                "openclip",
                                "txtsearch",
                                "openlnk",
                                "openimg",
                                "imgsearch",
                                "crpages",
                                "source",
                                "",
                            ].contains(_obj.name)
                        ) {
                            for (var j = 0; _obj.selects && j < _obj.selects.length; j++) {
                                if (["n_pin"].contains(_obj.selects[j].type)) {
                                    _obj.checks.push({
                                        type: _obj.selects[j].type,
                                        value: _obj.selects[j].value === "s_pin" ? true : false,
                                    });
                                    _obj.selects.splice(j, 1);
                                }
                            }
                        } else if (_obj.name === "scroll") {
                            for (var j = 0; _obj.selects && j < _obj.selects.length; j++) {
                                if (["n_effect"].contains(_obj.selects[j].type)) {
                                    _obj.checks.push({
                                        type: _obj.selects[j].type,
                                        value: _obj.selects[j].value === "s_on" ? true : false,
                                    });
                                    _obj.selects.splice(j, 1);
                                }
                            }
                        } else if (_obj.name === "pin") {
                            _obj.selects = [];
                            _obj.selects.push({ type: "n_tab", value: "s_current" });
                        }
                        _obj.checks.length === 0 ? delete _obj.checks : null;
                        _obj.selects.length === 0 ? delete _obj.selects : null;
                    }
                }
            }
            if (!config.apps) {
            } else {
                if (config.apps.rss) {
                    config.apps.rss.n_pin = config.apps.rss.n_pin === "s_pin" ? true : false;
                }
                if (config.apps.recentht) {
                    config.apps.recentht.n_pin = config.apps.recentht.n_pin === "s_pin" ? true : false;
                }
                if (config.apps.recentbk) {
                    config.apps.recentbk.n_pin = config.apps.recentbk.n_pin === "s_pin" ? true : false;
                }
            }
            config.version = 32;
            sub.saveConf(true);
        },
        _31: () => {
            var _drgtype0 = ["drg", "sdrg"];
            var _drgtype = ["tdrg", "ldrg", "idrg", "tsdrg", "lsdrg", "isdrg"];
            var _erraction = ["txtsearch", "openlnk", "openimg", "imgsearch"];
            var _des = ["Search texts in background", "Open link in background", "Open image in background"];
            for (var i = 0; i < _drgtype0.length; i++) {
                for (var ii = 0; ii < _drgtype.length; ii++) {
                    for (
                        var iii = 0;
                        config[_drgtype0[i]][_drgtype[ii]] && iii < config[_drgtype0[i]][_drgtype[ii]].length;
                        iii++
                    ) {
                        if (
                            _erraction.contains(config[_drgtype0[i]][_drgtype[ii]][iii].name) &&
                            _des.contains(
                                config[_drgtype0[i]][_drgtype[ii]][iii].mydes
                                    ? config[_drgtype0[i]][_drgtype[ii]][iii].mydes.value
                                    : null
                            )
                        ) {
                            for (var j = 0; j < config[_drgtype0[i]][_drgtype[ii]][iii].selects.length; j++) {
                                if (config[_drgtype0[i]][_drgtype[ii]][iii].selects[j].type === "n_optype") {
                                    config[_drgtype0[i]][_drgtype[ii]][iii].selects[j].value = "s_back";
                                }
                            }
                        }
                    }
                }
            }
            for (var i = 0; i < config.mges.mges.length; i++) {
                if (config.mges.mges[i].name === "newtab") {
                    for (var ii = 0; config.mges.mges[i].selects && ii < config.mges.mges[i].selects.length; ii++) {
                        if (
                            config.mges.mges[i].selects[ii].type === "n_optype" &&
                            config.mges.mges[i].selects[ii].value === "new"
                        ) {
                            config.mges.mges[i].selects[ii].value = "s_new";
                        }
                    }
                }
            }
            config.version = 31;
            sub.saveConf(true);
        },
        f1to1_1: () => {
            for (var i = 0; i < config.mges.mges.length; i++) {
                if (config.mges.mges[i].name === "test") {
                    config.mges.mges.splice(i, 1);
                    break;
                }
            }
            for (var i = 0; i < config.mges.mges.length; i++) {
                if (config.mges.mges[i].name === "txtsearch" || config.mges.mges[i].name === "imgsearch") {
                    config.mges.mges[i].selects.push({ type: "n_encoding", value: "s_uri" });
                }
                for (var ii = 0; config.mges.mges[i].selects && ii < config.mges.mges[i].selects.length; ii++) {
                    if (config.mges.mges[i].selects[ii].type.indexOf("s_") === 0) {
                        config.mges.mges[i].selects[ii].type = config.mges.mges[i].selects[ii].type.replace("s_", "n_");
                    }
                    if (
                        config.mges.mges[i].selects[ii].type === "txtengine" ||
                        config.mges.mges[i].selects[ii].type === "imgengine"
                    ) {
                        config.mges.mges[i].selects[ii].type = "n_" + config.mges.mges[i].selects[ii].type;
                    }
                }
            }
            var arraydrg = ["tdrg", "ldrg", "idrg"];
            for (var i = 0; i < 3; i++) {
                for (var ii = 0; ii < config.drg[arraydrg[i]].length; ii++) {
                    if (
                        config.drg[arraydrg[i]][ii].name === "txtsearch" ||
                        config.drg[arraydrg[i]][ii].name === "imgsearch"
                    ) {
                        config.drg[arraydrg[i]][ii].selects.push({ type: "n_encoding", value: "s_uri" });
                    }
                    for (
                        var iii = 0;
                        config.drg[arraydrg[i]][ii].selects && iii < config.drg[arraydrg[i]][ii].selects.length;
                        iii++
                    ) {
                        if (config.drg[arraydrg[i]][ii].selects[iii].type.indexOf("s_") === 0) {
                            config.drg[arraydrg[i]][ii].selects[iii].type = config.drg[arraydrg[i]][ii].selects[
                                iii
                            ].type.replace("s_", "n_");
                        }
                        if (
                            config.drg[arraydrg[i]][ii].selects[iii].type === "txtengine" ||
                            config.drg[arraydrg[i]][ii].selects[iii].type === "imgengine"
                        ) {
                            config.drg[arraydrg[i]][ii].selects[iii].type =
                                "n_" + config.drg[arraydrg[i]][ii].selects[iii].type;
                        }
                    }
                }
            }
            var arraydrg = ["tsdrg", "lsdrg", "isdrg"];
            for (var i = 0; i < 3; i++) {
                for (var ii = 0; ii < config.sdrg[arraydrg[i]].length; ii++) {
                    if (
                        config.sdrg[arraydrg[i]][ii].name === "txtsearch" ||
                        config.sdrg[arraydrg[i]][ii].name === "imgsearch"
                    ) {
                        config.sdrg[arraydrg[i]][ii].selects.push({ type: "n_encoding", value: "s_uri" });
                    }
                    for (
                        var iii = 0;
                        config.sdrg[arraydrg[i]][ii].selects && iii < config.sdrg[arraydrg[i]][ii].selects.length;
                        iii++
                    ) {
                        if (config.sdrg[arraydrg[i]][ii].selects[iii].type.indexOf("s_") === 0) {
                            config.sdrg[arraydrg[i]][ii].selects[iii].type = config.sdrg[arraydrg[i]][ii].selects[
                                iii
                            ].type.replace("s_", "n_");
                        }
                        if (
                            config.sdrg[arraydrg[i]][ii].selects[iii].type === "txtengine" ||
                            config.sdrg[arraydrg[i]][ii].selects[iii].type === "imgengine"
                        ) {
                            config.sdrg[arraydrg[i]][ii].selects[iii].type =
                                "n_" + config.sdrg[arraydrg[i]][ii].selects[iii].type;
                        }
                    }
                }
            }
            config.version = 1.1;
            sub.saveConf(true);
        },
        f1_1to1_3: () => {
            var en = ["txtengine", "imgengine"];
            for (var i = 0; i < en.length; i++) {
                for (var ii = 0; ii < config.general.engine[en[i]].length; ii++) {
                    if (!config.general.engine[en[i]][ii]) {
                        config.general.engine[en[i]].splice(ii, 1);
                    }
                }
            }
            config.version = 1.3;
            sub.saveConf(true);
        },
        f1_3to1_4: () => {
            config.general.settings.notif = false;
            for (var i = 0; i < config.mges.mges.length; i++) {
                if (["up", "down", "top", "bottom"].contains(config.mges.mges[i].name)) {
                    config.mges.mges[i].selects.push({
                        type: "n_scroll",
                        value: "s_" + config.mges.mges[i].name,
                    });
                    config.mges.mges[i].name = "scroll";
                }
            }
            config.version = 1.4;
            sub.saveConf(true);
        },
        f1_4to1_5: () => {
            for (var i = 0; i < config.mges.mges.length; i++) {
                if (config.mges.mges[i].name === "scroll" && !config.mges.mges[i].mydes.type) {
                    config.mges.mges[i].mydes.type = true;
                    for (var ii = 0; ii < config.mges.mges[i].selects.length; ii++) {
                        if (config.mges.mges[i].selects[ii].type === "n_scroll") {
                            config.mges.mges[i].mydes.value = getDefault.i18n(
                                "init_scroll_" + config.mges.mges[i].selects[ii].value.substr(2)
                            );
                        }
                    }
                }
            }
            config.version = 1.5;
            sub.saveConf(true);
        },
        f1_5to1_6: () => {
            config.general.settings.lang = "lang_en";
            config.version = 1.6;
            sub.saveConf(true);
        },
        f1_6to2_0: () => {
            config.plus = {};
            config.plus.menuPin = false;
            if (config.general.engine.txtengine[0].url === "https://www.google.com/search?hl=zh-CN&q=%s") {
                config.general.engine.txtengine[0].url = "https://www.google.com/search?q=%s";
            }
            config.version = 2;
            sub.saveConf(true);
        },
        f2_0to2_2: () => {
            for (var i = 0; i < config.mges.mges.length; i++) {
                if (config.mges.mges[i].name === "close") {
                    config.mges.mges[i].checks = [];
                    config.mges.mges[i].checks[0] = { type: "n_close_keep", value: false };
                }
                if (config.mges.mges[i].name === "recentbk" || config.mges.mges[i].name === "recentht") {
                    config.mges.mges[i].selects = [];
                    config.mges.mges[i].checks = [];
                    config.mges.mges[i].selects = [
                        { type: "n_target", value: "s_new" },
                        { type: "n_new_position", value: "s_default" },
                        { type: "n_pin", value: false },
                    ];
                    config.mges.mges[i].checks[0] = { type: "n_appwin_close", value: true };
                }
            }
            config.version = 2.2;
            sub.saveConf(true);
        },
        f2_2to2_3: () => {
            for (var i = 0; i < config.mges.mges.length; i++) {
                if (config.mges.mges[i].name === "zoom1") {
                    config.mges.mges[i].name = "zoom";
                }
            }
            config.version = 2.3;
            sub.saveConf(true);
        },
        f2_3to2_4: () => {
            for (var i = 0; i < config.mges.mges.length; i++) {
                var _flag = false,
                    _obj = config.mges.mges[i];
                if (
                    _obj.name === "recentbk" ||
                    _obj.name === "recentht" ||
                    _obj.name === "recentclosed" ||
                    _obj.name === "synced"
                ) {
                    _flag = true;
                } else if (_obj.name === "rss") {
                    if (!config.apps) {
                        config.apps = {};
                    }
                    if (!config.apps.rss) {
                        config.apps.rss = {};
                    }
                    if (!config.apps.rss.feed) {
                        config.apps.rss.feed = [];
                    }
                    if (!config.apps.rss.config) {
                        config.apps.rss.config = {
                            n_target: "s_back",
                            n_index_new: "s_default",
                            n_pin: "s_unpin",
                            n_appwin_close: false,
                        };
                    }
                    config.apps.rss.feed.push(_obj.texts[0].value);
                    _flag = true;
                }
                if (_flag) {
                    config.mges.mges[i] = {};
                    config.mges.mges[i] = {
                        name: _obj.name,
                        direct: _obj.direct,
                        mydes: _obj.mydes,
                        texts: [],
                        checks: [],
                        selects: [],
                    };
                }
            }
            delete config.plus.menuPin;
            config.version = 2.41;
            sub.saveConf(true);
        },
        f2_4to2_41: () => {
            config.mges.mges = defaultConf.mges.mges;
            config.version = 2.41;
            sub.saveConf(true);
            alert(
                "Sorry! Due to a bug, the configuration can't be migrated to the latest version of Grand Gesture. The mouse gestures have been reset!"
            );
        },
        f2_41to2_5: () => {
            if (config.general.settings.boxzoom === undefined) {
                config.general.settings.boxzoom = false;
            }
            config.version = 2.5;
            sub.saveConf(true);
        },
        f2_5to2_6: () => {
            for (var i = 0; i < config.general.engine.txtengine.length; i++) {
                if (config.general.engine.txtengine[i].url === "https://image.baidu.com/i?objurl=%s") {
                    config.general.engine.txtengine[i].url = "https://www.baidu.com/s?wd=%s";
                }
            }
            config.version = 2.6;
            sub.saveConf(true);
        },
        f2_6to2_7: () => {
            if (config.version === 2.61) {
                config.mges.ui.direct.width = defaultConf.mges.ui.direct.width;
                config.mges.ui.direct.style = defaultConf.mges.ui.direct.style;
                config.mges.ui.allaction = defaultConf.mges.ui.allaction;
                config.drg.ui.direct.width = defaultConf.drg.ui.direct.width;
                config.drg.ui.direct.style = defaultConf.drg.ui.direct.style;
                config.drg.ui.allaction = defaultConf.drg.ui.allaction;
            } else if (config.version === 2.62) {
            } else {
                config.mges.ui.note = defaultConf.mges.ui.note;
                config.mges.ui.tip.withdir = false;
                config.mges.ui.direct.width = defaultConf.mges.ui.direct.width;
                config.mges.ui.direct.style = defaultConf.mges.ui.direct.style;
                config.mges.ui.allaction = defaultConf.mges.ui.allaction;
                config.drg.ui.note = defaultConf.drg.ui.note;
                config.drg.ui.tip.withdir = true;
                config.drg.ui.direct.width = defaultConf.drg.ui.direct.width;
                config.drg.ui.direct.style = defaultConf.drg.ui.direct.style;
                config.drg.ui.allaction = defaultConf.drg.ui.allaction;
            }
            config.version = 2.7;
            sub.saveConf(true);
        },
        f2_7to2_8: () => {
            var obj = [
                config.mges.mges,
                config.drg.tdrg,
                config.drg.ldrg,
                config.drg.idrg,
                config.sdrg.tsdrg,
                config.sdrg.lsdrg,
                config.sdrg.isdrg,
            ];
            for (var ii = 0; ii < obj.length; ii++) {
                for (var i = 0; i < obj[ii].length; i++) {
                    if (obj[ii][i].mydes && !obj[ii][i].mydes.value) {
                        delete obj[ii][i].mydes;
                    }
                    if (obj[ii][i].note && !obj[ii][i].note.value) {
                        delete obj[ii][i].note;
                    }
                    if (obj[ii][i].selects && obj[ii][i].selects.length === 0) {
                        delete obj[ii][i].selects;
                    }
                    if (obj[ii][i].texts && obj[ii][i].texts.length === 0) {
                        delete obj[ii][i].texts;
                    }
                    if (obj[ii][i].checks && obj[ii][i].checks.length === 0) {
                        delete obj[ii][i].checks;
                    }
                    if (obj[ii][i].ranges && obj[ii][i].ranges.length === 0) {
                        delete obj[ii][i].ranges;
                    }

                    if (obj[ii][i].type) {
                        delete obj[ii][i].type;
                    }
                    if (obj[ii][i].tip) {
                        delete obj[ii][i].tip;
                    }
                    if (obj[ii][i].name === "script" && obj[ii][i].texts) {
                        delete obj[ii][i].texts;
                    }
                }
            }
            config.general.settings.theme = "colorful";
            config.version = 2.8;
            sub.saveConf(true);
        },
        f2_8to2_9: () => {
            config.apps ? delete config.apps : null;
            config.general.settings.boxzoom ? delete config.general.settings.boxzoom : null;
            var _array = [
                "n_reload",
                "n_stop",
                "n_target_np",
                "n_new_position",
                "n_close",
                "n_target",
                "n_switchtab",
                "n_move",
                "n_detach",
                "n_copytabele_target",
                "n_win_type",
                "n_win_incog",
                "n_bookmark",
                "n_savepage",
                "n_mail_target",
            ];
            var _obj = {
                n_reload: "n_tab",
                n_stop: "n_tab",
                n_target_np: "n_optype",
                n_new_position: "n_position",
                n_close: "n_tab",
                n_target: "n_optype",
                n_switchtab: "n_position",
                n_move: "n_position_lrhl",
                n_detach: "n_tab",
                n_copytabele_target: "n_tab_single",
                n_win_type: "n_wintype",
                n_win_incog: "n_winincog",
                n_bookmark: "n_tab",
                n_savepage: "n_tab",
                n_mail_target: "n_tab",
            };

            var _arrayobj = [
                config.sdrg.tsdrg,
                config.sdrg.isdrg,
                config.sdrg.lsdrg,
                config.drg.tdrg,
                config.drg.ldrg,
                config.drg.idrg,
                config.mges.mges,
            ];
            for (var i = 0; i < _arrayobj.length; i++) {
                for (var ii = 0; ii < _arrayobj[i].length; ii++) {
                    for (var iii = 0; _arrayobj[i][ii].selects && iii < _arrayobj[i][ii].selects.length; iii++) {
                        if (_array.contains(_arrayobj[i][ii].selects[iii].type)) {
                            _arrayobj[i][ii].selects[iii].type = _obj[_arrayobj[i][ii].selects[iii].type];
                        }
                    }
                }
            }

            for (var i = 0; i < config.mges.mges.length; i++) {
                if (config.mges.mges[i].name === "switchtab") {
                    config.mges.mges[i].selects[0].type = "n_tab_lrhl";
                }
                if (config.mges.mges[i].name === "saveimg") {
                    config.mges.mges[i].selects.push({ type: "n_notif", value: "s_yes" });
                }
                if (config.mges.mges[i].name === "bookmark") {
                    config.mges.mges[i].selects.push({ type: "n_notif", value: "s_yes" });
                }
            }

            for (var i = 0; i < config.general.script.script.length; i++) {
                config.general.script.script[i].content = config.general.script.script[i].script;
                delete config.general.script.script[i].script;
            }
            for (var i = 0; i < config.general.script.script.length; i++) {
                delete config.general.script.script[i].script;
            }
            for (var i = 0; i < config.general.engine.txtengine.length; i++) {
                config.general.engine.txtengine[i].content = config.general.engine.txtengine[i].url;
            }
            for (var i = 0; i < config.general.engine.txtengine.length; i++) {
                delete config.general.engine.txtengine[i].url;
            }
            for (var i = 0; i < config.general.engine.imgengine.length; i++) {
                config.general.engine.imgengine[i].content = config.general.engine.imgengine[i].url;
            }
            for (var i = 0; i < config.general.engine.imgengine.length; i++) {
                delete config.general.engine.imgengine[i].url;
            }

            config.general.settings.appnotif = true;
            config.version = 2.9;
            sub.saveConf(true);
        },
        f29tof30: () => {
            var _apps = [
                "rss",
                "tablist",
                "random",
                "extmgm",
                "recentbk",
                "recentht",
                "recentclosed",
                "synced",
                "base64",
                "qr",
                "numc",
                "speaker",
            ];
            for (var i = 0; i < _apps.length; i++) {
                if (!config.apps) {
                    break;
                }
                if (config.apps[_apps[i]] && config.apps[_apps[i]].config) {
                    if (typeof config.apps[_apps[i]].config === "object") {
                        delete config.apps[_apps[i]];
                    }
                }
            }

            for (var i = 0; i < config.drg.idrg.length; i++) {
                if (config.drg.idrg[i].name === "saveimg") {
                    config.drg.idrg[i].selects ? null : (config.drg.idrg[i].selects = []);
                    config.drg.idrg[i].selects.push({ type: "n_notif", value: "s_yes" });
                }
            }
            for (var i = 0; i < config.drg.ldrg.length; i++) {
                if (config.drg.ldrg[i].name === "bookmark") {
                    config.drg.ldrg[i].selects.push({ type: "n_notif", value: "s_yes" });
                }
            }
            for (var i = 0; i < config.sdrg.isdrg.length; i++) {
                if (config.sdrg.isdrg[i].name === "saveimg") {
                    config.sdrg.isdrg[i].selects ? null : (config.sdrg.isdrg[i].selects = []);
                    config.sdrg.isdrg[i].selects.push({ type: "n_notif", value: "s_yes" });
                }
            }
            for (var i = 0; i < config.sdrg.lsdrg.length; i++) {
                if (config.sdrg.lsdrg[i].name === "bookmark") {
                    config.sdrg.lsdrg[i].selects.push({ type: "n_notif", value: "s_yes" });
                }
            }

            var _drgtype0 = ["drg", "sdrg"];
            var _drgtype = ["tdrg", "ldrg", "idrg", "tsdrg", "lsdrg", "isdrg"];
            var _erraction = ["txtsearch", "openlnk", "openimg", "imgsearch"];
            var _errobj = {
                txtsearch: [
                    { type: "n_txtengine", value: "0" },
                    { type: "n_encoding", value: "s_none" },
                    { type: "n_optype", value: "s_current" },
                    { type: "n_position", value: "s_default" },
                    { type: "n_pin", value: "s_unpin" },
                ],
                openlnk: [
                    { type: "n_optype", value: "s_current" },
                    { type: "n_position", value: "s_default" },
                    { type: "n_pin", value: "s_unpin" },
                ],
                openimg: [
                    { type: "n_optype", value: "s_current" },
                    { type: "n_position", value: "s_default" },
                    { type: "n_pin", value: "s_unpin" },
                ],
                imgsearch: [
                    { type: "n_imgengine", value: "0" },
                    { type: "n_encoding", value: "s_none" },
                    { type: "n_optype", value: "s_current" },
                    { type: "n_position", value: "s_default" },
                    { type: "n_pin", value: "s_unpin" },
                ],
            };
            for (var i = 0; i < _drgtype0.length; i++) {
                for (var ii = 0; ii < _drgtype.length; ii++) {
                    for (
                        var iii = 0;
                        config[_drgtype0[i]][_drgtype[ii]] && iii < config[_drgtype0[i]][_drgtype[ii]].length;
                        iii++
                    ) {
                        if (
                            _erraction.contains(config[_drgtype0[i]][_drgtype[ii]][iii].name) &&
                            !config[_drgtype0[i]][_drgtype[ii]][iii].selects
                        ) {
                            config[_drgtype0[i]][_drgtype[ii]][iii].selects = {};
                            config[_drgtype0[i]][_drgtype[ii]][iii].selects =
                                _errobj[config[_drgtype0[i]][_drgtype[ii]][iii].name];
                        }
                    }
                }
            }

            config.mges.settings.txttourl = true;
            config.mges.settings.lnktoimg = false;
            config.version = 30;
            sub.saveConf(true);
        },
    },
    funOnMessage: async (message, sender, _sendResponse) => {
        if (message?.type) {
            console.log("-->", { type: message.type, message });
        } else {
            console.log("-->", message);
        }
        const sendResponse = async (...params) => {
            if (params[0].type && 1 === params.length) {
                console.log("<--", { type: params[0].type, message: params[0] });
            } else {
                console.log("<--", ...params);
            }
            await _sendResponse(...params);
        };
        sub.message = message;
        const getConf = () => {
            let drawType = message.drawType,
                confType = config[drawType[0]][drawType[1]],
                direct = message.direct,
                theConf = "";
            for (var i = 0; i < confType.length; i++) {
                if (confType[i].direct === direct) {
                    theName = confType[i].name;
                    theConf = confType[i];
                    break;
                }
                if (i === confType.length - 1) {
                    theConf = { name: null /*,mydes:null*/ };
                }
            }
            return theConf;
        };
        switch (message.type) {
            case "evt_getconf":
            case "pop_getconf":
            case "opt_getconf":
                const _conf = {
                    type: message.type,
                    defaultConf: defaultConf,
                    config: config,
                    devMode: devMode,
                    os: sub.cons.os,
                    reason: sub.cons.reason,
                };
                message.type === "opt_getconf" ? (sub.cons.reason = "update") : null;
                sendResponse(_conf);
                break;
            case "opt_getpers":
                sub.checkPermission(
                    message.value.thepers,
                    message.value.theorgs,
                    message.value.theFunction,
                    message.value.msg
                );
                break;
            case "per_getconf":
                sendResponse(sub.cons.permissions);
                break;
            case "apps_saveconf":
                sub.action.apps_saveconf(message, sendResponse);
                break;
            case "apps_test":
                const _fun = async () => {
                    if (message.appjs) {
                        await chrome.scripting.executeScript({
                            args: [message.apptype],
                            code: apptype => sue.apps[apptype].initUI(),
                            injectImmediately: true,
                            target: { tabId: sub.curTab.id },
                        });
                        return;
                    }
                    if (message.apptype === "base64") {
                        await chrome.scripting.executeScript({
                            files: ["js/base64.js"],
                            injectImmediately: true,
                            target: { tabId: sub.curTab.id },
                            world: chrome.scripting.ExecutionWorld.ISOLATED,
                        });
                    } else if (
                        message.apptype === "qr" ||
                        message.apptype === "magnet" ||
                        message.apptype === "shorturl"
                    ) {
                        await chrome.scripting.executeScript({
                            files: ["js/qrcode.js"],
                            injectImmediately: true,
                            target: { tabId: sub.curTab.id },
                            world: chrome.scripting.ExecutionWorld.ISOLATED,
                        });
                    } else if (message.apptype === "tbkjx") {
                        await chrome.scripting.executeScript({
                            files: ["js/purify.js", "js/qrcode.js"],
                            injectImmediately: true,
                            target: { tabId: sub.curTab.id },
                            world: chrome.scripting.ExecutionWorld.ISOLATED,
                        });
                    } else if (message.apptype === "notepad") {
                        await chrome.scripting.executeScript({
                            files: ["js/md5.js"],
                            injectImmediately: true,
                            target: { tabId: sub.curTab.id },
                            world: chrome.scripting.ExecutionWorld.ISOLATED,
                        });
                    }
                    // insert sortable.js
                    if (["homepage", "appslist", "jslist", "extmgm"].includes(message.apptype)) {
                        await chrome.scripting.insertCSS({
                            files: [`css/inject/${message.apptype}.css`],
                            target: { tabId: sub.curTab.id },
                        });
                        await chrome.scripting.executeScript({
                            files: ["js/sortable.js", `js/inject/${message.apptype}.js`],
                            injectImmediately: true,
                            target: { tabId: sub.curTab.id },
                            world: chrome.scripting.ExecutionWorld.ISOLATED,
                        });
                        //after insert js, run sue.apps.homepage.itemCTM() for miniapps-homepage
                        if (message.apptype === "homepage" && message.ctm) {
                            await chrome.scripting.executeScript({
                                args: [message.apptype],
                                func: apptype => sue.apps[apptype].itemCTM(),
                                injectImmediately: true,
                                target: { tabId: sub.curTab.id },
                                world: chrome.scripting.ExecutionWorld.MAIN,
                            });
                        }
                        return;
                    }
                    await chrome.scripting.insertCSS({
                        files: [`css/inject/${message.apptype}.css`],
                        target: { tabId: sub.curTab.id },
                    });
                    await chrome.scripting.executeScript({
                        files: [`js/inject/${message.apptype}.js`],
                        injectImmediately: true,
                        target: { tabId: sub.curTab.id },
                        world: chrome.scripting.ExecutionWorld.ISOLATED,
                    });
                };
                if (!message.value) {
                    await chrome.scripting.insertCSS({
                        files: ["css/apps_basic.css"],
                        target: { tabId: sub.curTab.id },
                    });
                    await chrome.scripting.executeScript({
                        files: ["js/apps_basic.js"],
                        injectImmediately: true,
                        target: { tabId: sub.curTab.id },
                        world: chrome.scripting.ExecutionWorld.ISOLATED,
                    });
                }
                await _fun();
                sendResponse({ value: true });
                break;
            case "getappconf":
                sendResponse(sub.cons[message.apptype]);
                break;
            case "apps_getvalue":
                sendResponse({
                    type: message.apptype,
                    config: config.apps[message.apptype],
                    value: sub.cons[message.apptype],
                });
                break;
            case "action_np":
                sub.action.next();
                break;
            case "reloadconf":
                config = message.value;
                await loadConfig();
                break;
            case "saveConf":
                sub.cons.lastConf = config;
                config = message.value;
                sub.saveConf(true, sendResponse);
                break;
            case "per_clear":
                sub.cons.permissions = {};
                break;
            case "getpers":
                sub.initpers();
                break;
            case "scroll":
                sendResponse({ type: sub.cons.scroll.type, effect: sub.cons.scroll.effect });
                break;
            case "zoom":
                sendResponse({ value: sub.cons.zoom });
                break;
            case "action_pop":
                const _index = message.index;
                sub.theConf = config.pop.actions[_index];
                if (config.pop.settings.type === "front") {
                    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                        sub.curTab = tabs[0];
                        chrome.tabs.sendMessage(tabs[0].id, { type: "pop" }, response => {
                            if (response && response.type === "action_pop") {
                                sub.message = response;
                                sub.extID = chrome.runtime.id ? chrome.runtime.id : null;
                                sub.initCurrent(null, sub.theConf);
                            }
                        });
                    });
                } else {
                    sub.initCurrent(sender, sub.theConf);
                }
                //set last as default
                if (_index !== 0 && config.pop.settings.last) {
                    config.pop.actions[_index] = config.pop.actions[0];
                    config.pop.actions[0] = sub.theConf;
                    sub.saveConf();
                }
                break;
            case "action_rges":
                const rgesType = message.sendValue.buttons === 1 ? 0 : 1;
                /*theConf=config.rges.actions[rgesType]*/
                sub.theConf = config.rges.actions[rgesType];
                sub.initCurrent(sender, sub.theConf);
                break;
            case "action_wges":
                let _id;
                if (message.sendValue.buttons === 1) {
                    if (message.sendValue.wheelDelta < 0) {
                        _id = 0;
                    } else {
                        _id = 1;
                    }
                } else if (message.sendValue.buttons === 2) {
                    if (message.sendValue.wheelDelta < 0) {
                        _id = 2;
                    } else _id = 3;
                }
                sub.theConf = config.wges.actions[_id];
                if (sub.theConf.name === "scroll") {
                    //fix action scrollame});
                    window.setTimeout(() => {
                        sub.initCurrent(sender, sub.theConf);
                    }, 200);
                    return;
                }
                sub.initCurrent(sender, sub.theConf);
                break;
            case "action_dca":
                sub.theConf = config.dca.actions[0];
                if (sub.theConf.name === "scroll") {
                    //fix action scrollame});
                    window.setTimeout(() => {
                        sub.initCurrent(sender, sub.theConf);
                    }, 200);
                    return;
                }
                sub.initCurrent(sender, sub.theConf);
                break;
            case "gettip":
                sub.theConf = getConf();
                const _sendConf = {};
                _sendConf.config = sub.theConf;
                _sendConf.type = "tip";
                _sendConf.tip = sub.theConf.name
                    ? sub.theConf.mydes && sub.theConf.mydes.type && sub.theConf.mydes.value
                        ? sub.theConf.mydes.value
                        : sub.getI18n(sub.theConf.name)
                    : null;
                _sendConf.note = sub.theConf.note;
                _sendConf.allaction = [];
                //get all actions
                const _confType = config[message.drawType[0]][message.drawType[1]];
                if (config[sub.message.drawType[0]].ui.allaction.enable) {
                    for (let i = 0; i < _confType.length; i++) {
                        if (
                            _confType[i].direct.indexOf(message.direct) === 0 &&
                            _confType[i].direct.length > message.direct.length
                        ) {
                            const _action = {
                                direct: _confType[i].direct,
                                tip:
                                    _confType[i].mydes && _confType[i].mydes.type && _confType[i].mydes.value
                                        ? _confType[i].mydes.value
                                        : sub.getI18n(_confType[i].name),
                            };
                            _sendConf.allaction.push(_action);
                        }
                        if (i === _confType.length - 1 && _sendConf.allaction.length === 0) {
                            _sendConf.allaction = null;
                        }
                    }
                }
                sendResponse(_sendConf);
                break;
            case "action_ksa":
                sub.theConf = config.ksa.actions[sub.message.id];
                if (sub.theConf.name === "paste") {
                    //for action paste
                    sendResponse(sub.theConf); //error log, if none sendResponse
                    const tabId = (await chrome.tabs.query({ active: true, currentWindow: true }))?.[0]?.id;
                    if (!tabId) {
                        return;
                    }
                    sub.checkPermission(["clipboardRead"], null, async () => {
                        const result = await chrome.scripting.executeScript({
                            injectImmediately: true,
                            func: () => navigator.clipboard.readText(),
                            target: { tabId },
                            world: chrome.scripting.ExecutionWorld.ISOLATED,
                        });
                        const clipboardContent = result[0]?.result;
                        if (clipboardContent) {
                            sub.theConf.paste = clipboardContent;
                            sub.theConf.typeAction = "paste";
                            chrome.tabs.sendMessage(
                                sender.tab.id,
                                { type: "actionPaste", value: sub.theConf },
                                response => {}
                            );
                        }
                    });
                } else {
                    sendResponse(sub.theConf);
                }
                sub.initCurrent(sender, sub.theConf);
                break;
            case "action":
                sub.theConf = getConf();
                sub.theConf.type = "action";
                if (sub.theConf.name === "paste") {
                    //for action paste
                    sendResponse(sub.theConf); //error log, if none sendResponse
                    const tabId = (await chrome.tabs.query({ active: true, currentWindow: true }))?.[0]?.id;
                    if (!tabId) {
                        return;
                    }
                    sub.checkPermission(["clipboardRead", "clipboardWrite"], null, async () => {
                        const result = await chrome.scripting.executeScript({
                            injectImmediately: true,
                            func: () => navigator.clipboard.readText(),
                            target: { tabId },
                            world: chrome.scripting.ExecutionWorld.ISOLATED,
                        });
                        const clipboardContent = result[0]?.result;
                        if (clipboardContent) {
                            console.log("sending clipboard content:", clipboardContent);
                            chrome.tabs.sendMessage(
                                sender.tab.id,
                                { type: "actionPaste", value: { paste: clipboardContent } },
                                response => {}
                            );
                        }
                    });
                } else {
                    sendResponse(sub.theConf);
                }
                sub.initCurrent(sender, sub.theConf);
                break;
            case "appsAction":
                sub.apps[message.app][message.action](message, sender, sendResponse);
                break;
            case "extdisable":
                await sub.action.extdisable();
                break;
        }
    },
    appsAction: (message, sendResponse) => {
        sub.apps[message.app][message.action](message, sendResponse);
    },
    apps: {
        autoreload: {
            reload: function (message, sender, sendResponse) {
                sub.checkPermission(["alarms"], undefined, async () => {
                    if (message.value.type === "start") {
                        if (!sub.cons.autoreload) {
                            sub.cons.autoreload = {};
                            sub.cons.autoreload[sender.tab.id] = {};
                        } else if (!sub.cons.autoreload[sender.tab.id]) {
                            sub.cons.autoreload[sender.tab.id] = {};
                        }
                        await this.clear(message, sender, sendResponse);
                        sub.cons.autoreload[sender.tab.id].timeRemain = message.value.interval;
                        sub.cons.autoreload[sender.tab.id].iconCountdown = message.value.iconCountdown;
                        sub.cons.autoreload[sender.tab.id].bypassCache = message.value.bypassCache;

                        alarmCounter++;
                        sub.cons.autoreload[sender.tab.id].countDown =
                            `reload-${sender.tab.id}-countdown-${alarmCounter}`;
                        await chrome.alarms.create(sub.cons.autoreload[sender.tab.id].countDown, {
                            periodInMinutes: 1 / 60,
                        });
                        chrome.alarms.onAlarm.addListener(alarm => {
                            if (alarm.name === sub.cons.autoreload[sender.tab.id].countDown) {
                                sub.cons.autoreload[sender.tab.id].timeRemain--;
                                if (sub.cons.autoreload[sender.tab.id].iconCountdown) {
                                    chrome.action.setBadgeText({
                                        text: sub.cons.autoreload[sender.tab.id].timeRemain.toString(),
                                        tabId: sender.tab.id,
                                    });
                                }
                            }
                        });
                        sub.cons.autoreload[sender.tab.id].timer = `reload-${sender.tab.id}-timer-${alarmCounter}`;
                        await chrome.alarms.create(sub.cons.autoreload[sender.tab.id].timer, {
                            periodInMinutes: message.value.interval / 60,
                        });
                        chrome.alarms.onAlarm.addListener(alarm => {
                            if (alarm.name === sub.cons.autoreload[sender.tab.id].timer) {
                                chrome.tabs.reload(sender.tab.id, {
                                    bypassCache: sub.cons.autoreload[sender.tab.id].bypassCache,
                                });
                                sub.cons.autoreload[sender.tab.id].timeRemain = message.value.interval + 1;
                            }
                        });
                    } else {
                        this.clear(message, sender, sendResponse);
                    }
                });
            },
            clear: async (message, sender, sendResponse) => {
                console.log({ action: "clear", autoreload: sub.cons.autoreload[sender.tab.id] });
                if (sub.cons.autoreload && sub.cons.autoreload[sender.tab.id]) {
                    await new Promise(resolve => {
                        sub.checkPermission(["alarms"], undefined, async () => {
                            await chrome.alarms.clear(sub.cons.autoreload[sender.tab.id].countDown);
                            await chrome.alarms.clear(sub.cons.autoreload[sender.tab.id].timer);
                            sub.cons.autoreload[sender.tab.id].timeRemain = 0;
                            resolve();
                        });
                    });
                }
                await chrome.action.setBadgeText({ text: "", tabId: sender.tab.id });
            },
            getConf: (message, sender, sendResponse) => {
                sendResponse({ config: config.apps[message.app], value: sub.cons[message.app], tabId: sender.tab.id });
            },
        },
        rss: {
            getMessage: (message, sender, sendResponse) => {
                url = message.value;
                fetch(url)
                    .then(response => response.text())
                    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
                    .then(xmlData => {
                        sub.testdata = xmlData;
                        let data = {};
                        const replace_cdata = str => {
                            let newstr;
                            newstr = str.indexOf("<![CDATA[") === 0 ? str.replace("<![CDATA[", "") : str;
                            newstr = newstr.indexOf("]]>") === newstr.length - 3 ? newstr.replace("]]>", "") : newstr;
                            return newstr;
                        };
                        data = {
                            title: replace_cdata(
                                xmlData.querySelector("channel>title")
                                    ? DOMPurify.sanitize(xmlData.querySelector("channel>title").textContent).toString()
                                    : "noname"
                            ),
                            link: replace_cdata(
                                xmlData.querySelector("channel>image>link")
                                    ? DOMPurify.sanitize(
                                          xmlData.querySelector("channel>image>link").textContent
                                      ).toString()
                                    : ""
                            ),
                            img: replace_cdata(
                                xmlData.querySelector("channel>image>url")
                                    ? DOMPurify.sanitize(
                                          xmlData.querySelector("channel>image>url").textContent
                                      ).toString()
                                    : chrome.runtime.getURL("/image/rss.svg")
                            ),
                        };

                        const items = xmlData.querySelectorAll("item");
                        data.items = [];
                        for (var i = 0; i < items.length; i++) {
                            var _nodes = items[i].childNodes;
                            var _object = {};
                            for (var ii = 0; ii < _nodes.length; ii++) {
                                if (_nodes[ii].tagName) {
                                    _object[_nodes[ii].tagName.toLowerCase()] = DOMPurify.sanitize(
                                        replace_cdata(_nodes[ii].textContent)
                                    ).toString();
                                }
                            }
                            data.items.push(_object);
                        }
                        return data;
                    })
                    .then(data => {
                        chrome.tabs.sendMessage(sender.tab.id, { type: "rssData", value: data, feedURL: url });
                    })
                    .catch(err => console.log(err));
            },
            openItem: message => {
                const _URL = message.value,
                    _Target = config.apps[message.app].n_optype,
                    _Index = sub.getIndex(config.apps[message.app].n_position, "new")[0],
                    _Pin = config.apps[message.app].n_pin;
                sub.open(_URL, _Target, _Index, _Pin);
            },
        },
        tablist: {
            tabClose: message => {
                message.value ? chrome.tabs.remove(Number(message.value)) : null;
            },
            tabSwitch: message => {
                message.value ? chrome.tabs.update(Number(message.value), { active: true }) : null;
            },
        },
        jslist: {
            jsRun: async message => {
                await chrome.scripting.executeScript({
                    args: [config.general.script.script[message.value].content],
                    func: script => eval(script),
                    injectImmediately: true,
                    target: { tabId: sub.curTab.id },
                    world: chrome.scripting.ExecutionWorld.MAIN,
                });
            },
        },
        appslist: {
            openApp: message => {
                sub.action[message.value]();
            },
        },
        recentbk: {
            openItem: message => {
                const _URL = message.value,
                    _Target = config.apps[message.app].n_optype,
                    _Index = sub.getIndex(config.apps[message.app].n_position, "new")[0],
                    _Pin = config.apps[message.app].n_pin;
                sub.open(_URL, _Target, _Index, _Pin);
            },
        },
        recentht: {
            openItem: message => {
                const _URL = message.value,
                    _Target = config.apps[message.app].n_optype,
                    _Index = sub.getIndex(config.apps[message.app].n_position, "new")[0],
                    _Pin = config.apps[message.app].n_pin;
                sub.open(_URL, _Target, _Index, _Pin);
            },
        },
        recentclosed: {
            openItem: message => {
                chrome.sessions.restore(message.value);
            },
        },
        synced: {
            openItem: message => {
                chrome.sessions.restore(message.value);
            },
        },
        speaker: {
            speak: message => {
                switch (message.value.type) {
                    case "play":
                        if (!message.value.txt) {
                            return;
                        }
                        var _conf = config.apps[message.app];
                        var _text = message.value.txt;
                        var _voice = {};
                        chrome.tts.getVoices(voices => {
                            for (var i = 0; i < voices.length; i++) {
                                if (voices.voiceName === _conf.voicename) {
                                    if (voices[i].gender) {
                                        _voice.gender = _conf.n_gender.substr(2);
                                    }
                                    _voice.voiceName = voices[i].n_voicename;
                                    _voice.rate = _conf.n_rate;
                                    _voice.pitch = _conf.n_pitch;
                                    _voice.volume = _conf.n_volume;
                                    break;
                                }
                            }
                            chrome.tts.speak(_text, _voice);
                        });
                        break;
                    case "pause":
                        chrome.tts.pause();
                        break;
                    case "resume":
                        chrome.tts.resume();
                        break;
                    case "stop":
                        chrome.tts.stop();
                        break;
                }
            },
        },
        savepdf: {
            savePDF: message => {
                chrome.tabs.saveAsPDF(message.value);
            },
        },
        extmgm: {
            action: (message, sender, sendResponse) => {
                switch (message.value.actionType) {
                    case "enable":
                    case "disable":
                        if (
                            message.value.id === sub.extID ||
                            (config.apps.extmgm.always && config.apps.extmgm.always.includes(message.value.id))
                        ) {
                            break;
                        }
                        chrome.management.setEnabled(
                            message.value.id,
                            message.value.actionType === "enable" ? true : false,
                            () => {}
                        );
                        break;
                    case "disableall":
                        for (var i = 0; i < sub.cons.extmgm.ext_enabled.length; i++) {
                            if (
                                sub.cons.extmgm.ext_enabled[i].id === sub.extID ||
                                (config.apps.extmgm.always &&
                                    config.apps.extmgm.always.includes(sub.cons.extmgm.ext_enabled[i].id))
                            ) {
                                continue;
                            }
                            chrome.management.setEnabled(sub.cons.extmgm.ext_enabled[i].id, false);
                        }
                        break;
                }
                sendResponse({ type: "extmgm", actionDone: true });
            },
            getext: (message, sender, sendResponse) => {
                const _config = config.apps.extmgm.exts[message.value].id,
                    _exts = [];
                for (var i = 0; i < _config.length; i++) {
                    for (var ii = 0; ii < sub.cons.extmgm.exts.length; ii++) {
                        if (_config[i] === sub.cons.extmgm.exts[ii].id) {
                            _exts.push(sub.cons.extmgm.exts[ii]);
                            continue;
                        }
                    }
                }
                sendResponse({ exts: _exts });
            },
            getAllExt: (message, sender, sendResponse) => {
                sendResponse({ exts: sub.cons.extmgm.exts });
                if (message.extsEnable) {
                    for (var i = 0; i < sub.cons.extmgm.exts.length; i++) {
                        if (
                            sub.cons.extmgm.exts[i].id === sub.extID ||
                            (config.apps.extmgm.always &&
                                config.apps.extmgm.always.includes(sub.cons.extmgm.exts[i].id))
                        ) {
                            continue;
                        }
                        if (message.extsEnable.id.includes(sub.cons.extmgm.exts[i].id)) {
                            chrome.management.setEnabled(sub.cons.extmgm.exts[i].id, true);
                        } else {
                            chrome.management.setEnabled(sub.cons.extmgm.exts[i].id, false);
                        }
                    }
                }
                if (message.extsLast) {
                    for (var i = 0; i < sub.cons.extmgm.exts.length; i++) {
                        if (
                            sub.cons.extmgm.exts[i].id === sub.extID ||
                            (config.apps.extmgm.always &&
                                config.apps.extmgm.always.includes(sub.cons.extmgm.exts[i].id))
                        ) {
                            continue;
                        }
                        if (message.extsLast.includes(sub.cons.extmgm.exts[i].id)) {
                            chrome.management.setEnabled(sub.cons.extmgm.exts[i].id, true);
                        } else {
                            chrome.management.setEnabled(sub.cons.extmgm.exts[i].id, false);
                        }
                    }
                }
            },
            itemDisable: (message, sender, sendResponse) => {
                chrome.management.setEnabled(message.extId, false);
            },
            itemEnable: (message, sender, sendResponse) => {
                chrome.management.setEnabled(message.extId, true);
            },
            itemOpturl: (message, sender, sendResponse) => {
                sub.open(message.url);
            },
            itemUninstall: (message, sender, sendResponse) => {
                chrome.management.uninstall(
                    message.extId,
                    { showConfirmDialog: config.apps.extmgm.n_uninstallconfirm },
                    s => {
                        chrome.management.getAll(exts => {
                            const _exts = [];
                            for (var i = 0; i < exts.length; i++) {
                                _exts.push(exts[i].id);
                            }
                            if (!_exts.includes(message.extId)) {
                                chrome.tabs.sendMessage(sender.tab.id, {
                                    type: "itemUninstall",
                                    id: message.id,
                                    extId: message.extId,
                                });
                            }
                        });
                    }
                );
            },
            enableAll: (message, sender, sendResponse) => {
                chrome.management.getAll(exts => {
                    for (var i = 0; i < exts.length; i++) {
                        chrome.management.setEnabled(exts[i].id, true);
                    }
                });
            },
            disableAll: (message, sender, sendResponse) => {
                chrome.management.getAll(exts => {
                    for (var i = 0; i < exts.length; i++) {
                        if (
                            exts[i].id === sub.extID ||
                            (config.apps.extmgm.always && config.apps.extmgm.always.contains(exts[i].id))
                        ) {
                            continue;
                        }
                        chrome.management.setEnabled(exts[i].id, false);
                    }
                });
            },
        },
        pxmovie: {
            getList: (message, sender, sendResponse) => {
                fetch("https://www.poxiao.com/")
                    .then(response => response.blob())
                    .then(blob => {
                        var reader = new FileReader();
                        reader.onload = e => {
                            var htmlData = reader.result;
                            htmlData = new window.DOMParser().parseFromString(htmlData, "text/html");
                            var data = [];
                            var _doms = htmlData.querySelectorAll(".container .content ul")[0].querySelectorAll("li");
                            for (var i = 0; i < _doms.length; i++) {
                                var _data = [];
                                for (var ii = 0; ii < _doms[i].childNodes.length; ii++) {
                                    _data.push(DOMPurify.sanitize(_doms[i].childNodes[ii].textContent).toString());
                                }
                                _data.push("https://www.poxiao.com" + _doms[i].childNodes[2].getAttribute("href"));
                                data.push(_data);
                            }
                            chrome.tabs.sendMessage(sender.tab.id, { type: "list", value: data });
                        };
                        reader.readAsText(blob, "GBK");
                    });
            },
            getData: (message, sender, sendResponse) => {
                fetch(message.value)
                    .then(response => response.blob())
                    .then(blob => {
                        const reader = new FileReader();
                        reader.onload = e => {
                            let htmlData = reader.result;
                            htmlData = new window.DOMParser().parseFromString(htmlData, "text/html");
                            const data = {
                                info: [],
                                dl: [],
                                des: "",
                                name: "",
                            };
                            const domInfos = htmlData
                                .querySelector(".container .detail_intro tbody")
                                .querySelectorAll("tr");
                            for (var i = 0; i < domInfos.length; i++) {
                                var _doms = domInfos[i].querySelectorAll("td"),
                                    _data = [];
                                for (var ii = 0; ii < _doms.length; ii++) {
                                    if (_doms[ii].childNodes.length > 1) {
                                        for (var iii = 0; iii < _doms[ii].childNodes.length; iii++) {
                                            _data.push(
                                                DOMPurify.sanitize(_doms[ii].childNodes[iii].textContent).toString()
                                            );
                                        }
                                    } else {
                                        _data.push(DOMPurify.sanitize(_doms[ii].textContent).toString());
                                    }
                                }
                                data.info.push(_data);
                            }

                            const domDls = htmlData
                                .querySelector(".container #ziy .resourcesmain tbody")
                                .querySelectorAll("tr");
                            for (var i = 0; i < domDls.length - 1; i++) {
                                var _data = [];
                                _data.push(DOMPurify.sanitize(domDls[i].querySelector("td ").textContent).toString());
                                _data.push(
                                    DOMPurify.sanitize(domDls[i].querySelector("td input").value.substr(6)).toString()
                                );
                                data.dl.push(_data);
                            }

                            data.des = DOMPurify.sanitize(
                                htmlData.querySelectorAll(".filmcontents p")[1].textContent
                            ).toString();
                            data.name = DOMPurify.sanitize(
                                htmlData.querySelector(".container #film h1").childNodes[0].textContent
                            ).toString();

                            chrome.tabs.sendMessage(sender.tab.id, { type: "data", value: data });
                        };
                        reader.readAsText(blob, "GBK");
                    });
            },
        },
        homepage: {
            openItem: (message, sender, sendResponse) => {
                const _URL = message.value,
                    _Target = config.apps[message.app].n_optype,
                    _Index = sub.getIndex(config.apps[message.app].n_position, "new")[0],
                    _Pin = config.apps[message.app].n_pin;
                sub.open(_URL, _Target, _Index, _Pin);
            },
            getImageURL: async (message, sender, sendResponse) => {
                let db = await sub.IDB.DBGet("homepage"),
                    data;
                if (db.version < 2) {
                    db.close();
                    data = await sub.IDB.initApps("homepage");
                } else {
                    data = await sub.IDB.itemGet(db, "bingimg", 0);
                }
                if (data) {
                    data = {
                        id: 0,
                        imageURL: data.base64,
                        copyrightString: data.copyrightString,
                        copyrightURL: data.copyrightURL,
                    };
                    chrome.tabs.sendMessage(sender.tab.id, { type: "imageURL", value: data });
                }

                try {
                    const _data = {
                        id: 0,
                        imageURL:
                            "https://bing.com/th?id=OHR.PacificCrestTrail_ROW1631856584_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp",
                        copyrightString:
                            "Summit of Pine Mountain, Angeles National Forest, California, United States (© Matthew Kuhns/TANDEM Stills + Motion)",
                        copyrightURL:
                            "https://www.bing.com/search?q=Angeles+National+Forest&form=hpcapt&filters=HpDate%3a%2220250607_0700%22",
                    };
                    if ((await chrome.storage.local.get("homepageURL")).homepageURL !== _data.imageURL) {
                        chrome.tabs.sendMessage(sender.tab.id, { type: "imageURL", value: _data });
                        await sub.apps.homepage.getImage(message, sender, sendResponse, _data);
                    }
                } catch (e) {
                    console.log(e.toString());
                }
            },
            getImage: async (message, sender, sendResponse, data) => {
                let response = await fetch(data.imageURL);
                response = await response.blob();
                const reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onloadend = async () => {
                    data.base64 = reader.result;
                    const db = await sub.IDB.DBGet("homepage");
                    await sub.IDB.itemModify(db, "bingimg", 0, data);
                    if ((await chrome.storage.local.get("homepageURL")).homepageURL !== data.imageURL) {
                        await chrome.storage.local.set({ homepageURL: data.imageURL });
                    }
                };
            },
            setListId: async (message, sender, sendResponse) => {
                await chrome.storage.local.set({ homepageListId: message.value });
            },
        },
        tbkjx: {
            getData: (message, sender, sendResponse) => {
                let _url = "https://quan.zimoapps.com/push/tbkjx.json",
                    _configURL = "https://quan.zimoapps.com/push/config.json" + "?" + sub.date.getTime();
                fetch(_configURL)
                    .then(response => response.json())
                    .then(async json => {
                        if (
                            !(await chrome.storage.local.get("tbkjx_dataversion")).tbkjx_dataversion ||
                            Number(json.version) >= sub.date.get()
                        ) {
                            _url = _url + "?" + sub.date.get().toString();
                            await chrome.storage.local.set({ tbkjx_dataversion: json.version });
                        } else {
                            _url = _url + "?" + (await chrome.storage.local.get("tbkjx_dataversion")).tbkjx_dataversion;
                        }
                        fetch(_url)
                            .then(response => response.json())
                            .then(json => {
                                chrome.tabs.sendMessage(sender.tab.id, { type: "data", value: json });
                            });
                    });
            },
            itemOpen: (message, sender, sendResponse) => {
                const _URL = message.value,
                    _Target = config.apps[message.app].n_optype,
                    _Index = sub.getIndex(config.apps[message.app].n_position, "new")[0],
                    _Pin = config.apps[message.app].n_pin;
                sub.open(_URL, _Target, _Index, _Pin);
            },
        },
        notepad: {
            get: async (message, sender, sendResponse) => {
                let db = await sub.IDB.DBGet("notepad"),
                    data;
                if (db.version < 2) {
                    db.close();
                    data = await sub.IDB.initApps("notepad");
                } else {
                    data = await sub.IDB.itemGet(db, "note", 0);
                }
                if (data) {
                    message.type = "appsListener_get";
                    message.data = data;
                    chrome.tabs.sendMessage(sender.tab.id, message);
                }
            },
            set: async (message, sender, sendResponse) => {
                let db = await sub.IDB.DBGet("notepad");
                db = await sub.IDB.itemModify(db, "note", message.value.data.id, message.value.data);
            },
        },
        shorturl: {
            getURL: async (message, sender, sendResponse) => {
                try {
                    const response = await fetch(
                        (config.apps.shorturl.n_suyourls
                            ? "https://url.zimoapps.com/yourls-api.php"
                            : config.apps.shorturl.n_yourls + "/yourls-api.php") +
                            "?action=shorturl" +
                            "&format=json" +
                            "&keyword=" +
                            message.value.key +
                            "&url=" +
                            encodeURIComponent(sender.url) +
                            "&signature=" +
                            (config.apps.shorturl.n_suyourls ? "ab279117c0" : config.apps.shorturl.n_sign),
                        {
                            method: "POST",
                        }
                    );
                    const data = await response.json();
                    chrome.tabs.sendMessage(sender.tab.id, { type: "url", app: "shorturl", value: data });
                } catch (e) {
                    chrome.tabs.sendMessage(sender.tab.id, { type: "err", app: "shorturl", value: e.toString() });
                }
            },
        },
    },
    IDB: {
        initApps: appname =>
            new Promise((resolve, reject) => {
                let db;
                switch (appname) {
                    case "homepage":
                        (async () => {
                            db = await sub.IDB.DBUpgrade(appname, 2);
                            db = await sub.IDB.DBInit(db, "bingimg", "id");
                            db = await sub.IDB.itemSet(db, "bingimg", {
                                id: 0,
                                imageURL: "",
                                copyrightString: "",
                                copyrightURL: "",
                            });
                            resolve(db);
                        })();
                        break;
                    case "notepad":
                        (async () => {
                            db = await sub.IDB.DBUpgrade(appname, 2);
                            db = await sub.IDB.DBInit(db, "note", "id");
                            db = await sub.IDB.itemSet(db, "note", {
                                id: 0,
                                item: [
                                    {
                                        title: sub.getI18n("notepad_defalut_title"),
                                        content: sub.getI18n("notepad_defalut_content"),
                                    },
                                ],
                            });
                            resolve(db);
                        })();
                        break;
                }
            }),
        itemDel: (db, storeName, key) =>
            new Promise((resolve, reject) => {
                const request = db.transaction(storeName, "readwrite").objectStore(storeName).delete(key);
                request.onerror = reject;
                request.onsuccess = e => {
                    resolve(e.target.result);
                };
            }),
        itemModify: (db, storeName, key, newData) =>
            new Promise(async (resolve, reject) => {
                const request = db.transaction(storeName, "readonly").objectStore(storeName).get(key);
                request.onerror = reject;
                request.onsuccess = e => {
                    if (e.target.result) {
                        const _request = db.transaction(storeName, "readwrite").objectStore(storeName).put(newData);
                        _request.onerror = reject;
                        _request.onsuccess = e => {
                            resolve(newData);
                        };
                    } else {
                        reject("err");
                    }
                };
            }),
        itemGet: (db, storeName, key) => {
            if (key === null) {
                return;
            }
            return new Promise((resolve, reject) => {
                const request = db.transaction(storeName, "readonly").objectStore(storeName).get(key);
                request.onerror = reject;
                request.onsuccess = e => {
                    resolve(e.target.result);
                };
            });
        },
        itemSet: (db, storeName, data /*object,{xx:"xx",...}*/) =>
            new Promise((resolve, reject) => {
                const request = db.transaction(storeName, "readwrite").objectStore(storeName).add(data);
                request.onerror = reject;
                request.onsuccess = e => {
                    resolve(data);
                };
            }),
        DBInit: (db, storeName /*string*/, keyPath /*string*/ /*,indexarray,[{xx:"xx"},...]*/) =>
            new Promise((resolve, reject) => {
                const store = db.createObjectStore(storeName, { keyPath: keyPath });
                store.transaction.onerror = reject;
                store.transaction.oncomplete = e => {
                    resolve(e.target.db);
                };
            }),
        DBUpgrade: (dbname, ver) => {
            ver = ver || 1;
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(dbname, ver);
                request.onerror = reject;
                request.onupgradeneeded = e => {
                    resolve(e.target.result);
                };
            });
        },
        DBGet: dbname =>
            new Promise((resolve, reject) => {
                const request = indexedDB.open(dbname);
                request.onerror = reject;
                request.onsuccess = e => {
                    const db = e.target.result;
                    resolve(db);
                };
            }),
    },
};

async function main() {
    chrome.runtime.onConnect.addListener(port => {
        switch (port.name) {
            case "fn_copyimg":
                port.onMessage.addListener(async msg => {
                    var _img = await fetch(sub.message.selEle.img);
                    const fileReader = new FileReader();
                    fileReader.onload = function (e) {
                        port.postMessage(e.target.result);
                    };
                    fileReader.readAsDataURL(await _img.blob());
                });
                break;
        }
    });

    chrome.action.onClicked.addListener(tab => {
        if (config.icon.settings.type === "back") {
            var theConf = config.icon.actions[0];
            sub.theConf = theConf;
            sub.initCurrent(null, sub.theConf);
        } else {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                sub.curTab = tabs[0];
                chrome.tabs.sendMessage(tabs[0].id, { type: "icon" }, response => {
                    if (response && response.type === "action_icon") {
                        sub.message = response;
                        sub.extID = chrome.runtime.id ? chrome.runtime.id : null;
                        var theConf = config.icon.actions[0];
                        sub.theConf = theConf;
                        sub.initCurrent(null, sub.theConf);
                    }
                });
            });
        }
    });

    if (chrome.runtime.getPlatformInfo) {
        const info = await chrome.runtime.getPlatformInfo();
        sub.cons.os = info.os;
        await sub.checkMouseup();
    }

    await loadConfig();

    if (chrome.runtime.onInstalled) {
        chrome.runtime.onInstalled.addListener(async details => {
            const windows = await chrome.windows.getAll({ populate: true });
            for (var i = 0; i < windows.length; i++) {
                for (var ii = 0; ii < windows[i].tabs.length; ii++) {
                    chrome.scripting.executeScript({
                        files: ["js/event.js"],
                        injectImmediately: true,
                        target: { allFrames: true, tabId: windows[i].tabs[ii].id },
                        world: chrome.scripting.ExecutionWorld.ISOLATED,
                    });
                }
            }
            sub.cons.reason = details.reason;
            switch (details.reason) {
                case "update":
                    for (var i in config.general.engine.imgengine) {
                        if (
                            config.general.engine.imgengine[i].content ==
                            "https://www.google.com/searchbyimage?image_url=%s"
                        ) {
                            config.general.engine.imgengine[i].content = "https://lens.google.com/uploadbyurl?url=%s";
                            sub.saveConf();
                        } else if (
                            config.general.engine.imgengine[i].content ==
                            "https://www.bing.com/images/searchbyimage?&imgurl=%s"
                        ) {
                            config.general.engine.imgengine[i].content =
                                "https://www.bing.com/images/search?q=imgurl:%s";
                            sub.saveConf();
                        }
                    }
                    const items = await chrome.storage.sync.get();
                    if (devMode || (items.general && items.general.settings.notif)) {
                        var notif = {
                            type: "list",
                            title: sub.getI18n("notif_title_update"),
                            message: "",
                            iconUrl: "image/grand-gesture-icon-096.png",
                            items: [],
                            buttons: [
                                { title: sub.getI18n("notif_btn_open"), iconUrl: "image/open.svg" },
                                {
                                    title: /*chrome.i18n.getMessage*/ sub.getI18n("review"),
                                    iconUrl: "image/star.svg",
                                },
                            ],
                        };
                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState === 4) {
                                var items = JSON.parse(DOMPurify.sanitize(xhr.response));
                                for (var i = 0; i < items.log[0].content.length; i++) {
                                    notif.items.push({ title: i + 1 + ". ", message: items.log[0].content[i] });
                                }
                                chrome.notifications.create("", notif, () => {});
                            }
                        };
                        xhr.open("GET", "../change.log", true);
                        xhr.send();
                    }
                    break;
                case "install":
                    chrome.tabs.create({ url: "../html/options.html" });
                    break;
            }
        });
    }

    if (chrome.notifications) {
        chrome.notifications.onClicked.addListener(async () => {
            await chrome.storage.set({ showlog: "true" });
            await chrome.tabs.create({ url: "../html/options.html" });
        });
        chrome.notifications.onButtonClicked.addListener((id, index) => {
            switch (index) {
                case 0:
                    chrome.tabs.create({ url: "../html/options.html" });
                    break;
                case 1:
                    chrome.tabs.create({
                        url:
                            "https://chrome.google.com/webstore/detail/" +
                            chrome.runtime.id +
                            "?hl=" +
                            navigator.language,
                    });
                    break;
            }
        });
    }

    chrome.contextMenus.onClicked.addListener((info, tab) => {
        sub.CTMclick(info, tab);
    });

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        try {
            // get factor for action zoom
            sub.temp.zoom[tabId] = await chrome.tabs.getZoom(tabId);
            await sub.setIcon("normal", tabId, changeInfo, tab);
            if (changeInfo.status === "complete") {
                let response = await chrome.tabs.sendMessage(tabId, { type: "status" });
                if (!response) {
                    await sub.setIcon("warning", tabId, changeInfo, tab);
                }
            }
        } catch (error) {
            if (
                !(error instanceof Error) ||
                (error.message.indexOf("No tab with id") < 0 &&
                    error.message.indexOf("Receiving end does not exist") < 0)
            ) {
                throw error;
            }
        }
    });

    chrome.tabs.onRemoved.addListener(tabId => {
        if (sub.cons.autoreload && sub.cons.autoreload[tabId]) {
            window.clearInterval(sub.cons.autoreload[tabId].timer);
            window.clearInterval(sub.cons.autoreload[tabId].countDown);
        }
    });

    chrome.runtime.onMessageExternal.addListener(async (message, sender, sendResponse) => {
        await sub.funOnMessage(message, sender, sendResponse);
    });

    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        await sub.funOnMessage(message, sender, sendResponse);
    });

    //browsersettings
    const flag_mouseup = (await chrome.storage.local.get("flag_mouseup")).flag_mouseup;
    if (chrome.browserSettings && chrome.browserSettings.contextMenuShowEvent) {
        browser.browserSettings.contextMenuShowEvent.set({ value: "mouseup" });
        config.general.linux.cancelmenu = false;
        await sub.saveConf();
    } else if (
        browserType === "fx" &&
        (flag_mouseup === null || flag_mouseup === undefined) &&
        (sub.cons.os === "linux" || sub.cons.os === "mac")
    ) {
        sub.checkPermission(["browserSettings"], null, null, sub.getI18n("perdes_browsersettings"));
        await chrome.storage.local.set({ flag_mouseup: "true" });
    }
}

main();
