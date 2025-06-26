Array.prototype.contains = function (ele) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == ele) {
            return true;
        }
    }
    return false;
};
var config,
    defaultConf,
    localConfig = {},
    browserType;

//check browser
if (navigator.userAgent.toLowerCase().indexOf("firefox") !== -1) {
    browserType = "fx";
} else if (navigator.userAgent.toLowerCase().indexOf("edg") !== -1) {
    browserType = "edg";
} else {
    browserType = "cr";
}

const suo = {
    CON: {
        currentOBJ: null,
    },
    cons: {
        currentOBJ: null,
        model: "dev",
        os: "win",
        sizePos: {},
        menuPin: true,
        boxmove: {},
        sort: [
            [2, 2],
            [4, 2],
            [4, 3],
            [4, 4],
            [7, 1],
            [9, 1],
            [10, 2],
            [12, 1],
        ],
    },
    boxShowFrom: null,
    selects: ["xx"],
    begin: () => {
        suo.initActionEle(); //init engine/script list
        suo.initNewAdded();

        window.setTimeout(() => {
            suo.init();
            suo.initMenu();
            suo.initI18n();
            var itemArray = ["txtengine", "imgengine", "script"];

            var arrayFn = Object.getOwnPropertyNames(config.general.fnswitch);
            for (var i = 0; i < arrayFn.length; i++) {
                if (config.general.fnswitch[arrayFn[i]]) {
                } else {
                    continue;
                }
                if (arrayFn[i].substr(2) == "drg") {
                    itemArray.push("tdrg");
                    itemArray.push("ldrg");
                    itemArray.push("idrg");
                } else if (arrayFn[i].substr(2) == "sdrg") {
                    itemArray.push("tsdrg");
                    itemArray.push("lsdrg");
                    itemArray.push("isdrg");
                } else {
                    itemArray.push(arrayFn[i].substr(2));
                }
            }

            for (var i = 0; i < itemArray.length; i++) {
                suo.initListItem(itemArray[i]);
            }

            suo.initPer();
            suo.initUI("mges");
            suo.initUI("drg");
            suo.initUI("touch");
            suo.initValue();
            suo.initExclusion();
            suo.initEnd();
        }, 100);
    },
    initNewAdded: () => {
        console.log("initNewAdded");
        console.log(!config.general.exclusion);
        // exclusion - black/white list
        if (!config.general.exclusion) {
            config.general.exclusion = defaultConf.general.exclusion;
        }
    },
    init: () => {
        console.log("begin");
        suo.cons.menuPin = true; // window.innerWidth > 800 ? true : false;
        suo.set.set_11();
        suo.initHandle();
    },
    initHandle: function () {
        window.addEventListener("click", this.handleEvent, false);
        window.addEventListener("mouseup", this.handleEvent, false);
        window.addEventListener("change", this.handleEvent, false);
        window.addEventListener("mousemove", this.handleEvent, false);
        window.addEventListener("mouseover", this.handleEvent, false);
        window.addEventListener("mouseout", this.handleEvent, false);
        window.addEventListener("mouseleave", this.handleEvent, false);
        window.addEventListener("resize", this.handleEvent, false);
        window.addEventListener("mousedown", this.handleEvent, false);
        window.addEventListener("keydown", this.handleEvent, false);
    },
    handleEvent: e => {
        switch (e.type) {
            case "keydown":
                console.log(e.target);
                suo.itemEditDca(e);

                //key edit ksa
                console.log(e);
                if (e.target.classList.contains("box_keyvalue")) {
                    suo.keyEdit(e);
                }
                break;
            case "mousedown":
                if (
                    e.button == 0 &&
                    (e.target.classList.contains("box_head") || e.target.classList.contains("box_title"))
                ) {
                    var boxposX = e.target.classList.contains("box_head")
                            ? e.target.parentNode.offsetLeft
                            : e.target.parentNode.parentNode.offsetLeft,
                        boxposY = e.target.classList.contains("box_head")
                            ? e.target.parentNode.offsetTop
                            : e.target.parentNode.parentNode.offsetTop;
                    suo.cons.boxmove.enable = true;
                    suo.cons.boxmove.posX = e.clientX - boxposX;
                    suo.cons.boxmove.posY = e.clientY - boxposY;
                }
                break;
            case "click":
                var ele = e.target;
                switch (ele.id) {
                    case "dca_keycusreset":
                        document.querySelector("#dca_keycusbox").value = "";
                        suo.saveConf();
                        break;
                    case "dca_keycusbox":
                        suo.dcaKeycus(e);
                        break;
                    case "bgreset":
                        suo.bgReset(e);
                        break;
                    case "bgrepeat":
                        if (ele.checked) {
                            document.body.style.cssText +=
                                "background-repeat:repeat !important;background-size: initial !important;";
                        } else {
                            document.body.style.cssText +=
                                "background-repeat:no-repeat !important;background-size: cover !important;";
                        }
                        break;
                    case "setbg":
                        suo.setBg();
                        break;
                    case "nav_menu":
                        document.querySelector(".menupluscontent").style.display = "block";
                        break;
                    case "nav_img":
                        suo.cons.menuPin ? null : suo.menuBarCreate();
                        break;
                    case "menu_bg":
                        suo.menuBarRemove();
                        break;
                    case "su_login":
                        chrome.tabs.create({ url: "chrome://chrome-signin/" });
                        break;
                    case "wel_button":
                        suo.domHide(document.querySelector("#welcomebox"));
                        break;
                    case "chk_general_settings_autosave":
                        if (e.target.checked) {
                            document.querySelector("#menuplus_save").style.display = "none";
                            document.querySelector(".nav_btn_save").style.display = "none";
                        } else {
                            document.querySelector("#menuplus_save").style.display = "block";
                            document.querySelector(".nav_btn_save").style.display = "inline-block";
                        }
                        config.general.settings.autosave = e.target.checked;
                        suo.saveConf2();
                        break;
                    case "menu_save":
                        suo.saveConf2();
                        break;
                    case "btn_add":
                        if (suo.getDataset(e, "confobj", "value").split("|")[0] == "ksa") {
                            e.target.dataset.confid = config.ksa.actions.length;
                            suo.itemEditKsa(e, "new");
                            break;
                        }
                        suo.itemAddBefore(e);
                        break;
                    case "conf_import":
                        suo.confImport();
                        break;
                    case "conf_export":
                        suo.confExport();
                        break;
                    case "conf_reset":
                        var reset = prompt(suo.getI18n("msg_reset"));
                        if (reset == "ReSeT") {
                            config = {};
                            config = defaultConf;
                            chrome.storage.local.clear();
                            suo.saveConf2();
                            window.setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } else {
                            suo.showMsgBox(suo.getI18n("msg_reset2"), "warning");
                        }
                        break;
                    case "conf_reset_apps":
                        if (config.apps) {
                            delete config.apps;
                            suo.saveConf2();
                        }
                        break;
                    case "resetcurrent":
                    case "nav_reset":
                        console.log(suo.cons.currentOBJArray);
                        config[suo.cons.currentOBJArray[0]][suo.cons.currentOBJArray[1]] =
                            defaultConf[suo.cons.currentOBJArray[0]][suo.cons.currentOBJArray[1]];
                        suo.saveConf2();
                        window.setTimeout(() => {
                            window.location.reload();
                        }, 500);
                        break;
                    case "btn_closead":
                        var domAd = e.target.parentNode.parentNode;
                        domAd.parentNode.removeChild(domAd);
                        break;
                }
                if (ele.classList.contains("box_btnkeyrst")) {
                    e.target.parentNode.querySelector(".box_keyvalue").value = "";
                }
                if (ele.classList.contains("box_tabtitle") && !ele.classList.contains("box_tabtitleactive")) {
                    suo.tabSwitch(e);
                }
                if (ele.classList.contains("menuplus_save")) {
                    suo.saveConf2();
                }
                if (ele.classList.contains("menu_hide") && !ele.classList.contains("cancel_hide")) {
                    document.querySelector(".menupluscontent").style.display = "none";
                }
                if (ele.classList.contains("menuplus_exit")) {
                    window.close();
                }
                if (ele.classList.contains("menuplus_opennew")) {
                    chrome.tabs.create({ url: "../html/options.html" });
                }
                if (ele.classList.contains("nav_menu")) {
                    document.querySelector(".menupluscontent").style.display = "block";
                }
                if (ele.classList.contains("box_diredit")) {
                    suo.directEdit(e);
                }
                if (ele.classList.contains("box_btn_del")) {
                    suo.boxClose2(suo.getAPPboxEle(e));
                    suo.itemDel(e);
                }
                if (ele.classList.contains("box_btn_next")) {
                    console.log("box_btn_next");
                    var ckdir = suo.checkEditDirect(e);
                    console.log(ckdir);
                    if (ckdir) {
                        suo.itemEdit(ckdir[0], ckdir[1], "add", ckdir[2], suo.getDataset(ele, "actiontype", "value"));
                        suo.boxClose2(e);
                    }
                }
                if (ele.classList.contains("box_btn_diredit")) {
                    console.log("box_btn_diredit");
                    var ckdir = suo.checkEditDirect(e);
                    if (ckdir) {
                        suo.itemEdit(
                            ckdir[0],
                            ckdir[1],
                            "edit",
                            ckdir[2],
                            suo.getDataset(suo.getAPPboxEle(e), "actiontype", "value")
                        );
                        suo.boxClose2(e);
                    }
                }
                if (ele.classList.contains("box_btn_close") || e.target.classList.contains("box_btn_cancel")) {
                    suo.boxClose2(e, "cancel");
                }
                if (
                    ele.classList.contains("rate") ||
                    (ele.tagName.toLowerCase() != "html" && ele.parentNode.classList.contains("rate"))
                ) {
                    chrome.tabs.create({ url: suo.cons.webstoreURL });
                }
                if (ele.className && e.target.classList.contains("menuli")) {
                    suo.clickMenuLI(e);
                    suo.cons.menuPin ? null : suo.menuBarRemove();
                }
                if (ele.classList.contains("menup") && !e.target.classList.contains("menu-current")) {
                    suo.clickMenuDiv(e);
                }
                if (ele.classList.contains("item_edit")) {
                    console.log(e.target);
                    if (e.target.dataset.actiontype && e.target.dataset.actiontype == "ksa") {
                        suo.itemEditKsa(e);
                    } else {
                        suo.itemEditBefor(e);
                    }
                }
                if (ele.classList.contains("item_add")) {
                    suo.itemAddBefore(e);
                }
                if (ele.classList.contains("box_btn_save")) {
                    suo.itemSave(e);
                }
                if (ele.classList.contains("item_del")) {
                    suo.itemDel(e);
                }
                if (ele.classList.contains("btn_list")) {
                    suo.showList(e);
                }
                if (ele.classList.contains("exclusion_add")) {
                    suo.exclusionAdd(e);
                }
                if (ele.classList.contains("exclusion_del")) {
                    suo.exclusionDel(e);
                }
                break;
            case "mouseup":
                suo.cons.boxmove.enable = false;
                break;
            case "resize":
                suo.fixSizePos();
                break;
            case "change":
                console.log("change");
                // show or hide chek with text/range/radio/select
                if (e.target.classList.contains("box_check")) {
                    if (e.target.nextSibling && e.target.nextSibling.nextSibling) {
                        if (e.target.checked) {
                            e.target.nextSibling.nextSibling.style.cssText += "display:block;";
                        } else {
                            e.target.nextSibling.nextSibling.style.cssText += "display:none;";
                        }
                    }
                }
                // show or hide radio options
                if (e.target.classList.contains("box_radiooption")) {
                    var _domRadioList = e.target.parentNode.parentNode.querySelectorAll(".box_radiolist");
                    for (var i = 0; i < _domRadioList.length; i++) {
                        _domRadioList[i].style.cssText += "display:none;";
                    }
                    if (e.target.checked && e.target.parentNode.querySelector(".box_radiolist")) {
                        e.target.parentNode.querySelector(".box_radiolist").style.cssText += "display:block;";
                    }
                }
                if (e.target.dataset.confele == "mouseup" && e.target.checked) {
                    suo.checkPermission(["browserSettings"], null, null, "");
                    break;
                }
                if (e.target.classList.contains("change-background")) {
                    if (e.target.checked) {
                        suo.checkPermission(["background"], null, null, "");
                    } else {
                        chrome.permissions.remove({ permissions: ["background"] }, removed => {
                            if (removed) {
                                suo.initPer();
                                chrome.runtime.sendMessage({ type: "getpers" }, response => {});
                                suo.showMsgBox(suo.getI18n("msg_delpers"), "save", 3);
                            } else {
                                suo.showMsgBox(suo.getI18n("msg_delpers_fail"), "warning", 3);
                            }
                        });
                    }
                }
                //sync changed
                if (e.target.dataset.confele == "autosync") {
                    console.log(e.target.checked);
                    config.general.sync.autosync = e.target.checked;
                    chrome.storage.local.get(items => {
                        const _obj = {};
                        _obj.localConfig = items.localConfig;
                        chrome.storage.local.clear(() => {
                            chrome.storage.local.set(_obj, () => {
                                if (chrome.storage.sync) {
                                    chrome.storage.sync.clear(() => {
                                        suo.saveConf2();
                                        window.setTimeout(() => {
                                            window.location.reload();
                                        }, 1000);
                                    });
                                } else {
                                    suo.saveConf2();
                                    window.setTimeout(() => {
                                        window.location.reload();
                                    });
                                }
                            });
                        });
                    });
                }
                if (e.target.classList.contains("box_select") && e.target.name == "n_mail") {
                    var _dom = suo.getAPPboxEle(e);
                    _dom = _dom.querySelector(".confix");

                    if (e.target.value == "s_gmailapps") {
                        _dom.style.cssText += "display:inline-block;";
                        _dom.classList.remove("confix-yes");
                        _dom.classList.add("confix-no");
                    } else {
                        _dom.style.cssText += "display:none;";
                        _dom.classList.remove("confix-no");
                        _dom.classList.add("confix-yes");
                    }
                }
                if (e.target.classList.contains("box_select") && e.target.value == "add_from_select") {
                    suo.boxClose2(e);
                    var confobj =
                        e.target.name.indexOf("engine") != -1
                            ? "general|engine|" + e.target.name.substr(2)
                            : "general|script|" + e.target.name.substr(2);
                    var confArray = confobj.split("|");
                    var confOBJ = config;
                    for (var i = 0; i < confArray.length; i++) {
                        confOBJ = confOBJ[confArray[i]];
                    }
                    var confid = confOBJ.length;
                    suo.itemEdit(
                        confobj,
                        confid,
                        "add",
                        null,
                        e.target.name.substr(2) /*(e.target.name.indexOf("engine")!=-1?"engine":"script")*/
                    );
                }
                if (e.target.id == "con-lang") {
                    config.general.settings.lang = e.target.value;
                    suo.saveConf2();
                    window.setTimeout(() => {
                        location.reload();
                    }, 500);
                }
                if (e.target.id == "bgchange") {
                    suo.bgChange(e);
                }
                if (e.target.classList.contains("change-checkbox")) {
                    switch (e.target.dataset.confele) {
                        case "fnctm": //when set disable contextmenu, remove all.
                            if (!e.target.checked && chrome.contextMenus) {
                                chrome.contextMenus.removeAll();
                            }
                            break;
                    }
                    //fnswitch drg/sdrg
                    if (e.target.dataset.confele == "fndrg") {
                        var doms = document.querySelector("input[data-confele=fnsdrg]");
                        var dom = document.querySelector("input[data-confele=fndrg]");
                        if (dom.checked) {
                            doms.checked = false;
                            suo.changeFnswitch(doms);
                            suo.changeCheckbox(doms);
                        }
                    }
                    if (e.target.dataset.confele == "fnsdrg") {
                        var doms = document.querySelector("input[data-confele=fnsdrg]");
                        var dom = document.querySelector("input[data-confele=fndrg]");
                        if (doms.checked) {
                            dom.checked = false;
                            suo.changeFnswitch(dom);
                            suo.changeCheckbox(dom);
                        }
                    }
                    //fnswitch popup/icon
                    if (e.target.dataset.confele == "fnpop") {
                        var doms = document.querySelector("input[data-confele=fnicon]");
                        var dom = document.querySelector("input[data-confele=fnpop]");
                        if (dom.checked) {
                            doms.checked = false;
                            suo.changeFnswitch(doms);
                            suo.changeCheckbox(doms);
                        }
                        suo.initPop();
                    }
                    if (e.target.dataset.confele == "fnicon") {
                        var doms = document.querySelector("input[data-confele=fnicon]");
                        var dom = document.querySelector("input[data-confele=fnpop]");
                        if (doms.checked) {
                            dom.checked = false;
                            suo.changeFnswitch(dom);
                            suo.changeCheckbox(dom);
                        }
                        suo.initPop();
                    }

                    if (e.target.dataset.confele == "autosave") {
                        var doms = document.querySelectorAll("[data-confele=autosave]");
                        for (var i = 0; i < doms.length; i++) {
                            doms[i].checked = e.target.checked;
                        }
                        e.target.checked
                            ? (document.querySelector("#menuplus_save").style.display = "none")
                            : (document.querySelector("#menuplus_save").style.display = "block");
                    }

                    var confArray = suo.getConfArray(e.target);
                    var arraydrg = [
                        "chk_" + confArray[0] + "_settings_txt",
                        "chk_" + confArray[0] + "_settings_lnk",
                        "chk_" + confArray[0] + "_settings_img",
                    ];
                    for (var i = 0; i < arraydrg.length; i++) {
                        if (arraydrg[i] == e.target.id) {
                            var menuDom = document.querySelector(
                                "[data-id0='" +
                                    (confArray[0] == "sdrg" ? "3" : "4") +
                                    "'][data-id1='" +
                                    (confArray[0] == "sdrg" ? i + 1 : i + 2) +
                                    "']"
                            );
                            if (e.target.checked) {
                                menuDom.style.display = "block";
                                menuDom.parentNode.style.height =
                                    Math.abs(
                                        menuDom.parentNode.style.height.substr(
                                            0,
                                            menuDom.parentNode.style.height.length - 2
                                        )
                                    ) +
                                    30 +
                                    "px";
                            } else {
                                menuDom.style.display = "none";
                                menuDom.parentNode.style.height =
                                    Math.abs(
                                        menuDom.parentNode.style.height.substr(
                                            0,
                                            menuDom.parentNode.style.height.length - 2
                                        )
                                    ) -
                                    30 +
                                    "px";
                            }
                        }
                    }
                    suo.changeCheckbox(e);
                }
                if (e.target.classList.contains("change")) {
                    if (e.target.classList.contains("change_radio")) {
                        suo.changeRadio(e);
                    }
                    if (e.target.tagName.toLowerCase() == "select") {
                        suo.changeSelect(e);
                    }
                    if (e.target.tagName.toLowerCase() == "input" && e.target.type == "range") {
                        suo.changeRange(e);
                    }
                    if (e.target.tagName.toLowerCase() == "input" && e.target.type == "color") {
                        suo.changeUi(e);
                    }
                    if (e.target.tagName.toLowerCase() == "input" && e.target.type == "checkbox") {
                        var confOBJ = suo.getConfOBJ(e);
                        console.log(confOBJ);
                        confOBJ[e.target.dataset.confele] = e.target.checked;
                        suo.saveConf();
                    }
                    //more
                }
                if (e.target.classList.contains("change-select")) {
                    suo.changeSelect(e);
                }
                if (e.target.classList.contains("change-fnswitch")) {
                    suo.changeFnswitch(e);
                }
                if (e.target.classList.contains("change-range")) {
                    suo.changeRange(e);
                }
                if (e.target.classList.contains("change-ui")) {
                    suo.changeUi(e);
                }
                if (e.target.classList.contains("actionselect")) {
                    suo.actionChange2(e);
                }
                if (e.target.id == "mydes") {
                    if (e.target.checked) {
                        document.querySelector(".box-content #mydesbox #mydestext").style.display = "inline-block";
                    } else {
                        document.querySelector(".box-content #mydesbox #mydestext").style.display = "none";
                    }
                }
                if (e.target.classList.contains("box_desck")) {
                    var getele = ele => {
                        if (ele.tagName.toLowerCase() == "smartup" && ele.classList.contains("su_apps")) {
                            return ele;
                        } else {
                            return getele(ele.parentNode);
                        }
                    };
                    var dom = getele(e.target).querySelector(".box_destext");
                    if (e.target.checked) {
                        dom.style.display = "inline-block";
                    } else {
                        dom.style.display = "none";
                    }
                }
                if (e.target.name && e.target.name == "exclusiontype") {
                    suo.initExclusion();
                }
                break;
            case "mouseover":
                if (e.target.classList.contains("menuplusimg")) {
                    document.querySelector(".menupluscontent").style.display = "block";
                }
                break;
            case "mouseout":
                var dom = e.target;
                if (
                    dom.classList.contains("item-list") ||
                    dom.classList.contains("span-del") ||
                    dom.classList.contains("list-parent")
                ) {
                    if (
                        e.relatedTarget.classList.contains("span-del") ||
                        e.relatedTarget.classList.contains("item-list") ||
                        e.relatedTarget.classList.contains("list-parent")
                    ) {
                        return;
                    } else {
                        if (dom.parentNode.querySelector(".span-del")) {
                            dom.parentNode.querySelector(".span-del").remove();
                        }
                    }
                }
                if (e.target.classList.contains("menupluscontent")) {
                    document.querySelector(".menupluscontent").style.display = "none";
                }
                if (
                    e.target.classList.contains("menu_hide") &&
                    !e.relatedTarget.classList.contains("menu_hide") &&
                    !e.relatedTarget.classList.contains("menupluscontent")
                ) {
                    document.querySelector(".menupluscontent").style.display = "none";
                }
                break;
            case "mousemove":
                if (
                    suo.cons.boxmove.enable &&
                    (e.target.classList.contains("box_head") || e.target.classList.contains("box_title"))
                ) {
                    suo.boxMove(e);
                }
                break;
            case "mouseleave":
                break;
        }
    },
    initExclusion: () => {
        var _doms = document.querySelectorAll(".set>.setcontent>ul.exclusionwrap");
        for (var i = 0; i < _doms.length; i++) {
            _doms[i].innerText = "";
            var _conf = config.general.exclusion[_doms[i].dataset.confele];
            for (var ii = 0; ii < _conf.length; ii++) {
                var _li = suo.domCreate2(
                    "li",
                    { setName: ["className"], setValue: ["exclusion_list"] },
                    null,
                    null,
                    { setName: ["id"], setValue: [ii] },
                    _conf[ii]
                );
                var _btn = suo.domCreate2(
                    "span",
                    { setName: ["className"], setValue: ["exclusion_del"] },
                    null,
                    null,
                    null,
                    "x"
                );
                _li.appendChild(_btn);
                _doms[i].appendChild(_li);
            }
        }
        if (config.general.exclusion.exclusiontype == "black") {
            document.querySelector("#exclusion_black").style.cssText += "display:block;";
            document.querySelector("#exclusion_white").style.cssText += "display:none;";
        } else {
            document.querySelector("#exclusion_white").style.cssText += "display:block;";
            document.querySelector("#exclusion_black").style.cssText += "display:none;";
        }
    },
    exclusionDel: e => {
        var _dom = e.target.parentNode;
        var _id = _dom.dataset.id;
        var _conf = config.general.exclusion[_dom.parentNode.dataset.confele];
        _conf.splice(_id, 1);
        suo.saveConf();
        suo.initExclusion();
    },
    exclusionAdd: e => {
        var _conf = config.general.exclusion[e.target.dataset.confele];
        var _dom = e.target.parentNode.querySelector("input[type=text]");
        if (_dom.value) {
            if (_conf.contains(_dom.value)) {
                suo.showMsgBox(suo.getI18n("tip_exclusion_repeat"), "error", 5);
            } else {
                _conf.push(_dom.value);
                _dom.value = "";
                suo.saveConf();
                suo.initExclusion();
            }
        }
    },
    keyEdit: e => {
        console.log(e);
        editMode = true;
        var dom = e.target;
        dom.value += (dom.value == "" ? "" : " ") + suo.ksa.keyGet(e.keyCode);
    },
    showList: e => {
        var btnArray = [];
        var _dom = suo.initAPPbox(btnArray, [400, 230], suo.getI18n("tip_showlist"), "bg", "showlist");

        var confArray = e.target.dataset.confobj.split("|");
        var confOBJ = config;
        for (var i = 0; i < confArray.length; i++) {
            confOBJ = confOBJ[confArray[i]];
        }
        console.log(confOBJ);
        var _ul = suo.domCreate2(
            "ul",
            null,
            null,
            "height:" + (window.innerHeight - 150) + "px;list-style:none;padding:0;margin:0;min-width:300px;"
        );
        for (var i = 0; i < confOBJ.length; i++) {
            var _li = suo.domCreate2("li", null, null, "padding:2px 0;");
            var _title = suo.domCreate2(
                "span",
                null,
                null,
                "padding-right:20px;min-width:120px;display:inline-block;",
                null,
                confOBJ[i].mydes && confOBJ[i].mydes.type && confOBJ[i].mydes.value
                    ? confOBJ[i].mydes.value
                    : suo.getI18n(confOBJ[i].name)
            );
            console.log(_title);
            _li.appendChild(_title);
            var _direct = suo.domCreate2(
                "span",
                null,
                null,
                "background-color:#d0d9ff; display:inline-block; border-radius:20px;padding:4px 8px 2px 8px;"
            );
            for (var j = 0; j < confOBJ[i].direct.length; j++) {
                var _img = suo.domCreate2(
                    "img",
                    {
                        setName: ["className", "src"],
                        setValue: ["item_edit", chrome.runtime.getURL("") + "image/" + "direct.png"],
                    },
                    null,
                    "height:24px;" + suo.directimg(confOBJ[i].direct[j])
                );
                _direct.appendChild(_img);
            }
            _li.appendChild(_direct);
            _ul.appendChild(_li);
        }
        _dom.querySelector(".box_content").style.cssText += "overflow:auto;margin-bottom:8px;";
        _dom.querySelector(".box_content").appendChild(_ul);
        suo.initPos(_dom);
    },
    initPop: () => {
        if (config.general.fnswitch.fnicon) {
            chrome.action.setPopup({ popup: "" });
        } else {
            chrome.action.setPopup({ popup: "../html/popup.html" });
        }
    },
    initI18n: () => {
        var i18nOBJ = document.querySelectorAll("[data-i18n]");

        for (var i = 0; i < i18nOBJ.length; i++) {
            const _str = i18nOBJ[i].dataset.i18n;
            let trans = suo.getI18n(_str);
            // if (_str.indexOf("des_") == 0) {
            //     trans = "*" + trans;
            // }
            if (!trans) {
                continue;
            }
            if (i18nOBJ[i].tagName.toLowerCase() == "input" && i18nOBJ[i].type == "button") {
                i18nOBJ[i].value = trans;
            } else if (i18nOBJ[i].title == "_i18n") {
                i18nOBJ[i].title = trans;
            } else {
                i18nOBJ[i].innerText = trans;
            }
        }
    },
    getI18n: str => {
        // console.log(str)
        if (
            [
                "n_mute",
                "n_stop",
                "n_reload",
                "n_move",
                "n_detach",
                "n_switchtab",
                "n_copytab",
                "n_copytabele_target",
                "n_bookmark",
                "n_savepage",
                "n_mail_target",
            ].contains(str)
        ) {
            str = "n_tab";
        }
        return chrome.i18n.getMessage(str) || str;
    },
    MSG: message => {
        chrome.runtime.sendMessage(message, response => {});
    },
    saveConf: (str, type, mytime) => {
        config.general.settings.autosave ? suo.saveConf2(str, type, mytime) : null;
    },
    saveConf2: (str, type, mytime) => {
        chrome.runtime.sendMessage({ type: "saveConf", value: config });
    },
    domCreate2: (edom, eele, einner, ecss, edata, etxt) => {
        var dom = document.createElement(edom);
        if (eele) {
            for (var i = 0; i < eele.setName.length; i++) {
                if (eele.setName[i] == "for") {
                    //if(["for","checked"].contains(eele.setName[i])){
                    dom.setAttribute(eele.setName[i], eele.setValue[i]);
                } else if (eele.setName[i] == "checked") {
                    eele.setValue[i] ? dom.setAttribute(eele.setName[i], "checked") : null;
                } else if (eele.setName[i] == "readonly") {
                    dom.setAttribute(eele.setName[i], "");
                } else {
                    dom[eele.setName[i]] = eele.setValue[i];
                }
            }
        }
        if (einner) {
            dom.innerHTML = einner;
        }
        if (ecss) {
            dom.style.cssText += ecss;
        }
        if (edata) {
            for (var i = 0; i < edata.setName.length; i++) {
                dom.dataset[edata.setName[i]] = edata.setValue[i];
            }
        }
        if (etxt) {
            dom.innerText = etxt;
        }
        return dom;
    },
    itemDel: e => {
        var ele = e.target;
        var confArray = suo.getDataset(ele, "confobj", "value").split("|");
        // del permissions
        var removePer = removed => {
            if (removed) {
                suo.initPer();
                chrome.runtime.sendMessage({ type: "getpers" }, response => {});
                suo.showMsgBox(suo.getI18n("msg_delpers"), "save", 3);
                return;
            } else {
                suo.showMsgBox(suo.getI18n("msg_delpers_fail"), "warning", 3);
                return;
            }
        };
        if (confArray[0] == "per_pers") {
            var thepers = e.target.parentNode.querySelector(".item_name").innerText;
            chrome.permissions.remove({ permissions: [thepers] }, removed => {
                removePer(removed);
            });
            return;
        }
        if (confArray[0] == "per_orgs") {
            var theorgs = e.target.parentNode.querySelector(".item_name").innerText;
            chrome.permissions.remove({ origins: [theorgs] }, removed => {
                removePer(removed);
            });
            return;
        }

        var confOBJ = config,
            actionType = suo.getDataset(ele, "actiontype", "value");
        for (var i = 0; i < (confArray.length >= 3 ? confArray.length : confArray.length); i++) {
            confOBJ = confOBJ[confArray[i]];
        }
        if (confOBJ.length <= 1) {
            suo.showMsgBox(suo.getI18n("msg_dellast"), "warning");
            return;
        }

        var delId = suo.getDataset(ele, "confid", "value");
        //check if the engine/script in use
        if (confArray[1] == "engine" || confArray[1] == "script") {
            //check in use
            var theType = confArray[2];
            var OBJArray = [
                config.mges.actions,
                config.drg.tdrg,
                config.drg.idrg,
                config.wges.actions,
                config.rges.actions,
                config.pop.actions,
            ];
            for (j = 0; j < OBJArray.length; j++) {
                for (var i = 0; i < OBJArray[j].length; i++) {
                    for (var ii = 0; OBJArray[j][i].selects && ii < OBJArray[j][i].selects.length; ii++) {
                        if (
                            OBJArray[j][i].selects[ii].type == "n_" + theType &&
                            OBJArray[j][i].selects[ii].value == delId
                        ) {
                            suo.showMsgBox(suo.getI18n("msg_delinuse"), "warning");
                            return;
                        }
                    }
                }
            }
        }

        confOBJ.splice(delId, 1);
        //reset engine/script id for action
        if (confArray[1] == "engine" || confArray[1] == "script") {
            var theType = confArray[2];
            var OBJArray = [
                config.mges.actions,
                config.drg.tdrg,
                config.drg.idrg,
                config.wges.actions,
                config.rges.actions,
                config.pop.actions,
            ];
            for (j = 0; j < OBJArray.length; j++) {
                for (var i = 0; i < OBJArray[j].length; i++) {
                    for (var ii = 0; OBJArray[j][i].selects && ii < OBJArray[j][i].selects.length; ii++) {
                        if (OBJArray[j][i].selects[ii].type == "n_" + theType) {
                            if (Math.abs(OBJArray[j][i].selects[ii].value) > Math.abs(delId)) {
                                OBJArray[j][i].selects[ii].value = Math.abs(OBJArray[j][i].selects[ii].value) - 1;
                            }
                        }
                    }
                }
            }
        }
        //reset jslist's enabled array.
        if (confArray[1] == "script") {
            delete config.apps.jslist.enabled;
        }
        suo.saveConf();
        suo.initListItem(actionType);
    },
    showMsgBox: (str, type, mytime, index) => {
        console.log("msgbox");
        var str = str ? str : suo.getI18n("msg_saved");
        var type = type ? type : "save";
        var mytime = mytime && mytime > 0 ? mytime : 2;
        var index = index ? index : 1;
        var OBJ = document.querySelector("#msgbox");
        suo.posMsgBox();
        switch (type) {
            case "save":
                OBJ.style.cssText += "background-color:#259b24;";
                break;
            case "error":
                OBJ.style.cssText += "background-color:red;";
                break;
            case "warning":
                OBJ.style.cssText += "background-color:yellow;color:rgba(0,0,0,.8);";
                break;
        }
        OBJ.textContent = "";
        if (typeof str == "string") {
            OBJ.innerText = str;
        } else if (typeof str == "object") {
            for (var i = 0; i < str.length; i++) {
                var _div = suo.domCreate2("div", null, null, null, null, str[i]);
                OBJ.appendChild(_div);
            }
        }
        window.setTimeout(() => {
            OBJ.style.cssText += "transition:all .4s ease-in-out;top:70px;opacity:1;z-index:" + index;
        }, 100);
        window.setTimeout(() => {
            OBJ.style.cssText += "transition:all .5s ease-in-out;top:0px;opacity:0;z-index:1";
        }, mytime * 1000);
    },
    posMsgBox: () => {
        var OBJ = document.querySelector("#msgbox");
        OBJ.style.left =
            (window.innerWidth -
                Number.parseInt(
                    window.getComputedStyle(OBJ).width.substr(0, window.getComputedStyle(OBJ).width.length - 2)
                )) /
                2 +
            "px";
    },
    directimg: direct => {
        var myDeg = {
            L: "0deg",
            l: "45deg",
            U: "90deg",
            u: "135deg",
            R: "180deg",
            r: "225deg",
            D: "270deg",
            d: "315deg",
        };
        return "-webkit-transform:rotate(+" + myDeg[direct] + ");";
    },
    initUi1: type => {
        console.log(type);
        var dom = document.querySelector("#set-" + type + "ui .setcontent");
        dom.textContent = "";
        var uitype = ["line", "direct", "tip", "note", "allaction"];
        for (var i = 0; i < uitype.length; i++) {
            dom.appendChild(
                suo.domCreate2(
                    "input",
                    {
                        setName: ["type", "className"],
                        setValue: ["checkbox", "init uicheckbox change-input change-ui uienable"],
                    },
                    null,
                    null,
                    { setName: ["confele"], setValue: [uitype[i] + "|enable"] }
                )
            );
            dom.appendChild(
                suo.domCreate2("label", null, null, null, null, suo.getI18n("ui_" + uitype[i] + "_enable"))
            );
            dom.appendChild(suo.domCreate2("br"));
            var dompart = suo.domCreate2("div", { setName: ["className"], setValue: ["uibox"] }, null, null, {
                setName: ["confobj"],
                setValue: [type + "|ui|" + uitype[i]],
            });
            if (!config[type].ui[uitype[i]].enable) {
                dompart.style.cssText += "display:none;";
            }
            for (var ii = 0; ii < ui[uitype[i]].length; ii++) {
                var _conf = config[type].ui[uitype[i]];
                dompart.appendChild(suo.domUi(ui[uitype[i]][ii], _conf));
            }
            dom.appendChild(dompart);
        }
    },
    domUi: (obj, conf) => {
        var dom = suo.domCreate2("div");
        var domlabel = suo.domCreate2(
            "label",
            { setName: ["className"], setValue: ["uilabel"] },
            null,
            null,
            null,
            suo.getI18n("ui_" + obj.confele)
        );
        var dommain = suo.domCreate2(
            obj.dom,
            { setName: ["type", "className"], setValue: [obj.type, "change"] },
            null,
            null,
            { setName: ["confele"], setValue: [obj.confele] }
        );
        dommain.classList.add("init");
        if (obj.type == "range") {
            dommain.min = obj.range.min;
            dommain.max = obj.range.max;
            dommain.step = obj.range.step;
            var _rangebox = suo.domCreate2("span", {
                setName: ["className"],
                setValue: ["uirangebox"],
            });
            var box_unit = suo.domCreate2("span", {
                setName: ["className"],
                setValue: ["box_unit"],
            });
            var _unit = "";
            switch (obj.confele) {
                case "opacity":
                    _unit = "%";
                    break;
                case "width":
                    _unit = "px";
            }
            box_unit.innerText = _unit;

            dom.appendChild(domlabel);
            dom.appendChild(dommain);
            dom.appendChild(_rangebox);
            dom.appendChild(box_unit);
        } else if (obj.type == "checkbox") {
            dom.appendChild(dommain);
            dom.appendChild(domlabel);
        } else if (obj.type == "color") {
            dommain.classList.add("uicolor");
            dom.appendChild(domlabel);
            dom.appendChild(dommain);
        } else if (obj.dom == "select") {
            for (var i = 0; i < obj.select.length; i++) {
                dommain.appendChild(
                    suo.domCreate2(
                        "option",
                        { setName: ["value"], setValue: [obj.select[i]] },
                        null,
                        null,
                        null,
                        suo.getI18n(/*"s_o_"+*/ obj.select[i])
                    )
                );
            }
            dom.appendChild(domlabel);
            dom.appendChild(dommain);
        }
        return dom;
    },
    initUI: uitype => {
        suo.initUi1(uitype);
    },
    initMenu: () => {
        var menuDom = document.querySelector("menu>#menubox");
        menuDom.textContent = "";
        for (var i = 0; i < menuModel.main.length; i++) {
            menuP = suo.domCreate2(
                "div",
                {
                    setName: ["className", "id"],
                    setValue: ["menup", "m-" + menuModel.main[i]],
                },
                null,
                null,
                { setName: ["confobj"], setValue: [menuModel.main[i]] },
                suo.getI18n(menuModel.main[i])
            );
            if (menuModel.main[i] === "apps") {
                menuP.style.display = "none";
            }
            var menuUL = suo.domCreate2("ul", {
                setName: ["className"],
                setValue: ["menuul"],
            });

            if (i == 0) {
                menuP.classList.add("menu-current");
            } else {
                menuUL.style.display = "none";
            }
            for (var j = 0; j < menuModel[menuModel.main[i]].length; j++) {
                var menuData = { setName: ["id0", "id1"], setValue: [i, j] };
                var menuLI = suo.domCreate2(
                    "li",
                    { setName: ["className"], setValue: ["menuli"] },
                    null,
                    null,
                    menuData,
                    suo.getI18n(menuModel[menuModel.main[i]][j])
                );
                if (i == 1 && j == 3 && suo.cons.os == "win") {
                    continue;
                }
                menuUL.appendChild(menuLI);
            }
            menuDom.appendChild(menuP);
            menuDom.appendChild(menuUL);
            //init fnswitch menu
            if (i > 1 && i < menuModel.main.length - 1) {
                var domOBJ = document.querySelector("#m-" + menuModel.main[i]);
                if (config.general.fnswitch["fn" + menuModel.main[i]]) {
                    domOBJ.style.display = "block";
                } else {
                    domOBJ.style.display = "none";
                }
            }
        }
        suo.clickMenuLI(document.querySelector(".menuul").firstChild);
    },
    clickMenuLI: e => {
        console.log(e.target);
        var ele = e.target || e;
        var sets = document.querySelectorAll(".set");
        for (var i = 0; i < sets.length; i++) {
            sets[i].style.display = "none";
            sets[i].style.opacity = 0;
        }
        for (var i = 0; i < document.querySelectorAll(".menuli").length; i++) {
            document.querySelectorAll(".menuli")[i].classList.remove("menulicurrent");
        }
        ele.classList.add("menulicurrent");
        var setDom = document.querySelector(".set-" + ele.dataset.id0 + ele.dataset.id1);
        if (setDom) {
            setDom.style.cssText += "display:block;transition:all .9s ease-in-out;";
            window.setTimeout(() => {
                setDom.style.cssText += "opacity:.9;transition:all .9s ease-in-out;";
            }, 10);
            suo.initValue(setDom, true);
        }
        suo.cons.currentOBJArray = setDom.dataset.confobj.split("|");
        if (suo.cons.currentOBJArray[0]) {
            //document.querySelector("#nav_reset").style.display = "inline-block";
            document.querySelector("#nav_reset").style.display = "none";
            config.general.autosave ? (document.querySelector(".nav_btn_save").style.display = "inline-block") : null;
            document.querySelector("#resetcurrent").style.display = "block";
        } else {
            document.querySelector("#nav_reset").style.display = "none";
            document.querySelector(".nav_btn_save").style.display = "none";
            document.querySelector("#resetcurrent").style.display = "none";
        }
        if (
            (ele.dataset.id0 == "1" && ele.dataset.id1 == "2") ||
            (ele.dataset.id0 == "2" && ele.dataset.id1 == "2") ||
            (ele.dataset.id0 == "4" && ele.dataset.id1 == "2") ||
            (ele.dataset.id0 == "4" && ele.dataset.id1 == "3") ||
            (ele.dataset.id0 == "4" && ele.dataset.id1 == "4") ||
            (ele.dataset.id0 == "7" && ele.dataset.id1 == "1") ||
            (ele.dataset.id0 == "9" && ele.dataset.id1 == "1") ||
            (ele.dataset.id0 == "10" && ele.dataset.id1 == "2") ||
            (ele.dataset.id0 == "12" && ele.dataset.id1 == "1")
        ) {
            if (ele.dataset.id0 == "1" && ele.dataset.id1 == "2") {
                suo.showBtnAdd(true, setDom.dataset.confobj + "|script", setDom);
                return;
            }
            suo.showBtnAdd(true, setDom.dataset.confobj, setDom);
        } else {
            suo.showBtnAdd(false);
        }
        if (ele.dataset.id0 == "1" && ele.dataset.id1 == "6") {
            suo.confExport();
        }
        //set sort
        const id0 = ele.dataset.id0,
            id1 = ele.dataset.id1;
        for (var i = 0; i < suo.cons.sort.length; i++) {
            if (suo.cons.sort[i][0] == id0 && suo.cons.sort[i][1] == id1) {
                suo.cons.sortDom = Sortable.create(document.querySelector(".set-" + id0 + id1 + " ul.con-item"), {
                    animation: 200,
                    easing: "ease-in-out",
                    ghostClass: "su_sortable_ghost",
                    chosenClass: "su_sortable_chosen",
                    onEnd: e => {
                        const arr = suo.getConfOBJ(e);
                        for (var ii in arr) {
                            if (ii == e.oldIndex) {
                                arr.splice(e.newIndex, 0, arr.splice(e.oldIndex, 1)[0]);
                                break;
                            }
                        }
                        console.log(arr);
                        suo.initListItem(e.item.dataset.actiontype);
                        suo.saveConf();
                    },
                });
                break;
            }
        }
    },
    clickMenuDiv: e => {
        var ele = e.target || e;
        var menuDivDoms = document.querySelectorAll(".menup");
        var menuULDoms = document.querySelectorAll(".menuul");
        var menuLIDoms = document.querySelectorAll(".menuli");
        var theMenuUL = ele.nextSibling;
        for (var i = 0; i < menuDivDoms.length; i++) {
            menuDivDoms[i].classList.remove("menu-current");
        }
        ele.classList.add("menu-current");
        for (var i = 0; i < menuULDoms.length; i++) {
            if (window.getComputedStyle(menuULDoms[i]).opacity) {
                var forDom = menuULDoms[i];
                menuULDoms[i].style.cssText += "display:none;transition:all .2s ease-in-out;height:0;opacity:0;";
                window.setTimeout(() => {
                    forDom.style.cssText += "display:none;";
                }, 300);
            }
        }
        suo.clickMenuLI(theMenuUL.firstChild);
        window.setTimeout(() => {
            theMenuUL.style.cssText += "display:block;";
            window.setTimeout(() => {
                var t = 0;
                var confArray = suo.getConfArray(ele);
                if (confArray[0] == "sdrg" || confArray[0] == "drg") {
                    //check menuli height
                    if (!config[confArray[0]].settings.txt) {
                        t++;
                    }
                    if (!config[confArray[0]].settings.lnk) {
                        t++;
                    }
                    if (!config[confArray[0]].settings.img) {
                        t++;
                    }
                }
                theMenuUL.style.cssText +=
                    "transition:all .4s ease-in-out;opacity:1;height:" +
                    ((theMenuUL.childNodes.length - t) * (30 + 2) + 1) +
                    "px;";
            }, 10);
        }, 400);
    },
    createMoreSelect: (type, value, confOBJ) => {
        let i = 0;
        console.log(confOBJ);
        console.log(type);
        var valueOBJ = {
            setName: ["name", "className"],
            setValue: [type, "box_select"],
        };
        var domSelect = suo.domCreate2("select", valueOBJ);
        var index = 0;
        if (["n_txtengine", "n_imgengine", "n_script"].contains(type)) {
            var type = type.substr(2);
            for (
                i = 0;
                i < (type == "script" ? config.general.script[type].length : config.general.engine[type].length);
                i++
            ) {
                domSelect.appendChild(
                    suo.domCreate2(
                        "option",
                        { setName: ["value"], setValue: ["" + i] },
                        null,
                        null,
                        null,
                        type == "script"
                            ? config.general.script[type][i]["name"]
                            : config.general.engine[type][i]["name"]
                    )
                );
                if (i == value) {
                    index = i;
                }
            }
            domSelect.appendChild(
                suo.domCreate2(
                    "option",
                    { setName: ["value"], setValue: ["add_from_select"] },
                    null,
                    null,
                    null,
                    "Add new ..."
                )
            );
        } else {
            let _obj = {};
            _obj =
                actionOptions.special[confOBJ.name] && actionOptions.special[confOBJ.name][type]
                    ? actionOptions.special[confOBJ.name][type]
                    : actionOptions.selects[type];
            console.log(_obj);
            for (i = 0; i < _obj.length; i++) {
                domSelect.appendChild(
                    suo.domCreate2(
                        "option",
                        { setName: ["value"], setValue: [_obj[i]] },
                        null,
                        null,
                        null,
                        type == "n_voicename" ? _obj[i] : suo.getI18n(_obj[i])
                    )
                );
                if (type == "script") {
                    if (i == value) {
                        index = i;
                    }
                } else {
                    if (value == _obj[i]) {
                        index = i;
                    }
                }
            }
        }
        domSelect.selectedIndex = index;
        return domSelect;
    },
    createMoreText: _conf => {
        var conf = JSON.parse(JSON.stringify(_conf));
        if (conf.value == undefined) {
            conf.value = actionOptions.texts[conf.type];
        }

        var dom = suo.domCreate2("div", {
            setName: ["className"],
            setValue: ["box_optionlist"],
        });
        var labelText = suo.domCreate2(
                "label",
                { setName: ["className"], setValue: ["boxlabel"] },
                null,
                null,
                null,
                suo.getI18n(conf.type)
            ),
            domText = suo.domCreate2("input", {
                setName: ["name", "type", "value", "className"],
                setValue: [conf.type, "text", conf.value, "box_text"],
            });

        dom.appendChild(labelText);
        dom.appendChild(domText);
        return dom;
    },
    createMoreCheck: _conf => {
        var _time = Number.parseInt(new Date().getTime() / 1000) + Number.parseInt(Math.random() * 1000).toString();

        // copy all actionOptions elements to new conf
        var conf = JSON.parse(JSON.stringify(_conf));
        for (var i in actionOptions.checks[conf.type]) {
            if (conf[i] == undefined) {
                conf[i] = actionOptions.checks[conf.type][i];
            }
        }

        var dom = suo.domCreate2("div", {
                setName: ["className"],
                setValue: ["box_optionlist"],
            }),
            labelCheck = suo.domCreate2(
                "label",
                { setName: ["id", "for"], setValue: [conf.type, conf.type] },
                null,
                null,
                null,
                suo.getI18n(conf.type)
            ),
            domCheck = suo.domCreate2("input", {
                setName: ["id", "className", "type", "name"],
                setValue: [conf.type, "box_check", "checkbox", conf.type],
            });
        dom.appendChild(domCheck);
        dom.appendChild(labelCheck);

        if (conf.typeCheck) {
            domCheck.checked = conf.value;
            var _checkList = suo.domCreate2(
                "div",
                { setName: ["className"], setValue: ["box_checklist"] },
                null,
                conf.value ? "display:block;" : "display:none;"
            );

            switch (conf.typeCheck) {
                case "default":
                    break;
                case "text":
                    var domText = suo.domCreate2("input", {
                        setName: ["name", "type", "value", "className"],
                        setValue: [
                            conf.type,
                            "text",
                            conf.valueOption == undefined
                                ? actionOptions.checks[conf.type].options.valueOption
                                : conf.valueOption,
                            "box_checktext",
                        ],
                    });
                    _checkList.appendChild(domText);
                    break;
                case "select":
                    var domSelect = suo.domCreate2("select", {
                        setName: ["name", "className"],
                        setValue: [conf.type, "box_checkselect"],
                    });
                    for (i = 0; i < conf.options.settings.length; i++) {
                        domSelect.appendChild(
                            suo.domCreate2(
                                "option",
                                { setName: ["value"], setValue: [conf.options.settings[i]] },
                                null,
                                null,
                                null,
                                suo.getI18n(conf.options.settings[i])
                            )
                        );
                    }
                    domSelect.selectedIndex = 0;
                    domSelect.value = conf.valueOption == undefined ? conf.options.valueOption : conf.valueOption;
                    _checkList.appendChild(domSelect);
                    break;
                case "range":
                    var domRangeBox = suo.domCreate2("div", {
                        setName: ["className"],
                        setValue: ["box_checkrange"],
                    });
                    var domRange = suo.domCreate2(
                            "input",
                            {
                                setName: ["className", "name", "type", "min", "max", "step", "value"],
                                setValue: [
                                    "change box_range",
                                    conf.type,
                                    "range",
                                    conf.options.settings[0],
                                    conf.options.settings[1],
                                    conf.options.settings[2],
                                    conf.valueOption == undefined ? conf.options.valueOption : conf.valueOption,
                                ],
                            },
                            null,
                            null,
                            { setName: ["typechange"], setValue: ["actionedit"] }
                        ),
                        domText = suo.domCreate2(
                            "span",
                            { setName: ["className"], setValue: ["box_rangevalue"] },
                            null,
                            null,
                            null,
                            domRange.value
                        );
                    domRangeBox.appendChild(domRange);
                    domRangeBox.appendChild(domText);

                    if (conf.options.settings[3]) {
                        var domUnit = suo.domCreate2(
                            "span",
                            { setName: ["className"], setValue: ["box_rangeunit"] },
                            null,
                            null,
                            null,
                            " ( " + conf.options.settings[3] + " ) "
                        );
                        domRangeBox.appendChild(domUnit);
                    }

                    _checkList.appendChild(domRangeBox);
                    break;
                case "radio":
                    var domRadio = suo.domCreate2("div", {
                        setName: ["className"],
                        setValue: ["box_checkradio"],
                    });
                    for (var i = 0; i < conf.options.settings.length; i++) {
                        var _dom = suo.domCreate2("div", null, null, "clear:both;"),
                            _option = suo.domCreate2("input", {
                                setName: ["id", "className", "type", "name", "value"],
                                setValue: [
                                    "box_radiooption_" + i + _time,
                                    "box_radiooption",
                                    "radio",
                                    conf.typeCheck,
                                    conf.options.settings[i].name,
                                ],
                            }),
                            _label = suo.domCreate2(
                                "label",
                                {
                                    setName: ["className", "for"],
                                    setValue: ["box_radiooptionlabel", "box_radiooption_" + i + _time],
                                },
                                null,
                                null,
                                null,
                                suo.getI18n(conf.options.settings[i].name)
                            );
                        _dom.appendChild(_option);
                        _dom.appendChild(_label);
                        domRadio.appendChild(_dom);

                        if (conf.valueOption == undefined) {
                            if (conf.options.valueOption == conf.options.settings[i].name) {
                                _option.checked = true;
                            }
                        } else {
                            if (conf.valueOption == conf.options.settings[i].name) {
                                _option.checked = true;
                            }
                        }

                        var _radioList = suo.domCreate2("div", {
                            setName: ["className"],
                            setValue: ["box_radiolist"],
                        });
                        switch (conf.options.settings[i].typeSetting) {
                            case "text":
                                var _text = suo.domCreate2("input", {
                                    setName: ["className", "type", "value"],
                                    setValue: [
                                        "box_radiooptiontext",
                                        "text",
                                        conf.valueOption == conf.options.settings[i].name
                                            ? conf.valueSetting
                                            : conf.options.settings[i].valueSetting,
                                    ],
                                });
                                _radioList.appendChild(_text);
                                break;
                            case "select":
                                var _select = suo.domCreate2("select", {
                                    setName: ["className"],
                                    setValue: ["box_radiooptionselect"],
                                });
                                for (var ii = 0; ii < conf.options.settings[i].moreSetting.length; ii++) {
                                    var _selectOption = suo.domCreate2(
                                        "option",
                                        null,
                                        null,
                                        null,
                                        null,
                                        suo.getI18n(conf.options.settings[i].moreSetting[ii])
                                    );
                                    _select.appendChild(_selectOption);
                                }
                                _select.selectedIndex = 0;
                                _select.value =
                                    conf.valueOption == conf.options.settings[i].name
                                        ? conf.valueSetting
                                        : conf.options.settings[i].valueSetting;
                                _radioList.appendChild(_select);
                                break;
                            case "range":
                                var _div = suo.domCreate2("div", {
                                        setName: ["className"],
                                        setValue: ["box_radiooptionrangebox"],
                                    }),
                                    _range = suo.domCreate2(
                                        "input",
                                        {
                                            setName: ["className", "type", "min", "max", "step", "value"],
                                            setValue: [
                                                "change box_radiooptionrange",
                                                "range",
                                                conf.options.settings[i].moreSetting[0],
                                                conf.options.settings[i].moreSetting[1],
                                                conf.options.settings[i].moreSetting[2],
                                                conf.valueOption == conf.options.settings[i].name
                                                    ? conf.valueSetting
                                                    : conf.options.settings[i].valueSetting,
                                            ],
                                        },
                                        null,
                                        null,
                                        { setName: ["typechange"], setValue: ["actionedit"] }
                                    ),
                                    _text = suo.domCreate2(
                                        "span",
                                        {
                                            setName: ["className"],
                                            setValue: ["box_radiooptionrangetext"],
                                        },
                                        null,
                                        null,
                                        null,
                                        _range.value
                                    ),
                                    _unit = suo.domCreate2(
                                        "span",
                                        {
                                            setName: ["className"],
                                            setValue: ["box_radiooptionrangeunit"],
                                        },
                                        null,
                                        null,
                                        null,
                                        " ( " + conf.options.settings[i].moreSetting[3] + " ) "
                                    );
                                _div.appendChild(_range);
                                _div.appendChild(_text);
                                _div.appendChild(_unit);
                                _radioList.appendChild(_div);
                                break;
                        }

                        if (_radioList.hasChildNodes()) {
                            _dom.appendChild(_radioList);
                            if (_option.checked) {
                                _radioList.style.cssText += "display:block;";
                            }
                        }
                    }
                    _checkList.appendChild(domRadio);
                    break;
            }
            _checkList.hasChildNodes() ? dom.appendChild(_checkList) : null;
        } else {
            domCheck.checked = conf.value;
        }

        return dom;
    },
    createMoreRange: _conf => {
        console.log(_conf);
        var conf = JSON.parse(JSON.stringify(_conf));
        if (conf.value == undefined) {
            for (var i in actionOptions.ranges[conf.type]) {
                conf[i] = actionOptions.ranges[conf.type][i];
            }
        }
        console.log(conf);

        var dom = suo.domCreate2("div", {
                setName: ["className"],
                setValue: ["box_optionlist"],
            }),
            labelRange = suo.domCreate2(
                "label",
                { setName: ["className"], setValue: ["boxlabel"] },
                null,
                null,
                null,
                suo.getI18n(conf.type)
            );
        dom.appendChild(labelRange);

        var arrayOptions = actionOptions.ranges[conf.type].options;

        var _range = suo.domCreate2(
            "input",
            {
                setName: ["className", "type", "name", "min", "max", "step", "value"],
                setValue: [
                    "change box_range",
                    "range",
                    conf.type,
                    arrayOptions[0],
                    arrayOptions[1],
                    arrayOptions[2],
                    conf.value,
                ],
            },
            null,
            null,
            { setName: ["typechange"], setValue: ["actionedit"] }
        );
        dom.appendChild(_range);

        var _text = suo.domCreate2(
            "span",
            { setName: ["className"], setValue: ["box_rangevalue"] },
            null,
            null,
            null,
            conf.value
        );
        dom.appendChild(_text);

        if (arrayOptions[3]) {
            _range.style.cssText += "width:83px;";
            var _unit = suo.domCreate2(
                "span",
                { setName: ["className"], setValue: ["box_rangeunit"] },
                null,
                null,
                null,
                " ( " + arrayOptions[3] + " ) "
            );
            dom.appendChild(_unit);
        }

        return dom;
    },
    createMoreRadio: _conf => {
        var _time = Number.parseInt(new Date().getTime() / 1000) + Number.parseInt(Math.random() * 1000).toString();

        // copy all actionOptions elements to new conf
        var conf = JSON.parse(JSON.stringify(_conf));
        for (var i in actionOptions.radios[conf.type]) {
            if (conf[i] == undefined) {
                conf[i] = actionOptions.radios[conf.type][i];
            }
        }
        console.log(conf);

        var dom = suo.domCreate2("div", { setName: ["className"], setValue: ["box_optionlist"] }, null, null, {
                setName: ["confobj"],
                setValue: [conf.type],
            }),
            labelRadio = suo.domCreate2(
                "span",
                { setName: ["className"], setValue: ["box_radiolabel"] },
                null,
                null,
                null,
                suo.getI18n(conf.type)
            ),
            domOption = suo.domCreate2("div", { setName: ["className"], setValue: ["box_radio"] }, null, null, {
                setName: ["confobj"],
                setValue: [conf.type],
            });
        dom.appendChild(labelRadio);
        dom.appendChild(domOption);

        for (var i = 0; i < conf.options.settings.length; i++) {
            var _dom = suo.domCreate2("div"),
                _option = suo.domCreate2("input", {
                    setName: ["id", "className", "type", "name", "value"],
                    setValue: [
                        "box_radiooption_" + i + _time,
                        "box_radiooption",
                        "radio",
                        conf.type,
                        conf.options.settings[i].name,
                    ],
                }),
                _domLabel = suo.domCreate2(
                    "label",
                    {
                        setName: ["className", "for"],
                        setValue: ["box_radiooptionlabel", "box_radiooption_" + i + _time],
                    },
                    null,
                    null,
                    null,
                    suo.getI18n(conf.options.settings[i].name)
                );

            _dom.appendChild(_option);
            _dom.appendChild(_domLabel);
            domOption.appendChild(_dom);

            // set checked option
            console.log(conf.value);
            if (conf.value == undefined) {
                if (conf.options.valueOption == conf.options.settings[i].name) {
                    _option.checked = true;
                }
            } else {
                console.log(conf.value);
                if (conf.value == conf.options.settings[i].name) {
                    _option.checked = true;
                }
            }

            var _radioList = suo.domCreate2("div", {
                setName: ["className"],
                setValue: ["box_radiolist"],
            });
            switch (conf.options.settings[i].typeSetting) {
                case "text":
                    var _text = suo.domCreate2("input", {
                        setName: ["className", "type", "value"],
                        setValue: [
                            "box_radiooptiontext",
                            "text",
                            conf.value == conf.options.settings[i].name
                                ? conf.valueSetting
                                : conf.options.settings[i].valueSetting,
                        ],
                    });
                    _radioList.appendChild(_text);
                    break;
                case "select":
                    var _select = suo.domCreate2("select", {
                        setName: ["className"],
                        setValue: ["box_radiooptionselect"],
                    });
                    for (var ii = 0; ii < conf.options.settings[i].moreSetting.length; ii++) {
                        var _selectOption = suo.domCreate2(
                            "option",
                            null,
                            null,
                            null,
                            null,
                            suo.getI18n(conf.options.settings[i].moreSetting[ii])
                        );
                        _select.appendChild(_selectOption);
                    }

                    _select.selectedIndex = 0;
                    _select.value =
                        conf.value == conf.options.settings[i].name
                            ? conf.valueSetting
                            : conf.options.settings[i].valueSetting;

                    _radioList.appendChild(_select);
                    break;
                case "range":
                    var _div = suo.domCreate2("div", {
                        setName: ["className"],
                        setValue: ["box_radiooptionrangebox"],
                    });
                    var _range = suo.domCreate2(
                        "input",
                        {
                            setName: ["className", "type", "min", "max", "step", "value"],
                            setValue: [
                                "change box_radiooptionrange",
                                "range",
                                conf.options.settings[i].moreSetting[0],
                                conf.options.settings[i].moreSetting[1],
                                conf.options.settings[i].moreSetting[2],
                                conf.value == conf.options.settings[i].name
                                    ? conf.valueSetting
                                    : conf.options.settings[i].valueSetting,
                            ],
                        },
                        null,
                        null,
                        { setName: ["typechange"], setValue: ["actionedit"] }
                    );
                    var _text = suo.domCreate2(
                        "span",
                        { setName: ["className"], setValue: ["box_radiooptionrangetext"] },
                        null,
                        null,
                        null,
                        _range.value
                    );
                    var _unit = suo.domCreate2(
                        "span",
                        { setName: ["className"], setValue: ["box_radiooptionrangeunit"] },
                        null,
                        null,
                        null,
                        " ( " + conf.options.settings[i].moreSetting[3] + " ) "
                    );
                    _div.appendChild(_range);
                    _div.appendChild(_text);
                    _div.appendChild(_unit);
                    _radioList.appendChild(_div);
                    break;
            }
            if (_radioList.hasChildNodes()) {
                _dom.appendChild(_radioList);
                _option.checked ? (_radioList.style.cssText += "display:block;") : null;
            }
        }

        return dom;
    },
    set: {
        set_11: () => {
            var domOBJ = document.querySelector(".set-00>.setcontent");
            domOBJ.textContent = "";
            for (var i = 1; i < menuModel.fn.length; i++) {
                var check = suo.domCreate2(
                    "input",
                    {
                        setName: ["type", "className"],
                        setValue: ["checkbox", "fnswitch change-checkbox change-fnswitch init"],
                    },
                    "",
                    "",
                    {
                        setName: ["conf0", "conf1", "confele"],
                        setValue: ["normal", "fnswitch", "fn" + menuModel.fn[i]],
                    }
                );
                var label = suo.domCreate2("label", null, null, null, null, suo.getI18n(menuModel.fn[i]));
                var br = suo.domCreate2("br");
                domOBJ.appendChild(check);
                domOBJ.appendChild(label);
                domOBJ.appendChild(br);
            }
        },
        set_10: () => {
            var domSet = suo.domCreate2("div", { setName: ["className"], setValue: ["set set-10"] }, "", "", {
                setName: ["conf0", "conf1"],
                setValue: ["general", "settings"],
            });
            var setname = suo.domCreate2(
                "div",
                { setName: ["className"], setValue: ["setname"] },
                null,
                null,
                null,
                suo.getI18n("settings")
            );
            var setcontent = suo.domCreate2("div");
        },
    },
    initValue: (delayDom, delay) => {
        suo.initId();
        var doms = document.querySelectorAll(".init");
        if (delay) {
            doms = delayDom.querySelectorAll(".init-delay");
        }
        for (var i = 0; i < doms.length; i++) {
            var confOBJ = suo.getConfOBJ(doms[i]);
            var _confele = doms[i].dataset.confele.split("|");
            var value = confOBJ[_confele[0]];
            for (var ii = 1; ii < _confele.length; ii++) {
                value = value[_confele[ii]];
            }

            if (doms[i].tagName.toLowerCase() == "input" && doms[i].type == "checkbox") {
                doms[i].checked = value;
                var confArray = suo.getConfArray(doms[i]);
                doms[i].id =
                    "chk_" + confArray[0] + "_" + confArray[1] + "_" + doms[i].dataset.confele.replace("|", "_");
                doms[i].nextSibling.setAttribute("for", doms[i].id);
                //drg/sdrg|settings
                if (["txt", "lnk", "img"].contains(doms[i].dataset.confele)) {
                    for (var ii = 0; ii < 3; ii++) {
                        if (doms[i].dataset.confele == ["txt", "lnk", "img"][ii]) {
                            var theDom = document.querySelector(
                                "[data-id0='" +
                                    (confArray[0] == "sdrg" ? "3" : "4") +
                                    "'][data-id1='" +
                                    (confArray[0] == "sdrg" ? ii + 1 : ii + 2) +
                                    "']"
                            );
                            confOBJ[doms[i].dataset.confele]
                                ? (theDom.style.display = "block")
                                : (theDom.style.display = "none");
                            theDom.parentNode.style.height = "auto";
                        }
                    }
                }
            }
            if (doms[i].tagName.toLowerCase() == "input" && doms[i].type == "color") {
                doms[i].value = value;
            }
            if (doms[i].tagName.toLowerCase() == "select") {
                var selectsDom = doms[i].querySelectorAll("option");
                for (var ii = 0; ii < selectsDom.length; ii++) {
                    if (selectsDom[ii].value == value) {
                        doms[i].selectedIndex = ii;
                    }
                }
            }
            if (doms[i].tagName.toLowerCase() == "input" && doms[i].type == "range") {
                doms[i].value = value;
                doms[i].nextSibling.textContent = value;
            }
            if (doms[i].classList.contains("init_radio")) {
                var domRadios = doms[i].querySelectorAll("input[type=radio]");
                for (var ii = 0; ii < domRadios.length; ii++) {
                    if (domRadios[ii].value == value) {
                        console.log(domRadios[ii]);
                        domRadios[ii].checked = "true";
                        break;
                    }
                }
            }
        }
    },
    initId: () => {
        var doms = document.querySelectorAll(".initid");
        for (var i = 0; i < doms.length; i++) {
            var confArray = suo.getConfArray(doms[i]);
            doms[i].id = "chk_" + confArray[0] + "_" + confArray[1] + "_" + doms[i].dataset.confele.replace(/\|/g, "_");
            doms[i].nextSibling.setAttribute("for", doms[i].id);
        }
    },
    getConfArray: e => {
        var ele = e.target || e;
        var getdata = ele => {
            if (ele.dataset.confobj) {
                return ele.dataset.confobj;
            } else {
                return getdata(ele.parentNode);
            }
        };
        var confArray = getdata(ele).split("|");
        return confArray;
    },
    getConfOBJ: e => {
        var ele = e.target || e;
        var getdata = ele => {
            if (ele.dataset.confobj) {
                return ele.dataset.confobj;
            } else {
                return getdata(ele.parentNode);
            }
        };
        var confArray = getdata(ele).split("|");
        var confOBJ = config;
        if (confArray[0] && confArray[0] == "about" && confArray[1] && confArray[1] == "donatedev") {
            if (!config.about) {
                config.about = {};
                config.about.donatedev = {};
                config.about.donatedev.ad = true;
            }
            if (!config.about.donatedev) {
                config.about.donatedev = {};
                config.about.donatedev.ad = true;
            }
        }
        for (var i = 0; i < confArray.length; i++) {
            confOBJ = confOBJ[confArray[i]];
        }
        return confOBJ;
    },
    changeUi: e => {
        var ele = e.target;
        var confOBJ = suo.getConfOBJ(e);
        var confArray = ele.dataset.confele.split("|");
        if (ele.tagName.toLowerCase() == "input" || ele.tagName.toLowerCase() == "select") {
            var eleType = ele.type;
            if (eleType == "range" && ele.nextSibling.classList.contains("uirangebox")) {
                ele.nextSibling.innerText = ele.value;
            }
            if (confArray.length == 1) {
                confOBJ[confArray[0]] = eleType == "checkbox" ? ele.checked : ele.value;
            } else {
                confOBJ[confArray[0]][confArray[1]] = eleType == "checkbox" ? ele.checked : ele.value;
                suo.uibox(e);
            }
        }
        suo.saveConf();
    },
    uibox: e => {
        var ele = e.target;
        var confArray = suo.getConfArray(e);
        var theDom = ele.parentNode.querySelector(
            "[data-confobj='" + confArray[0] + "|" + confArray[1] + "|" + ele.dataset.confele.split("|")[0] + "']"
        );
        ele.checked ? suo.domShow(theDom) : suo.domHide(theDom);
    },
    changeRadio: e => {
        var ele = e.target || e;
        var getdata = ele => {
            if (ele.dataset.confobj) {
                return ele.dataset.confobj;
            } else {
                return getdata(ele.parentNode);
            }
        };
        var confArray = getdata(ele).split("|");
        var confOBJ = config;
        for (var i = 0; i < confArray.length; i++) {
            confOBJ = confOBJ[confArray[i]];
        }
        confOBJ[ele.parentNode.dataset.confele] = ele.value;
        suo.saveConf();
    },
    changeSelect: e => {
        var ele = e.target || e;
        var getdata = ele => {
            if (ele.dataset.confobj) {
                return ele.dataset.confobj;
            } else {
                return getdata(ele.parentNode);
            }
        };
        var confArray = getdata(ele).split("|");
        var confOBJ = config;
        for (var i = 0; i < confArray.length; i++) {
            confOBJ = confOBJ[confArray[i]];
        }
        confOBJ[ele.dataset.confele] = ele.value;
        suo.saveConf();
    },
    changeCheckbox: e => {
        var ele = e.target || e;
        var getdata = ele => {
            if (ele.dataset.confobj) {
                return ele.dataset.confobj;
            } else {
                return getdata(ele.parentNode);
            }
        };
        var confArray = getdata(ele).split("|");
        var confOBJ = config;
        for (var i = 0; i < confArray.length; i++) {
            confOBJ = confOBJ[confArray[i]];
        }
        confOBJ[ele.dataset.confele] = ele.checked;
        suo.saveConf();
    },
    changeRange: e => {
        e.target.nextSibling.textContent = e.target.value;
        if (e.target.dataset && e.target.dataset.typechange == "actionedit") {
            return;
        }
        var confOBJ = suo.getConfOBJ(e);
        confOBJ[e.target.dataset.confele] = e.target.value;
        suo.saveConf();
    },
    changeFnswitch: e => {
        var ele = e.target || e;
        var domOBJ = document.querySelector("#m-" + ele.dataset.confele.substr(2, ele.dataset.confele.length - 2));
        if (ele.checked) {
            suo.domShow(domOBJ);
            if (!config[ele.dataset.confele.substr(2)]) {
                config[ele.dataset.confele.substr(2)] = defaultConf[ele.dataset.confele.substr(2)];
                suo.saveConf();
            }
            if (ele.dataset.confele.substr(2) == "drg" || ele.dataset.confele.substr(2) == "sdrg") {
                suo.initListItem("t" + ele.dataset.confele.substr(2));
                suo.initListItem("l" + ele.dataset.confele.substr(2));
                suo.initListItem("i" + ele.dataset.confele.substr(2));
            } else {
                suo.initListItem(ele.dataset.confele.substr(2));
            }
        } else {
            suo.domHide(domOBJ);
        }
    },
    initPer: () => {
        if (!chrome.permissions) {
            return;
        }
        chrome.permissions.getAll(pers => {
            theFunction(pers);
        });
        var theFunction = pers => {
            var thepers = pers.permissions;
            var theorgs = pers.origins;
            var eleOBJ = {
                setName: ["className"],
                setValue: ["item item_per item-del"],
            };
            var domOBJ_pers = document.querySelector(".ul_pers");
            domOBJ_pers.textContent = "";
            for (var i = thepers.length - 1; i > -1; i--) {
                var liOBJ = suo.domCreate2("li", eleOBJ, "", "width:200px;", {
                    setName: ["confid"],
                    setValue: [i],
                });
                var liName = suo.domCreate2(
                    "span",
                    { setName: ["className"], setValue: ["item_name"] },
                    "",
                    "",
                    "",
                    thepers[i]
                );
                var liDel = suo.domCreate2(
                    "span",
                    { setName: ["className"], setValue: ["item_del"] },
                    null,
                    null,
                    null,
                    "x"
                );
                liOBJ.appendChild(liName);
                liOBJ.appendChild(liDel);
                domOBJ_pers.appendChild(liOBJ);
            }
            for (var i = 0; i < theorgs.length; i++) {
                var liOBJ = suo.domCreate2("li", eleOBJ, "", "width:200px;", {
                    setName: ["confid"],
                    setValue: [i],
                });
                var liName = suo.domCreate2(
                    "span",
                    { setName: ["className"], setValue: ["item_name"] },
                    "",
                    "",
                    "",
                    theorgs[i]
                );
                var liDel = suo.domCreate2(
                    "span",
                    { setName: ["className"], setValue: ["item_del"] },
                    null,
                    null,
                    null,
                    "x"
                );
                liOBJ.appendChild(liName);
                liOBJ.appendChild(liDel);
                domOBJ_pers.appendChild(liOBJ);
            }
            //init change-background
            document.querySelector("#change-background").checked = pers.permissions.contains("background");
            if (pers.permissions.contains("browserSettings")) {
                document.querySelector("[data-confele=mouseup]").checked = pers.permissions.contains("browserSettings");
            }
        };
    },
    initListItem: type => {
        console.log(type);
        domOBJ = document.querySelector(".ul_" + type);
        domOBJ.textContent = "";
        var confOBJ, eleOBJ, actionType;
        switch (type) {
            case "mges":
            case "touch":
            case "ksa":
                confOBJ = config[type].actions;
                eleOBJ = {
                    setName: ["className", "title"],
                    setValue: ["item item_edit item_more item_" + type, suo.getI18n("tip_item")],
                };
                actionType = type;
                break;
            case "idrg":
            case "tdrg":
            case "ldrg":
                confOBJ = config["drg"][type];
                eleOBJ = {
                    setName: ["className", "title"],
                    setValue: ["item item_edit item_more item-" + type, suo.getI18n("tip_item")],
                };
                actionType = type;
                break;
            case "txtengine":
            case "imgengine":
                confOBJ = config["general"]["engine"][type];
                eleOBJ = {
                    setName: ["className"],
                    setValue: ["item item_edit item_engine item-" + type],
                };
                actionType = type;
                break;
            case "script":
                confOBJ = config["general"]["script"][type];
                eleOBJ = {
                    setName: ["className"],
                    setValue: ["item item_edit item_script item-" + type],
                };
                actionType = type;
                break;
            case "tsdrg":
            case "lsdrg":
            case "isdrg":
                confOBJ = config["sdrg"][type];
                eleOBJ = {
                    setName: ["className"],
                    setValue: ["item item_edit item-" + type],
                };
                actionType = type;
                break;
            case "rges":
            case "wges":
            case "pop":
            case "icon":
            case "ctm":
            case "dca":
                confOBJ = config[type].actions;
                eleOBJ = {
                    setName: ["className"],
                    setValue: ["item item_edit item-" + type + " edit_" + type],
                };
                actionType = type;
                break;
        }
        if (["tsdrg", "lsdrg", "isdrg"].contains(type)) {
            for (var i = 0; i < confOBJ.length; i++) {
                var liOBJ = suo.domCreate2("li", eleOBJ, "", "padding-right:0;", {
                    setName: ["confid", "actiontype"],
                    setValue: [i, actionType],
                });
                var liName = suo.domCreate2(
                    "span",
                    { setName: ["className"], setValue: ["item_name item_edit"] },
                    null,
                    "width:160px;",
                    { setName: ["confid", "actiontype"], setValue: [i, actionType] },
                    confOBJ[i].mydes && confOBJ[i].mydes.type && confOBJ[i].mydes.value
                        ? confOBJ[i].mydes.value
                        : suo.getI18n(confOBJ[i].name)
                );
                var liDirbox = suo.domCreate2("span", {
                    setName: ["className"],
                    setValue: ["item_sdrgdir item_edit"],
                });
                var liimg = suo.domCreate2("span", {
                    setName: ["className"],
                    setValue: ["item_edit"],
                });
                liimg.style.cssText +=
                    "background:url(" +
                    chrome.runtime.getURL("") +
                    "image/" +
                    "direct.png" +
                    ") #d0d9ff center no-repeat;color:#d0d9ff;display:inline-block;width:40px;height:40px;" +
                    suo.directimg(confOBJ[i].direct);
                liDirbox.appendChild(liimg);
                liOBJ.appendChild(liName);
                liOBJ.appendChild(liDirbox);
                domOBJ.appendChild(liOBJ);
            }
            return;
        }
        if (type == "rges") {
            var _doms = document.querySelectorAll(".ul_rges");
            var liOBJ = suo.domCreate2("li", eleOBJ, "", "padding-right:0;", {
                setName: ["confid", "actiontype"],
                setValue: [0, "rges"],
            });
            var liName = suo.domCreate2(
                "span",
                { setName: ["className"], setValue: ["item_name item_edit edit_rges"] },
                null,
                "width:160px;",
                { setName: ["confid", "actiontype"], setValue: [0, "rges"] },
                confOBJ[0].mydes && confOBJ[0].mydes.type && confOBJ[0].mydes.value
                    ? confOBJ[0].mydes.value
                    : suo.getI18n(confOBJ[0].name)
            );
            liOBJ.appendChild(liName);
            _doms[0].textContent = "";
            _doms[0].appendChild(liOBJ);

            var liOBJ = suo.domCreate2("li", eleOBJ, "", "padding-right:0;", {
                setName: ["confid"],
                setValue: [1],
            });
            var liName = suo.domCreate2(
                "span",
                { setName: ["className"], setValue: ["item_name item_edit edit_rges"] },
                null,
                "width:160px;",
                { setName: ["confid", "actiontype"], setValue: [1, "rges"] },
                confOBJ[1].mydes && confOBJ[1].mydes.type && confOBJ[1].mydes.value
                    ? confOBJ[1].mydes.value
                    : suo.getI18n(confOBJ[1].name)
            );
            liOBJ.appendChild(liName);
            _doms[1].textContent = "";
            _doms[1].appendChild(liOBJ);
            return;
        }
        if (type == "wges") {
            var _doms = document.querySelectorAll(".ul_wges");
            for (var i = 0; i < _doms.length; i++) {
                var _liOBJ = suo.domCreate2("li", eleOBJ, "", "padding-right:0;", {
                    setName: ["confid", "actiontype"],
                    setValue: [i, "wges"],
                });
                var _liName = suo.domCreate2(
                    "span",
                    {
                        setName: ["className"],
                        setValue: ["item_name item_edit edit_wges"],
                    },
                    null,
                    "width:160px;",
                    { setName: ["confid", "actiontype"], setValue: [i, "wges"] },
                    confOBJ[i].mydes && confOBJ[i].mydes.type && confOBJ[i].mydes.value
                        ? confOBJ[i].mydes.value
                        : suo.getI18n(confOBJ[i].name)
                );
                _liOBJ.appendChild(_liName);
                _doms[i].textContent = "";
                _doms[i].appendChild(_liOBJ);
            }
            return;
        }
        if (type == "icon" || type == "dca") {
            for (var i = 0; i < confOBJ.length; i++) {
                var liOBJ = suo.domCreate2("li", eleOBJ, "", "padding-right:0;", {
                    setName: ["confid", "actiontype"],
                    setValue: [i, actionType],
                });
                var liName = suo.domCreate2(
                    "span",
                    { setName: ["className"], setValue: ["item_name item_edit"] },
                    null,
                    "width:160px;",
                    { setName: ["confid", "actiontype"], setValue: [i, actionType] },
                    confOBJ[i].mydes && confOBJ[i].mydes.type && confOBJ[i].mydes.value
                        ? confOBJ[i].mydes.value
                        : suo.getI18n(confOBJ[i].name)
                );
                liOBJ.appendChild(liName);
                domOBJ.appendChild(liOBJ);
            }
            return;
        }
        if (type == "ksa") {
            for (var i = 0; i < confOBJ.length; i++) {
                var liOBJ = suo.domCreate2("li", eleOBJ, "", "padding-right:0;", {
                    setName: ["confid", "actiontype"],
                    setValue: [i, actionType],
                });
                var liName = suo.domCreate2(
                    "span",
                    { setName: ["className"], setValue: ["item_name item_edit"] },
                    null,
                    "width:160px;",
                    { setName: ["confid", "actiontype"], setValue: [i, actionType] },
                    confOBJ[i].mydes && confOBJ[i].mydes.type && confOBJ[i].mydes.value
                        ? confOBJ[i].mydes.value
                        : suo.getI18n(confOBJ[i].name)
                );
                var liDel = suo.domCreate2(
                    "span",
                    {
                        setName: ["className", "title"],
                        setValue: ["item_del", suo.getI18n("tip_del")],
                    },
                    null,
                    null,
                    null,
                    "x"
                );
                liOBJ.appendChild(liName);
                liOBJ.appendChild(liDel);

                var _domCode = suo.domCreate2(
                    "span",
                    { setName: ["className"], setValue: ["item_dir item_edit"] },
                    null,
                    confOBJ[i].note && confOBJ[i].note.value ? "height:18px;line-height:18px;" : null,
                    { setName: ["confid", "actiontype"], setValue: [i, actionType] },
                    suo.ksa.keyFormat(suo.ksa.keyGet(confOBJ[i].codes))
                );
                liOBJ.appendChild(_domCode);

                domOBJ.appendChild(liOBJ);
            }
            return;
        }
        for (var i = 0; i < confOBJ.length; i++) {
            var liOBJ = suo.domCreate2("li", eleOBJ, "", "", {
                setName: ["confid", "actiontype"],
                setValue: [i, actionType ? actionType : type],
            });
            var liName = suo.domCreate2(
                "span",
                { setName: ["className"], setValue: ["item_name item_edit"] },
                null,
                "",
                {
                    setName: ["confid", "actiontype"],
                    setValue: [i, actionType ? actionType : type],
                },
                "txtengine imgengine script".indexOf(type) != -1
                    ? confOBJ[i].name
                    : confOBJ[i].mydes && confOBJ[i].mydes.type && confOBJ[i].mydes.value
                      ? confOBJ[i].mydes.value
                      : suo.getI18n(confOBJ[i].name)
            );
            var liDel = suo.domCreate2(
                "span",
                {
                    setName: ["className", "title"],
                    setValue: ["item_del", suo.getI18n("tip_del")],
                },
                null,
                null,
                null,
                "x"
            );
            liOBJ.appendChild(liName);
            liOBJ.appendChild(liDel);
            if ("txtengine imgengine script pop ctm".indexOf(type) != -1) {
            } else {
                var dirOBJ = "";
                var myDeg = { L: "0deg", U: "90deg", R: "180deg", D: "270deg" };
                var lidir = suo.domCreate2(
                    "span",
                    { setName: ["className"], setValue: ["item_dir item_edit"] },
                    null,
                    confOBJ[i].note && confOBJ[i].note.value ? "height:18px;line-height:18px;" : null
                );
                for (var k = 0; k < confOBJ[i].direct.length; k++) {
                    var _domImg = suo.domCreate2(
                        "img",
                        { setName: ["className"], setValue: ["item_edit"] },
                        null,
                        "-webkit-transform:rotate(" +
                            myDeg[confOBJ[i].direct[k]] +
                            ");" +
                            (confOBJ[i].note && confOBJ[i].note.value ? "height:16px;" : "")
                    );
                    _domImg.src = "../image/direct.png";
                    lidir.appendChild(_domImg);
                }
                liOBJ.appendChild(lidir);
            }
            if (confOBJ[i].note && confOBJ[i].note.value) {
                var _note = suo.domCreate2(
                    "span",
                    { setName: ["className"], setValue: ["item_note item_edit"] },
                    null,
                    null,
                    null,
                    confOBJ[i].note.value
                );
                liOBJ.appendChild(_note);
            }
            domOBJ.appendChild(liOBJ);
        }
    },
    ksa: {
        keyMap: [
            { key: "Esc", code: 27 },
            { key: "F1", code: 112 },
            { key: "F2", code: 113 },
            { key: "F3", code: 114 },
            { key: "F4", code: 115 },
            { key: "F5", code: 116 },
            { key: "F6", code: 117 },
            { key: "F7", code: 118 },
            { key: "F8", code: 119 },
            { key: "F9", code: 120 },
            { key: "F10", code: 121 },
            { key: "F11", code: 122 },
            { key: "F12", code: 123 },
            { key: "Insert", code: 45 },
            { key: "Delete", code: 46 },
            { key: "Home", code: 36 },
            { key: "End", code: 35 },
            { key: "`", code: 192 },
            { key: "1", code: 49 },
            { key: "2", code: 50 },
            { key: "3", code: 51 },
            { key: "4", code: 52 },
            { key: "5", code: 53 },
            { key: "6", code: 54 },
            { key: "7", code: 55 },
            { key: "8", code: 56 },
            { key: "9", code: 57 },
            { key: "0", code: 48 },
            { key: "-", code: 189 },
            { key: "=", code: 187 },
            { key: "Backspace", code: 8 },
            { key: "Tab", code: 9 },
            { key: "Q", code: 81 },
            { key: "W", code: 87 },
            { key: "E", code: 69 },
            { key: "R", code: 82 },
            { key: "T", code: 84 },
            { key: "Y", code: 89 },
            { key: "U", code: 85 },
            { key: "I", code: 73 },
            { key: "O", code: 79 },
            { key: "P", code: 80 },
            { key: "[", code: 219 },
            { key: "]", code: 221 },
            //{key:"\\",code:220},
            { key: "CapsLock", code: 20 },
            { key: "A", code: 65 },
            { key: "S", code: 83 },
            { key: "D", code: 68 },
            { key: "F", code: 70 },
            { key: "G", code: 71 },
            { key: "H", code: 72 },
            { key: "J", code: 74 },
            { key: "K", code: 75 },
            { key: "L", code: 76 },
            { key: ";", code: 186 },
            //{key:"'",code:222},
            { key: "Enter", code: 13 },

            { key: "Z", code: 90 },
            { key: "X", code: 88 },
            { key: "C", code: 67 },
            { key: "V", code: 86 },
            { key: "B", code: 66 },
            { key: "N", code: 78 },
            { key: "M", code: 77 },
            { key: ",", code: 188 },
            { key: ".", code: 190 },
            { key: "/", code: 191 },
            { key: "Space", code: 32 },
            { key: "PageUp", code: 33 },
            { key: "PageDown", code: 34 },
        ],
        keyFormat: key => {
            var _str = "";
            for (var i = 0; i < key.length; i++) {
                _str = (_str ? _str + " " : "") + key[i].toString();
            }
            return _str;
        },
        keyGet: function (code) {
            if (!code) {
                return "";
            }
            code = code.toString();
            var codes = code.split(",");
            var keys = [];
            for (var i = 0; i < codes.length; i++) {
                for (var ii = 0; ii < this.keyMap.length; ii++) {
                    if (this.keyMap[ii].code == codes[i]) {
                        keys.push(this.keyMap[ii].key);
                        break;
                    }
                }
            }
            return keys;
        },
        keyToCode: function (key) {
            if (!key) {
                return "";
            }
            var keys = key.split(" "),
                codes = [];
            for (var i = 0; i < keys.length; i++) {
                for (var ii = 0; ii < this.keyMap.length; ii++) {
                    if (this.keyMap[ii].key == keys[i]) {
                        codes.push(this.keyMap[ii].code);
                        break;
                    }
                }
            }
            return codes;
        },
    },
    dcaKeycus: e => {},
    getDataset2: (e, type) => {
        var ele = e.target || e;
        var getdata = ele => {
            if (ele.dataset[type] == "" || ele.dataset[type]) {
                return ele;
            } else {
                return getdata(ele.parentNode);
            }
        };
        return getdata(ele).dataset[type];
    },
    itemEditDca: e => {},
    itemEditKsa: (e, editType) => {
        const type = editType || "edit";
        if (type == "new") {
        }
        function getDom(ele) {
            ele = ele.target || ele;
            console.log(ele);
            if (!ele.dataset.actiontype) {
                return getDom(ele.parentNode);
            } else {
                return ele;
            }
        }
        const dom = getDom(e);
        const confId = suo.getDataset2(e, "confid"),
            confArray = suo.getDataset2(e, "confobj").split("|"),
            actionType = suo.getDataset2(e, "actiontype");
        console.log(confArray);
        console.log(dom);

        let confOBJ = config;
        for (var i = 0; i < confArray.length; i++) {
            confOBJ = confOBJ[confArray[i]];
        }

        if (type == "edit") {
            confOBJ = confOBJ[confId];
        } else {
            var newOBJ = {};
            if (["txtengine", "imgengine", "script"].contains(actionType)) {
                newOBJ = { name: "none", content: "" };
            } else {
                !editDirect ? (newOBJ = { name: "none" }) : (newOBJ = { name: "none", direct: editDirect });
            }

            confOBJ[confOBJ.length] = newOBJ;
            confOBJ = confOBJ[confOBJ.length - 1];
        }
        console.log(confOBJ);

        let btnArray = ["", suo.getI18n("btn_cancel"), suo.getI18n("btn_save")],
            btnArrayDel = [suo.getI18n("btn_del"), suo.getI18n("btn_cancel"), suo.getI18n("btn_save")];
        if (type == "edit") {
            btnArray = btnArrayDel;
        }
        let domBoxTitle = suo.getI18n(type === "edit" ? "title_editaction" : "title_newaction");
        if (actionType === "txtengine" || actionType === "imgengine") {
            domBoxTitle = suo.getI18n(type === "edit" ? "title_editengine" : "title_newengine");
        } else if (actionType === "script") {
            domBoxTitle = suo.getI18n(type === "edit" ? "title_newscript" : "title_newscript");
        }
        const domBox = suo.initAPPbox(btnArray, [400, 230], domBoxTitle, "bg", actionType);
        domBox.dataset.id = confId;
        domBox.dataset.confid = confId;
        domBox.dataset.confobj = confArray.join("|");
        suo.initPos(domBox);

        //del last id when type=new
        if (type == "new") {
            domBox.dataset.close = "dellast";
        }

        const domContent = domBox.querySelector(".box_content");
        console.log(domContent);

        const domTab = suo.domCreate2("div", {
            setName: ["className"],
            setValue: ["box_tab"],
        });
        domTab.appendChild(
            suo.domCreate2(
                "span",
                {
                    setName: ["className"],
                    setValue: ["box_tabtitle box_tabtitleactive"],
                },
                null,
                null,
                { setName: ["tab"], setValue: ["keys"] },
                suo.getI18n("con_keys")
            )
        );
        domTab.appendChild(
            suo.domCreate2(
                "span",
                { setName: ["className"], setValue: ["box_tabtitle"] },
                null,
                null,
                { setName: ["tab"], setValue: ["action"] },
                suo.getI18n("con_actions")
            )
        );
        domTab.appendChild(
            suo.domCreate2(
                "span",
                { setName: ["className"], setValue: ["box_tabtitle"] },
                null,
                null,
                { setName: ["tab"], setValue: ["more"] },
                suo.getI18n("con_others")
            )
        );
        domContent.appendChild(domTab);

        const domTabbox = suo.domCreate2("div", {
            setName: ["className"],
            setValue: ["box_tabbox"],
        });
        const domTabListKeys = suo.domCreate2(
            "div",
            {
                setName: ["className"],
                setValue: ["box_tablist box_tablistkeys box_tablistactive"],
            },
            null,
            null,
            { setName: ["tab"], setValue: ["keys"] }
        );
        const domTabListAction = suo.domCreate2(
            "div",
            { setName: ["className"], setValue: ["box_tablist box_tablistaction"] },
            null,
            null,
            { setName: ["tab"], setValue: ["action"] }
        );
        const domTabListMore = suo.domCreate2(
            "div",
            { setName: ["className"], setValue: ["box_tablist box_tablistmore"] },
            null,
            null,
            { setName: ["tab"], setValue: ["more"] }
        );
        domTabbox.appendChild(domTabListKeys);
        domTabbox.appendChild(domTabListAction);
        domTabbox.appendChild(domTabListMore);
        domContent.appendChild(domTabbox);

        domTabListKeys.appendChild(suo.itemKey(confOBJ));
        domTabListAction.appendChild(suo.itemAction2(confOBJ, "mges"));
        domTabListAction.appendChild(suo.itemOption(confOBJ, "mges"));
        domTabListMore.appendChild(suo.itemNote(confOBJ, "mges"));
    },
    itemEdit: (confobj, confid, type, direct, actiontype) => {
        console.log(direct);
        console.log(confobj, confid, type, direct, actiontype);
        var type = type ? type : "edit";
        var confArray = confobj.split("|");
        var confOBJ = config;
        for (var i = 0; i < confArray.length; i++) {
            confOBJ = confOBJ[confArray[i]];
        }
        var btnArray = ["", suo.getI18n("btn_cancel"), suo.getI18n("btn_save")];
        var btnArrayDel = [suo.getI18n("btn_del"), suo.getI18n("btn_cancel"), suo.getI18n("btn_save")];
        if (
            type == "edit" &&
            ["mges", "tdrg", "ldrg", "idrg", "pop", "ctm", "txtengine", "imgengine", "script", "touch"].contains(
                actiontype
            )
        ) {
            btnArray = btnArrayDel;
        }
        let domBoxTitle = suo.getI18n(type === "edit" ? "title_editaction" : "title_newaction");
        if (actionType === "txtengine" || actionType === "imgengine") {
            domBoxTitle = suo.getI18n(type === "edit" ? "title_editengine" : "title_newengine");
        } else if (actionType === "script") {
            domBoxTitle = suo.getI18n(type === "edit" ? "title_newscript" : "title_newscript");
        }
        console.log(type);
        var boxOBJ = suo.initAPPbox(btnArray, [400, 230], domBoxTitle, "bg", actiontype);
        boxOBJ.dataset.confobj = confobj;
        boxOBJ.dataset.confid = confid;
        boxOBJ.dataset.close = "";
        var actionType = actiontype || confArray[1];
        if (type == "edit") {
            confOBJ = confOBJ[confid];
        } else {
            var newOBJ = {};
            if (["txtengine", "imgengine", "script"].contains(actionType)) {
                newOBJ = { name: "none", content: "" };
            } else {
                !editDirect ? (newOBJ = { name: "none" }) : (newOBJ = { name: "none", direct: editDirect });
            }
            confOBJ[confOBJ.length] = newOBJ;
            confOBJ = confOBJ[confOBJ.length - 1];
            boxOBJ.dataset.close = "dellast";
        }
        console.log(confOBJ);
        console.log(actiontype);
        var domContent = boxOBJ.querySelector(".box_content");
        direct = direct ? direct : !confOBJ.direct ? "" : confOBJ.direct;
        console.log(direct);
        var actionArray = [
            "mgesactions",
            "tsdrgactions",
            "lsdrgactions",
            "isdrgactions",
            "tdrgactions",
            "ldrgactions",
            "idrgactions",
            "mges",
            "tsdrg",
            "lsdrg",
            "isdrg",
            "tdrg",
            "ldrg",
            "idrg",
            "touch",
        ];

        if (["txtengine", "imgengine", "script"].contains(actionType)) {
            console.log("engines");
            //name
            domContent.appendChild(
                suo.domCreate2(
                    "label",
                    { setName: ["className"], setValue: ["box-label"] },
                    null,
                    null,
                    null,
                    suo.getI18n("con_name")
                )
            );
            domContent.appendChild(
                suo.domCreate2("input", {
                    setName: ["className", "type", "value"],
                    setValue: ["box_text", "text", !confOBJ.name ? "" : confOBJ.name],
                })
            );
            domContent.appendChild(suo.domCreate2("br"));
            //url/script
            domContent.appendChild(
                suo.domCreate2(
                    "label",
                    { setName: ["className"], setValue: ["box-label"] },
                    null,
                    null,
                    null,
                    suo.getI18n("n_content")
                )
            );
            domContent.appendChild(
                suo.domCreate2(
                    "textarea",
                    {
                        setName: ["className", "type", "value"],
                        setValue: ["box-textarea", "textarea", !confOBJ.content ? "" : confOBJ.content],
                    },
                    "",
                    "width:330px;height:160px;margin-top:10px;"
                )
            );
            var domDes = boxOBJ.querySelector(".box_des");
            domDes.style.cssText += "display:block;";
            if (actionType == "script") {
                domDes
                    //.querySelector("ul")
                    .appendChild(suo.domCreate2("div", "", null, null, null, suo.getI18n("n_content_script")));
            } else {
                domDes
                    //.querySelector("ul")
                    .appendChild(suo.domCreate2("div", "", null, null, null, suo.getI18n("n_content_search_engine")));
            }
        } else if (actionArray.contains(actionType)) {
            var actionBox = suo.domCreate2("div", {
                setName: ["className"],
                setValue: ["actionbox"],
            });
            var actionType = actionType;
            var actionName = confOBJ.name;

            actionBox.appendChild(suo.itemAction(confOBJ, actionType));
            actionBox.appendChild(suo.itemDes(confOBJ));
            actionBox.appendChild(suo.itemMore(confOBJ, actiontype));
            domContent.appendChild(actionBox);

            var _rightbox = suo.domCreate2("div", {
                setName: ["className"],
                setValue: ["otherbox"],
            });

            console.log(confOBJ);
            var lineBox = suo.domCreate2("div", {
                setName: ["className"],
                setValue: ["linebox"],
            });
            lineBox.appendChild(suo.itemDirect(confOBJ, actiontype, direct));
            _rightbox.appendChild(lineBox);

            var noteBox = suo.domCreate2("div", {
                setName: ["className"],
                setValue: ["notebox"],
            });
            noteBox.appendChild(suo.itemNote(confOBJ, actionType));
            _rightbox.appendChild(noteBox);

            domContent.appendChild(_rightbox);
            domContent.appendChild(suo.domCreate2("div", "", "", "clear:both;"));
        } else if ([/*"tsdrg",*/ "lsdrg", "isdrg"].contains(actionType)) {
            var actionBox = suo.domCreate2("div", {
                setName: ["className"],
                setValue: ["actionbox"],
            });
            var actionType = actionType;
            var actionName = confOBJ.name;
            actionBox.appendChild(suo.itemAction(confOBJ, actionType));
            actionBox.appendChild(suo.itemDes(confOBJ));
            actionBox.appendChild(suo.itemMore(confOBJ, actiontype));
            domContent.appendChild(actionBox);
            domContent.appendChild(suo.domCreate2("div", "", "", "clear:both;"));
        } else if (
            actionType == "rges" ||
            actionType == "wges" ||
            actionType == "pop" ||
            actionType == "icon" ||
            actionType == "ctm" ||
            actionType == "dca"
        ) {
            var actionBox = suo.domCreate2("div", {
                setName: ["className"],
                setValue: ["actionbox"],
            });
            var actionType = actionType;
            var actionName = confOBJ.name;
            actionBox.appendChild(suo.itemAction(confOBJ, actionType));
            actionBox.appendChild(suo.itemDes(confOBJ));
            actionBox.appendChild(suo.itemMore(confOBJ, actiontype));
            domContent.appendChild(actionBox);
            domContent.appendChild(suo.domCreate2("div", "", "", "clear:both;"));
        }
        //document.body.appendChild(boxOBJ);
        suo.initPos(boxOBJ);
    },
    initPos: dom => {
        document.body.appendChild(dom);
        var _height = window.getComputedStyle(dom).height,
            _width = window.getComputedStyle(dom).width;
        _height = Number.parseInt(_height.substr(0, _height.length - 2));
        _width = Number.parseInt(_width.substr(0, _width.length - 2));
        dom.style.cssText += "left:" + (window.innerWidth - _width) / 2 + "px;";
        var boxBGOBJ = document.documentElement.appendChild(
            suo.domCreate2("div", { setName: ["className"], setValue: ["box_bg"] })
        );
        window.setTimeout(() => {
            dom.style.cssText += "opacity:.98;top:" + (window.innerHeight - _height) / 2 + "px;";
            boxBGOBJ ? (boxBGOBJ.style.cssText += "opacity:.8;") : null;
        }, 200);
    },
    tabSwitch: e => {
        console.log("tabSwitch");
        const dom = suo.getAPPboxEle(e);
        const tabId = e.target.dataset.tab;
        const domTabs = dom.querySelectorAll(".box_tab>.box_tabtitle"),
            domLists = dom.querySelectorAll(".box_tabbox>.box_tablist");
        console.log(domTabs);
        for (var i = 0; i < domTabs.length; i++) {
            if (domTabs[i].dataset.tab == tabId) {
                domTabs[i].classList.add("box_tabtitleactive");
            } else {
                domTabs[i].classList.remove("box_tabtitleactive");
            }
        }
        for (var i = 0; i < domLists.length; i++) {
            if (domLists[i].dataset.tab == tabId) {
                domLists[i].classList.add("box_tablistactive");
            } else {
                domLists[i].classList.remove("box_tablistactive");
            }
        }
    },
    itemKey: confOBJ => {
        console.log("key");
        console.log(confOBJ);
        const dom = suo.domCreate2("div", {
                setName: ["className"],
                setValue: ["box_key"],
            }),
            _str =
                "<input id='box_ctrl' type='checkbox'" +
                (confOBJ.ctrl ? "checked" : "") +
                "><label for='box_ctrl'>Ctrl</label>" +
                "<input id='box_alt' type='checkbox'" +
                (confOBJ.alt ? "checked" : "") +
                "><label for='box_alt'>Alt</label>" +
                "<input id='box_shift' type='checkbox'" +
                (confOBJ.shift ? "checked" : "") +
                "><label for='box_shift'>Shift</label>",
            _resetBtn = suo.domCreate2(
                "input",
                {
                    setName: ["className", "type", "value"],
                    setValue: ["box_btnkeyrst", "button", suo.getI18n("btn_reset")],
                },
                null,
                null,
                null
            );
        metabox = suo.domCreate2("div", null, _str, "padding:3px 0;");
        codebox = suo.domCreate2("input", {
            setName: ["type", "value", "className", "readonly", "placeholder", "title"],
            setValue: [
                "text",
                suo.ksa.keyFormat(suo.ksa.keyGet(confOBJ.codes)),
                "box_keyvalue",
                "",
                suo.getI18n("tip_enterkeys"),
                suo.getI18n("tip_enterkeys"),
            ],
        });

        dom.appendChild(codebox);
        dom.appendChild(_resetBtn);
        dom.appendChild(metabox);
        return dom;
    },
    itemNote: (confOBJ, type) => {
        var dom = suo.domCreate2("div");
        var notevalue = confOBJ.note ? confOBJ.note.value : "";
        var notetype = confOBJ.note ? confOBJ.note.type : true;
        const _span = suo.domCreate2("span", null, null, null, null, suo.getI18n("con_notename")),
            _brSpan = suo.domCreate2("br"),
            _textarea = suo.domCreate2(
                "textarea",
                { setName: ["className"], setValue: ["box_notevalue"] },
                null,
                null,
                null,
                notevalue
            ),
            _brTextarea = suo.domCreate2("br"),
            _check = suo.domCreate2("input", {
                setName: ["id", "type", "checked"],
                setValue: ["box_note", "checkbox", notetype ? true : false],
            }),
            _label = suo.domCreate2(
                "label",
                { setName: ["for"], setValue: ["box_note"] },
                null,
                null,
                null,
                suo.getI18n("con_notechk")
            );
        dom.appendChild(_span);
        dom.appendChild(_brSpan);
        dom.appendChild(_textarea);
        dom.appendChild(_brTextarea);
        dom.appendChild(_check);
        dom.appendChild(_label);
        if (["tsdrg", "lsdrg", "isdrg"].contains(type)) {
            _check.style.display = "none";
            _label.style.display = "none";
        }
        return dom;
    },
    itemDirect: (confOBJ, actiontype, direct) => {
        console.log(confOBJ);
        var direct = direct ? direct : confOBJ.direct;
        var OBJ = suo.domCreate2("div", { setName: ["className"], setValue: ["box_direct"] }, "", "", {
            setName: ["direct"],
            setValue: [direct],
        });
        //edit icon
        var actionArray = [
            "mgesactions",
            "tdrgactions",
            "ldrgactions",
            "idrgactions",
            "mges",
            "touch",
            "tdrg",
            "idrg",
            "ldrg",
        ];
        if (actionArray.contains(actiontype)) {
            var editOBJ = suo.domCreate2("img", {
                setName: ["className", "title", "src"],
                setValue: ["box_diredit", suo.getI18n("tip_editdir"), "../image/edit.svg"],
            });
            OBJ.appendChild(editOBJ);
        }
        //direct icon
        if (direct) {
            var myDeg = {
                L: "0deg",
                l: "45deg",
                U: "90deg",
                u: "135deg",
                R: "180deg",
                r: "225deg",
                D: "270deg",
                d: "315deg",
            };
            for (var i = 0; i < direct.length; i++) {
                var dirimg = suo.domCreate2(
                    "img",
                    {
                        setName: ["className", "src"],
                        setValue: ["boxdirectimg", "../image/direct.png"],
                    },
                    "",
                    "/*background-color:#000;*/-webkit-transform:rotate(+" + myDeg[direct[i]] + ")"
                );
                if (["l", "u", "r", "d"].contains(direct)) {
                    var dirbox = suo.domCreate2("div", {
                        setName: ["className"],
                        setValue: ["dirbox"],
                    });
                    dirbox.appendChild(dirimg);
                    OBJ.appendChild(dirbox);
                } else {
                    OBJ.appendChild(dirimg);
                }
            }
        }
        return OBJ;
    },
    itemAction: (confOBJ, actionType) => {
        console.log(actions);
        console.log("actionType:" + actionType + ";actionValue:" + confOBJ.name);
        var valueOBJ = {
            setName: ["name", "className"],
            setValue: [actionType, "box_select actionselect"],
        };
        var domSelect = suo.domCreate2("select", valueOBJ, null, null, {
            setName: ["actiontype"],
            setValue: [actionType],
        });
        var flag = 0,
            index = 0;
        if ("tsdrg lsdrg isdrg".indexOf(actionType) != -1) {
            actionType = actionType.substr(0, 1) + actionType.substr(2);
        } else if (
            actionType == "rges" ||
            actionType == "wges" ||
            actionType == "pop" ||
            actionType == "icon" ||
            actionType == "ctm" ||
            actionType == "dca"
        ) {
            actionType = "mges";
        }
        for (var i = 0; i < actions[actionType + "_group"].length; i++) {
            var domOptgroup = suo.domCreate2("optgroup", {
                setName: ["label"],
                setValue: [suo.getI18n(actions[actionType + "_group"][i])],
            });
            for (var j = 0; j < actions[actionType][i].length; j++) {
                var domOption = suo.domCreate2(
                    "option",
                    { setName: ["value"], setValue: [actions[actionType][i][j]["name"]] },
                    null,
                    null,
                    null,
                    suo.getI18n(actions[actionType][i][j]["name"])
                );
                domOptgroup.appendChild(domOption);
                if (confOBJ.name == actions[actionType][i][j]["name"]) {
                    index = flag;
                }
                flag += 1;
            }
            domSelect.appendChild(domOptgroup);
        }
        domSelect.selectedIndex = index;
        return domSelect;
    },
    itemAction2: (confOBJ, actionType) => {
        const dom = suo.domCreate2("div", {
            setName: ["className"],
            setValue: ["box_action"],
        });

        var valueOBJ = {
            setName: ["name", "className"],
            setValue: [actionType, "box_select actionselect"],
        };
        var domSelect = suo.domCreate2("select", valueOBJ, null, null, {
            setName: ["actiontype"],
            setValue: [actionType],
        });
        var flag = 0,
            index = 0;
        if ("tsdrg lsdrg isdrg".indexOf(actionType) != -1) {
            actionType = actionType.substr(0, 1) + actionType.substr(2);
        } else if (
            actionType == "rges" ||
            actionType == "wges" ||
            actionType == "pop" ||
            actionType == "icon" ||
            actionType == "ctm" ||
            actionType == "dca"
        ) {
            actionType = "mges";
        }
        for (var i = 0; i < actions[actionType + "_group"].length; i++) {
            var domOptgroup = suo.domCreate2("optgroup", {
                setName: ["label"],
                setValue: [suo.getI18n(actions[actionType + "_group"][i])],
            });
            for (var j = 0; j < actions[actionType][i].length; j++) {
                var domOption = suo.domCreate2(
                    "option",
                    { setName: ["value"], setValue: [actions[actionType][i][j]["name"]] },
                    null,
                    null,
                    null,
                    suo.getI18n(actions[actionType][i][j]["name"])
                );
                domOptgroup.appendChild(domOption);
                if (confOBJ.name == actions[actionType][i][j]["name"]) {
                    index = flag;
                }
                flag += 1;
            }
            domSelect.appendChild(domOptgroup);
        }
        domSelect.selectedIndex = index;

        dom.appendChild(domSelect);
        return dom;
    },
    itemOption: (confOBJ, actionType) => {
        // fix new added options of actions dont show and delete droped options.
        var conf = JSON.parse(JSON.stringify(confOBJ));
        for (var i = 0; i < actions[actionType].length; i++) {
            for (var ii = 0; ii < actions[actionType][i].length; ii++) {
                if (actions[actionType][i][ii].name == conf.name) {
                    var arrayConfType = ["selects", "texts", "checks", "ranges", "radios"];
                    for (var act in arrayConfType) {
                        if (actions[actionType][i][ii][arrayConfType[act]]) {
                            var _arrayConf = [],
                                _arrayModel = [];
                            for (var jj = 0; conf[arrayConfType[act]] && jj < conf[arrayConfType[act]].length; jj++) {
                                _arrayConf.push(conf[arrayConfType[act]][jj].type);
                            }

                            for (var jj = 0; jj < actions[actionType][i][ii][arrayConfType[act]].length; jj++) {
                                _arrayModel.push(actions[actionType][i][ii][arrayConfType[act]][jj]);
                            }

                            for (var j = 0; j < actions[actionType][i][ii][arrayConfType[act]].length; j++) {
                                if (conf[arrayConfType[act]]) {
                                    if (!_arrayConf.contains(actions[actionType][i][ii][arrayConfType[act]][j])) {
                                        conf[arrayConfType[act]].push({
                                            type: actions[actionType][i][ii][arrayConfType[act]][j],
                                        });
                                    }
                                } else {
                                    if (!conf[arrayConfType[act]]) {
                                        conf[arrayConfType[act]] = [];
                                    }
                                    conf[arrayConfType[act]].push({
                                        type: actions[actionType][i][ii][arrayConfType[act]][j],
                                    });
                                }
                            }

                            for (var j = 0; conf[arrayConfType[act]] && j < conf[arrayConfType[act]].length; j++) {
                                if (!_arrayModel.contains(conf[arrayConfType[act]][j].type)) {
                                    conf[arrayConfType[act]].splice(j, 1);
                                }
                            }
                        } else {
                            delete conf[arrayConfType[act]];
                        }
                    }
                    break;
                }
            }
        }
        console.log(conf);

        var dom = suo.domCreate2("div", {
            setName: ["className"],
            setValue: ["box_option box_more"],
        });

        var domDes = suo.domCreate2("div", {
            setName: ["className"],
            setValue: ["box_desbox"],
        });
        var checkbox = suo.domCreate2("input", {
            setName: ["id", "className", "type"],
            setValue: ["box_mydes", "box_desck", "checkbox"],
        });
        checkbox.checked = conf.mydes ? conf.mydes.type : false;
        var checklabel = suo.domCreate2("label", "", null, null, null, suo.getI18n("tip_actionname"));
        var destext = suo.domCreate2("input", {
            setName: ["id", "className", "type", "value"],
            setValue: ["mydestext", "box_destext", "text", conf.mydes ? conf.mydes.value : ""],
        });
        if (!conf.mydes || !conf.mydes.type) {
            destext.style.display = "none";
        }
        checklabel.setAttribute("for", "box_mydes");
        domDes.appendChild(checkbox);
        domDes.appendChild(checklabel);
        domDes.appendChild(suo.domCreate2("br"));
        domDes.appendChild(destext);
        dom.appendChild(domDes);

        if (conf.texts) {
            for (var i = 0; i < conf.texts.length; i++) {
                if (conf.texts[i].type == "n_mail_domain") {
                    var _css, _class;
                    console.log(conf.selects[0].value);
                    if (conf.selects[0].value == "s_gmailapps") {
                        _css = "display:inline-block;";
                        _class = "confix confix-no";
                    } else {
                        _css = "display:none;";
                        _class = "confix confix-yes";
                    }
                    var domText = suo.createMoreText(conf.texts[i]);
                    domText.className = _class;
                    domText.style.cssText += _css;
                    dom.appendChild(domText);
                    continue;
                }
                dom.appendChild(suo.createMoreText(conf.texts[i]));
            }
        }
        if (conf.selects) {
            for (var i = 0; i < conf.selects.length; i++) {
                dom.appendChild(
                    suo.domCreate2(
                        "label",
                        { setName: ["className"], setValue: ["boxlabel"] },
                        null,
                        null,
                        null,
                        suo.getI18n(conf.selects[i].type)
                    )
                );
                dom.appendChild(suo.createMoreSelect(conf.selects[i].type, conf.selects[i].value, conf));
                dom.appendChild(suo.domCreate2("br"));
            }
        }
        if (conf.ranges) {
            console.log("range");
            for (var i = 0; i < conf.ranges.length; i++) {
                dom.appendChild(suo.createMoreRange(conf.ranges[i]));
            }
        }
        if (conf.checks) {
            for (var i = 0; i < conf.checks.length; i++) {
                dom.appendChild(suo.createMoreCheck(conf.checks[i]));
            }
        }
        if (conf.radios) {
            for (var i = 0; i < conf.radios.length; i++) {
                dom.appendChild(suo.createMoreRadio(conf.radios[i]));
            }
        }
        return dom;
    },
    itemMore: (confOBJ, actionType) => {
        console.log(confOBJ);
        console.log(actionType);
        var conf = JSON.parse(JSON.stringify(confOBJ));

        // fix new added options of actions dont show and delete droped options.
        for (var i = 0; i < actions[actionType].length; i++) {
            for (var ii = 0; ii < actions[actionType][i].length; ii++) {
                if (actions[actionType][i][ii].name == conf.name) {
                    var arrayConfType = ["selects", "texts", "checks", "ranges", "radios"];
                    for (var act in arrayConfType) {
                        if (actions[actionType][i][ii][arrayConfType[act]]) {
                            var _arrayConf = [],
                                _arrayModel = [];
                            for (var jj = 0; conf[arrayConfType[act]] && jj < conf[arrayConfType[act]].length; jj++) {
                                _arrayConf.push(conf[arrayConfType[act]][jj].type);
                            }

                            for (var jj = 0; jj < actions[actionType][i][ii][arrayConfType[act]].length; jj++) {
                                _arrayModel.push(actions[actionType][i][ii][arrayConfType[act]][jj]);
                            }

                            for (var j = 0; j < actions[actionType][i][ii][arrayConfType[act]].length; j++) {
                                if (conf[arrayConfType[act]]) {
                                    if (!_arrayConf.contains(actions[actionType][i][ii][arrayConfType[act]][j])) {
                                        conf[arrayConfType[act]].push({
                                            type: actions[actionType][i][ii][arrayConfType[act]][j],
                                        });
                                    }
                                } else {
                                    if (!conf[arrayConfType[act]]) {
                                        conf[arrayConfType[act]] = [];
                                    }
                                    conf[arrayConfType[act]].push({
                                        type: actions[actionType][i][ii][arrayConfType[act]][j],
                                    });
                                }
                            }

                            console.log(_arrayModel);
                            for (var j = 0; conf[arrayConfType[act]] && j < conf[arrayConfType[act]].length; j++) {
                                if (!_arrayModel.contains(conf[arrayConfType[act]][j].type)) {
                                    conf[arrayConfType[act]].splice(j, 1);
                                }
                            }
                        } else {
                            delete conf[arrayConfType[act]];
                        }
                    }
                    break;
                }
            }
        }

        console.log(conf);

        var domMore = suo.domCreate2("div", {
            setName: ["className"],
            setValue: ["box_more"],
        });
        if (conf.texts) {
            for (var i = 0; i < confOBJ.texts.length; i++) {
                if (confOBJ.texts[i].type == "n_mail_domain") {
                    var _css, _class;
                    console.log(confOBJ.selects[0].value);
                    if (confOBJ.selects[0].value == "s_gmailapps") {
                        _css = "display:inline-block;";
                        _class = "confix confix-no";
                    } else {
                        _css = "display:none;";
                        _class = "confix confix-yes";
                    }
                    var domText = suo.createMoreText(confOBJ.texts[i]);
                    domText.className = _class;
                    domText.style.cssText += _css;
                    domMore.appendChild(domText);
                    continue;
                }
                domMore.appendChild(suo.createMoreText(confOBJ.texts[i]));
            }
        }
        if (conf.selects) {
            for (var i = 0; i < conf.selects.length; i++) {
                domMore.appendChild(
                    suo.domCreate2(
                        "label",
                        { setName: ["className"], setValue: ["boxlabel"] },
                        null,
                        null,
                        null,
                        suo.getI18n(conf.selects[i].type)
                    )
                );
                domMore.appendChild(suo.createMoreSelect(conf.selects[i].type, conf.selects[i].value, conf));
                domMore.appendChild(suo.domCreate2("br"));
            }
        }
        if (conf.ranges) {
            console.log("range");
            console.log(conf);
            for (var i = 0; i < conf.ranges.length; i++) {
                domMore.appendChild(suo.createMoreRange(conf.ranges[i]));
            }
        }
        if (conf.checks) {
            console.log(conf.checks);
            for (var i = 0; i < conf.checks.length; i++) {
                console.log("%c" + conf.checks[i].type, "color:green;font-size:16px;");
                console.log(actionOptions.checks[conf.checks[i].type]);
                if (actionOptions.checks[conf.checks[i].type] != undefined) {
                    console.log("%c" + conf.checks[i].type, "color:blue;font-size:16px;");
                    domMore.appendChild(suo.createMoreCheck(conf.checks[i]));
                } else {
                    console.log(conf.checks[i].type);
                    conf.checks.splice(i, 1);
                }
            }
        }
        if (conf.radios) {
            for (var i = 0; i < conf.radios.length; i++) {
                domMore.appendChild(suo.createMoreRadio(conf.radios[i]));
            }
        }
        return domMore;
    },
    itemDes: confOBJ => {
        var desbox = suo.domCreate2("div", {
            setName: ["className"],
            setValue: ["box_desbox"],
        });
        var spacelabel = suo.domCreate2("label", { setName: ["className"], setValue: ["boxlabel"] }, "");
        var spacelabel2 = suo.domCreate2("label", { setName: ["className"], setValue: ["boxlabel"] }, "");
        var checkbox = suo.domCreate2("input", {
            setName: ["id", "className", "type"],
            setValue: ["box_mydes", "box_desck", "checkbox"],
        });
        checkbox.checked = confOBJ.mydes ? confOBJ.mydes.type : false;
        var checklabel = suo.domCreate2("label", "", null, null, null, suo.getI18n("tip_actionname"));
        var destext = suo.domCreate2("input", {
            setName: ["id", "className", "type", "value"],
            setValue: ["mydestext", "box_destext", "text", confOBJ.mydes ? confOBJ.mydes.value : ""],
        });
        if (!confOBJ.mydes || !confOBJ.mydes.type) {
            destext.style.display = "none";
        }

        checklabel.setAttribute("for", "box_mydes");
        desbox.appendChild(checkbox);
        desbox.appendChild(checklabel);
        desbox.appendChild(suo.domCreate2("br"));
        desbox.appendChild(destext);
        return desbox;
    },
    itemSave: e => {
        var ele = e.target;
        var dom = suo.getDataset(ele, "confobj", "ele");
        var confArray = suo.getDataset(ele, "confobj", "value").split("|");
        var confid = suo.getDataset(ele, "confid", "value");
        var confOBJ = config;
        for (var i = 0; i < confArray.length; i++) {
            confOBJ = confOBJ[confArray[i]];
        }
        confOBJ = confOBJ[confid];
        console.log(confOBJ);

        //fix blank
        var fixText = dom.querySelectorAll("input[type=text]"),
            fixTextarea = dom.querySelectorAll("textarea");
        for (var i = 0; i < fixText.length; i++) {
            if (!fixText[i].classList.contains("box_destext")) {
                if (
                    fixText[i].parentNode.classList.contains("confix") &&
                    fixText[i].parentNode.classList.contains("confix-yes")
                ) {
                } else if (!fixText[i].value) {
                    suo.showMsgBox(suo.getI18n("msg_blank"), "warning", 5, 1000);
                    console.log("error");
                    return;
                }
            }
        }
        for (var i = 0; i < fixTextarea.length; i++) {
            if (!fixTextarea[i].value && !fixTextarea[i].classList.contains("box_notevalue")) {
                console.log("blank");
                suo.showMsgBox(suo.getI18n("msg_blank"), "warning", 5, 1000);
                return;
            }
        }
        if (confArray[1] == "engine") {
            var _name = dom.querySelectorAll(".box_content input[type=text]")[0].value;
            var _content = suo.fixURL(dom.querySelector(".box_content textarea").value);
            confOBJ.name = _name;
            confOBJ.content = _content;
        } else if (confArray[1] == "script") {
            var _name = dom.querySelectorAll(".box_content input[type=text]")[0].value;
            var _content = dom.querySelector(".box_content textarea").value;
            confOBJ.name = _name;
            confOBJ.content = _content;
            //if new script , add to jslist's enabled array.
            if (
                config.apps &&
                config.apps.jslist &&
                config.apps.jslist.enabled &&
                !config.apps.jslist.enabled.contains(confid.toString())
            ) {
                config.apps.jslist.enabled.push(confid.toString());
            }
        } else {
            var theAction = dom.querySelector(".box_content .actionselect").value;

            //name
            confOBJ.name = theAction;

            //direct
            confOBJ.direct = dom.querySelector(".box_direct")
                ? dom.querySelector(".box_direct").dataset.direct
                : confOBJ.direct;
            !confOBJ.direct ? delete confOBJ.direct : null;

            //mydes
            var theDes = {};
            theDes.type = dom.querySelector(".box_content .box_desck").checked;
            theDes.value = dom.querySelector(".box_content .box_destext").value;
            if (theDes.value) {
                confOBJ.mydes = theDes;
            } else {
                confOBJ.mydes ? delete confOBJ.mydes : null;
            }

            //note
            var domNote = dom.querySelector(".box_content #box_note");
            if (domNote) {
                var theNote = {};
                theNote.type = dom.querySelector(".box_content #box_note").checked;
                theNote.value = dom.querySelector(".box_content .box_notevalue").value;
                if (theNote.value) {
                    confOBJ.note = theNote;
                } else {
                    confOBJ.note ? delete confOBJ.note : null;
                }
            }

            //selects
            var theSelects = [];
            var selectsOBJ = dom.querySelectorAll(".box_more select.box_select");
            for (var i = 0; i < selectsOBJ.length; i++) {
                var thisOBJ = {};
                thisOBJ.type = selectsOBJ[i].name;
                thisOBJ.type.indexOf("search") != -1 || thisOBJ.type.indexOf("script") != -1
                    ? (thisOBJ.value = selectsOBJ[i].selectedIndex)
                    : (thisOBJ.value = selectsOBJ[i].value);
                theSelects.push(thisOBJ);
            }
            if (theSelects.length > 0) {
                confOBJ.selects = theSelects;
            } else {
                confOBJ.selects ? delete confOBJ.selects : null;
            }

            //texts
            var theTexts = [];
            var textsOBJ = dom.querySelectorAll(".box_more input.box_text");
            for (var i = 0; i < textsOBJ.length; i++) {
                var thisOBJ = {};
                thisOBJ.type = textsOBJ[i].name;
                if (thisOBJ.type == "n_url") {
                    thisOBJ.value = suo.fixURL(textsOBJ[i].value);
                } else {
                    thisOBJ.value = textsOBJ[i].value;
                }
                theTexts.push(thisOBJ);
            }
            if (theTexts.length > 0) {
                confOBJ.texts = theTexts;
            } else {
                confOBJ.texts ? delete confOBJ.texts : null;
            }

            //checks
            var theChecks = [];
            var checksOBJ = dom.querySelectorAll(".box_more .box_check[type=checkbox]");
            for (var i = 0; i < checksOBJ.length; i++) {
                var _confobj = {};
                _confobj.type = checksOBJ[i].name;
                _confobj.value = checksOBJ[i].checked;
                var _checkList = checksOBJ[i].parentNode.querySelector(".box_checklist");

                if (_confobj.value && _checkList) {
                    if (_checkList.querySelector("input[type=radio]")) {
                        // check with radio
                        _confobj.typeCheck = "radio";
                        _confobj.valueOption = _checkList.querySelector("input[type=radio]:checked").value;
                        var _radioList = _checkList
                            .querySelector("input[type=radio]:checked")
                            .parentNode.querySelector(".box_radiolist");
                        if (_radioList) {
                            if (_radioList.querySelector("select")) {
                                _confobj.valueSetting = _radioList.querySelector("select").value;
                            } else {
                                _confobj.valueSetting = _radioList.querySelector("input").value;
                            }
                        }
                    } else if (_checkList.querySelector("select")) {
                        // check with select
                        _confobj.typeCheck = "select";
                        _confobj.valueOption = _checkList.querySelector("select").value;
                    } else if (_checkList.querySelector("input")) {
                        // check with text/range
                        _confobj.typeCheck = _checkList.querySelector("input").type;
                        _confobj.valueOption = _checkList.querySelector("input").value;
                    }
                }
                console.log(_confobj);
                theChecks.push(_confobj);
            }
            if (theChecks.length > 0) {
                confOBJ.checks = theChecks;
            } else {
                confOBJ.checks ? delete confOBJ.checks : null;
            }

            //ranges
            var theRanges = [];
            var rangesOBJ = dom.querySelectorAll(".box_optionlist>input[type=range]");
            for (var i = 0; i < rangesOBJ.length; i++) {
                var thisOBJ = {};
                thisOBJ.type = rangesOBJ[i].name;
                thisOBJ.value = rangesOBJ[i].value;
                theRanges.push(thisOBJ);
            }
            if (theRanges.length > 0) {
                confOBJ.ranges = theRanges;
            } else {
                confOBJ.ranges ? delete confOBJ.ranges : null;
            }

            //keys
            var theCodes = [],
                codesOBJ = dom.querySelector(".box_keyvalue");
            codesOBJ ? (theCodes = suo.ksa.keyToCode(codesOBJ.value)) : null;
            if (theCodes.length > 0) {
                confOBJ.codes = theCodes;
            } else {
                confOBJ.codes ? delete confOBJ.codes : null;
            }

            var codeCtrlOBJ = dom.querySelector(".box_key #box_ctrl"),
                codeAltOBJ = dom.querySelector(".box_key #box_alt"),
                codeShiftOBJ = dom.querySelector(".box_key #box_shift");
            codeCtrlOBJ ? (confOBJ.ctrl = codeCtrlOBJ.checked) : null;
            codeAltOBJ ? (confOBJ.alt = codeAltOBJ.checked) : null;
            codeShiftOBJ ? (confOBJ.shift = codeShiftOBJ.checked) : null;

            // radio
            var theRadios = [],
                radiosOBJ = dom.querySelectorAll(".box_radio");
            for (var i = 0; i < radiosOBJ.length; i++) {
                var _checkRadio = radiosOBJ[i].querySelector("input.box_radiooption[type=radio]:checked");
                var _confobj = {};
                _confobj.type = _checkRadio.name;
                _confobj.value = _checkRadio.value;
                var _radioList = _checkRadio.parentNode.querySelector(".box_radiolist");

                if (_confobj.value && _radioList) {
                    if (_radioList.querySelector("select")) {
                        // radio with select
                        _confobj.typeRadio = "select";
                        _confobj.valueSetting = _radioList.querySelector("select").value;
                    } else if (_radioList.querySelector("input")) {
                        // radio with text/range
                        _confobj.typeRadio = _radioList.querySelector("input").type;
                        _confobj.valueSetting = _radioList.querySelector("input").value;
                    }
                }
                theRadios.push(_confobj);
            }
            if (theRadios.length > 0) {
                confOBJ.radios = theRadios;
            } else {
                confOBJ.radios ? delete confOBJ.radios : null;
            }
            console.log(confOBJ);
        }
        suo.saveConf();
        suo.initActionEle();
        editMode = false;
        console.log(confArray);
        var actionType = suo.getDataset(e, "actiontype", "value");
        if (actionType) {
            console.log(actionType);
            suo.initListItem(actionType);
            suo.boxClose2(e);
            return;
        }
        if (!["tdrg", "idrg", "ldrg", "mges", "tsdrg", "lsdrg", "isdrg"].contains(confArray[1])) {
            suo.initListItem(confArray[2]);
        } else {
            suo.initListItem(confArray[1]);
        }
        suo.boxClose2(e);
    },
    domShow: (ele, time) => {
        var time = time ? time : 0.4;
        ele.style.cssText += "display:block;z-index:1;opacity:0;";
        window.setTimeout(() => {
            ele.style.cssText += "transition:all " + time + "s ease-in-out;opacity:1;";
        }, 10);
        window.setTimeout(() => {
            ele.style.cssText += "transition:none;";
        }, time * 1000);
    },
    domHide: (ele, time) => {
        var time = time ? time : 0.4;
        ele.style.cssText += "transition:all " + time + "s ease-in-out;";
        window.setTimeout(() => {
            ele.style.cssText += "opacity:0;";
        }, 10);
        window.setTimeout(() => {
            ele.style.cssText += "display:none;transition:none;";
        }, time * 1000);
    },
    boxClose2: (e, type) => {
        console.log("boxClose2");
        editMode = false;
        var domBoxBG = document.querySelector(".box_bg");
        var theEle = suo.getAPPboxEle(e);
        var closeArray = theEle.dataset.close ? theEle.dataset.close.split("|") : [];
        domBoxBG ? (domBoxBG.style.cssText += "transition:all .4s ease-in-out;opacity:0;") : null;
        theEle.style.cssText += "transition:all .4s ease-in-out;top:0;opacity:0;";
        if (closeArray.contains("dellast") && type == "cancel") {
            var confArray = theEle.dataset.confobj.split("|");
            var confOBJ = config;
            for (var i = 0; i < confArray.length; i++) {
                confOBJ = confOBJ[confArray[i]];
            }
            confOBJ.length = confOBJ.length - 1;
        }
        if (closeArray.contains("resetdirect")) {
            editDirect = "";
        }
        window.setTimeout(() => {
            domBoxBG ? domBoxBG.remove() : null;
            theEle.remove();
        }, 400);
    },
    actionChange2: e => {
        var ele = e.target;
        var getdata = ele => {
            if (ele.dataset.confobj) {
                return ele.dataset.confobj;
            } else {
                return getdata(ele.parentNode);
            }
        };
        var getele = ele => {
            if (ele.tagName.toLowerCase() == "smartup" && ele.classList.contains("su_apps")) {
                return ele;
            } else {
                return getele(ele.parentNode);
            }
        };
        var boxdom = getele(ele);
        var confArray = getdata(ele).split("|");
        var confOBJ = config;
        for (var i = 0; i < confArray.length; i++) {
            confOBJ = confOBJ[confArray[i]];
        }

        var theOBJ = {};
        theOBJ.mydes = { type: false, value: "" };
        theOBJ.selects = [];
        theOBJ.texts = [];
        theOBJ.checks = [];
        theOBJ.name = e.target.options[e.target.selectedIndex].value;
        console.log(theOBJ.name);
        if (e.target.dataset.actiontype) {
            actionType = e.target.dataset.actiontype;
        } else {
            var actionType = confArray[confArray.length - 1];
        }
        if ("tsdrg lsdrg isdrg".indexOf(actionType) != -1) {
            actionType = actionType.substr(0, 1) + actionType.substr(2);
        } else if (
            actionType == "rges" ||
            actionType == "wges" ||
            actionType == "pop" ||
            actionType == "icon" ||
            actionType == "ctm"
        ) {
            actionType = "mges";
        }
        console.log(actionType);

        for (var i = 0; i < actions[actionType].length; i++) {
            for (var ii = 0; ii < actions[actionType][i].length; ii++) {
                if (actions[actionType][i][ii].name == e.target.options[e.target.selectedIndex].value) {
                    if (actions[actionType][i][ii].selects) {
                        for (var j = 0; j < actions[actionType][i][ii].selects.length; j++) {
                            if (!theOBJ.selects) {
                                theOBJ.selects = [];
                            }
                            theOBJ.selects.push({
                                type: actions[actionType][i][ii].selects[j],
                            });
                        }
                    }
                    if (actions[actionType][i][ii].texts) {
                        for (var j = 0; j < actions[actionType][i][ii].texts.length; j++) {
                            if (!theOBJ.texts) {
                                theOBJ.texts = [];
                            }
                            theOBJ.texts.push({ type: actions[actionType][i][ii].texts[j] });
                        }
                    }
                    if (actions[actionType][i][ii].checks) {
                        for (var j = 0; j < actions[actionType][i][ii].checks.length; j++) {
                            if (!theOBJ.checks) {
                                theOBJ.checks = [];
                            }
                            theOBJ.checks.push({
                                type: actions[actionType][i][ii].checks[j],
                            });
                        }
                    }
                    if (actions[actionType][i][ii].ranges) {
                        for (var j = 0; j < actions[actionType][i][ii].ranges.length; j++) {
                            if (!theOBJ.ranges) {
                                theOBJ.ranges = [];
                            }
                            theOBJ.ranges.push({
                                type: actions[actionType][i][ii].ranges[j],
                            });
                        }
                    }
                    theOBJ.mydes = {};
                    theOBJ.mydes.type = false;
                    theOBJ.mydes.value = "";
                    suo.itemMore(theOBJ, actionType);
                    break;
                }
            }
        }

        var oldBox = getele(ele).querySelectorAll(".actionbox .box_more");
        for (var i = 0; i < oldBox.length; i++) {
            oldBox[i].remove();
        }
        if (boxdom.querySelector(".actionbox .box_desbox")) {
            boxdom.querySelector(".actionbox .box_desbox").remove();
        }
        if (getele(ele).querySelector(".actionbox")) {
            getele(ele).querySelector(".actionbox").appendChild(suo.itemDes(theOBJ));
            getele(ele).querySelector(".actionbox").appendChild(suo.itemMore(theOBJ, actionType));
        } else if (getele(ele).querySelector(".box_option")) {
            getele(ele).querySelector(".box_option").innerHTML = "";
            getele(ele).querySelector(".box_option").appendChild(suo.itemOption(theOBJ, actionType));
        }
        return;
    },
    getPermission: permission => {
        chrome.permissions.request({ permissions: permission /*["contentSettings"]*/ }, granted => {
            if (!granted) {
            }
        });
    },
    checkPermission: (thepers, theorgs, theFunction, msg) => {
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
            console.log("get");
            chrome.runtime.sendMessage({
                type: "opt_getpers",
                value: {
                    thepers: thepers,
                    theorgs: theorgs,
                    theFunction: theFunction,
                    msg: msg,
                },
            });
            return;
        };
        var checkPers = result => {
            if (result) {
                if (theFunction) {
                    theFunction();
                }
            } else {
                getPers(thepers, theorgs);
            }
        };
    },
    confImport: () => {
        var file = document.querySelector("#import_file").files[0];
        var reader = new FileReader();
        let importedConfig = {};
        reader.readAsText(file);
        reader.onload = e => {
            var str = Base64.decode(e.target.result);
            console.log("sdf");
            try {
                importedConfig = JSON.parse(str);
                console.log(importedConfig);
                if (importedConfig.general) {
                    if (importedConfig.version > config.version) {
                        ve(suo.getI18n("msg_importver"));
                        return;
                    }
                    localStorage.setItem("sync", importedConfig.general.sync.autosync.toString());
                    config = {};
                    config = importedConfig;
                    suo.saveConf2();
                    window.setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            } catch (error) {
                console.log(error);
                alert(suo.getI18n("msg_confimport"));
            }
        };
    },
    confExport: () => {
        var _conf = config;
        if (_conf.local) {
            delete _conf.local;
        }

        var blob = new Blob([JSON.stringify(_conf)]);
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = e => {
            var str = e.target.result.substr(e.target.result.indexOf("base64,") + 7);
            var newBlob = new Blob([str]);
            var a = document.createElement("a");
            a.id = "btn_export";
            a.href = window.URL.createObjectURL(newBlob);
            a.download = "grand-gesture.config";
            a.textContent = suo.getI18n("con_export");
            document.querySelector("#export_tip").textContent = "";
            document.querySelector("#export_tip").appendChild(a);
        };
    },
    initActionEle: () => {
        return;
    },
    initEnd: () => {
        if (config.general.settings.autosave) {
            document.querySelector("#menuplus_save").style.display = "none";
            document.querySelector(".nav_btn_save").style.display = "none";
        } else {
            document.querySelector("#menuplus_save").style.display = "block";
            document.querySelector(".nav_btn_save").style.display = "inline-block";
        }

        suo.fixSizePos();
        document.title = suo.getI18n("ext_name") + " " + suo.getI18n("opt_title");

        document.querySelector("#main").style.cssText += "opacity:1;transition:all .9s ease-in-out;display:block;";

        //document.querySelector("#abmain_name").innerText = suo.getI18n("ext_name");
        //document.querySelector("#abmain_des").innerText = suo.getI18n("ext_desb");
        // document.querySelector("#abinfo_ver").innerText += chrome.runtime.getManifest().version;
        document.querySelector("#extension_version_number").innerText += chrome.runtime.getManifest().version;

        document.querySelector("#loadingbox").style.cssText += "opacity:0;";
        window.setTimeout(() => {
            document.querySelector("#loadingbox").remove();
            suo.cons.menuPin ? null : suo.menuBarCreate();
        }, 400);

        document.querySelector("#import_file").onchange = () => {
            suo.confImport();
        };
        suo.setTheme();
        suo.initLog();
        //show log
        if (localStorage.getItem("showlog") == "true") {
            suo.clickMenuDiv(document.querySelector("div[data-confobj='about']"));
            suo.clickMenuLI(document.querySelector("li[data-id0='13'][data-id1='0']"));
            localStorage.removeItem("showlog");
        }
        //show about
        if (localStorage.getItem("showabout")) {
            suo.clickMenuDiv(document.querySelector("div[data-confobj='about']"));
            suo.clickMenuLI(document.querySelector("li[data-id0='13'][data-id1='0']"));
            localStorage.removeItem("showabout");
        }
        //init webstore url
        if (browserType == "cr") {
            if (devMode) {
                suo.cons.webstoreURL = "https://chrome.google.com/webstore/detail/kmdhnmlelcmpeafnienldlcfchkkajfb";
            } else {
                suo.cons.webstoreURL = "https://chrome.google.com/webstore/detail/kmdhnmlelcmpeafnienldlcfchkkajfb";
            }
        } else if (browserType == "fx") {
            suo.cons.webstoreURL = "https://addons.mozilla.org/firefox/addon/smartup";
        } else if (browserType == "edg") {
            suo.cons.webstoreURL = "https://chrome.google.com/webstore/detail/kmdhnmlelcmpeafnienldlcfchkkajfb";
        }
        //disable option auto sync
        if (!chrome.storage.sync) {
            document.querySelector("input[data-confele=autosync]").disabled = true;
        }

        //browsersettings
        if (browserType != "fx") {
            document.querySelector("[data-confele=mouseup]").disabled = true;
        }
        chrome.browserSettings && chrome.browserSettings.contextMenuShowEvent
            ? chrome.browserSettings.contextMenuShowEvent.get({}).then(result => {
                  console.log(result.value);
                  if (result.value == "mouseup") {
                      config.general.linux.cancelmenu = false;
                      document.querySelector("[data-confele=cancelmenu]").disabled = true;
                  }
              })
            : null;
    },
    initBoxBtn: (dom, btn) => {
        var dombtn = dom.querySelectorAll(".box_submit input[type=button]");
        for (var i = 0, i_btn = 0; i < btn.length; i++) {
            if (btn[i]) {
                dombtn[i].value = btn[i];
            } else {
                i_btn++;
                dombtn[i].remove();
            }
        }
    },
    initLog: () => {
        // console.log("log");
        // var xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = () => {
        //     if (xhr.readyState == 4) {
        //         var xhrLog = JSON.parse(xhr.response);
        //         var domlog = document.querySelector(".set.set-135.confobj>.setcontent");
        //         domlog.textContent = "";
        //         var _detailsMore = suo.domCreate2("details");
        //         var _summaryMore = suo.domCreate2("summary", null, null, null, null, "more...");
        //         _detailsMore.appendChild(_summaryMore);
        //         for (var i = 0; i < xhrLog.log.length; i++) {
        //             if (i > 8) {
        //                 var dom = suo.domCreate2("details");
        //                 var _summary = suo.domCreate2(
        //                     "summary",
        //                     null,
        //                     null,
        //                     null,
        //                     null,
        //                     xhrLog.log[i].ver + " - " + xhrLog.log[i].date
        //                 );
        //                 var _ul = suo.domCreate2("ul");
        //                 for (var ii = 0; ii < xhrLog.log[i].content.length; ii++) {
        //                     var _li = suo.domCreate2("li", null, null, null, null, xhrLog.log[i].content[ii]);
        //                     _ul.appendChild(_li);
        //                 }
        //                 dom.appendChild(_summary);
        //                 dom.appendChild(_ul);
        //                 _detailsMore.appendChild(dom);
        //                 domlog.appendChild(_detailsMore);
        //             } else {
        //                 var dom = suo.domCreate2("details");
        //                 dom.open = "open";
        //                 var _summary = suo.domCreate2(
        //                     "summary",
        //                     null,
        //                     null,
        //                     null,
        //                     null,
        //                     xhrLog.log[i].ver + " - " + xhrLog.log[i].date
        //                 );
        //                 var _ul = suo.domCreate2("ul");
        //                 for (var ii = 0; ii < xhrLog.log[i].content.length; ii++) {
        //                     var _li = suo.domCreate2("li", null, null, null, null, xhrLog.log[i].content[ii]);
        //                     _ul.appendChild(_li);
        //                 }
        //                 dom.appendChild(_summary);
        //                 dom.appendChild(_ul);
        //                 domlog.appendChild(dom);
        //             }
        //         }
        //         for (var i = 0; i < xhrLog.oldlog.length; i++) {
        //             var dom = suo.domCreate2("details");
        //             var _summary = suo.domCreate2(
        //                 "summary",
        //                 null,
        //                 null,
        //                 null,
        //                 null,
        //                 xhrLog.oldlog[i].ver + " - " + xhrLog.oldlog[i].date
        //             );
        //             var _ul = suo.domCreate2("ul");
        //             for (var ii = 0; ii < xhrLog.oldlog[i].content.length; ii++) {
        //                 var _li = suo.domCreate2("li", null, null, null, null, xhrLog.oldlog[i].content[ii]);
        //                 _ul.appendChild(_li);
        //             }
        //             dom.appendChild(_summary);
        //             dom.appendChild(_ul);
        //             _detailsMore.appendChild(dom);
        //         }
        //     }
        // };
        // xhr.open("GET", "../change.log", true);
        // xhr.send();
    },
    fixURL: url => {
        var fixstrs = [
            "file:///",
            "extension://",
            "http://",
            "https://",
            "ftp://",
            "chrome://",
            "edge://",
            "chrome-extension://",
            "view-source:chrome-extension://",
            "moz-extension://",
            "about://",
            "about:",
        ];
        var theFlag = false;
        for (var i = 0; i < fixstrs.length; i++) {
            if (url.indexOf(fixstrs[i]) == 0) {
                theFlag = true;
                break;
            }
        }
        if (!theFlag) {
            return "http://" + url;
        } else {
            return url;
        }
    },
    menuBarRemove: () => {
        var bgOBJ = document.querySelector("#menu_bg");
        var menuOBJ = document.querySelector("menu");
        if (bgOBJ) {
            bgOBJ.style.cssText += "background-color:rgba(0,0,0,0);";
            window.setTimeout(() => {
                bgOBJ.remove();
            }, 400);
        }
        menuOBJ.style.cssText += "left:-350px;";
        document.querySelector("menu #menu_logo").style.cssText += "margin-left:0;";
        document.querySelector("menu #menu_name").style.cssText += "display:none;opacity:0;";
        suo.fixSizePos();
    },
    menuBarCreate: () => {
        if (window.getComputedStyle(document.querySelector("#menu_topbox")).display == "none") {
            document.querySelector("#menu_topbox").style.cssText += "display:block;";
            document.querySelector("#menu_bottom").style.cssText += "bottom:0px;";
        }

        document.body.appendChild(
            suo.domCreate2("div", { setName: ["id"], setValue: ["menu_bg"] }, "", "background-color:rgba(0,0,0,.8);")
        );
        document.querySelector("menu").style.cssText += "left:0;top:0;";
        document.querySelector("menu #menu_logo").style.cssText += "margin-left:180px;";
        window.setTimeout(() => {
            document.querySelector("menu #menu_name").style.cssText += "display:inline;";
            document.querySelector("menu #menu_name").style.cssText += "opacity:1;";
        }, 800);
    },
    initSizePos: () => {},
    fixSizePos: () => {
        suo.cons.menuPin = true;
        suo.initSizePos();
        document.querySelector("#menu_topbox").style.display = "none";
        document.querySelector("menu").style.cssText += "left: 0px;top: 64px;";
        document.querySelector("#menu_bottom").style.cssText += "bottom:64px;";
        document.querySelector("menu #menu_logo").style.cssText += "margin-left:180px;";
        window.setTimeout(() => {
            document.querySelector("menu #menu_name").style.cssText += "display:inline;";
            document.querySelector("menu #menu_name").style.cssText += "opacity:1;";
        }, 800);
    },
    randColor: () => {
        var colorStr = "";
        var flag;
        for (var i = 0; i < 3; i++) {
            flag = Number.parseInt(Math.random() * 256).toString(16);
            if (flag.length == 1) {
                flag = "0" + flag;
            }
            colorStr += flag;
        }
        return "#" + colorStr;
    },
    showBtnAdd: (type, confobj, dom) => {
        console.log(confobj);
        var btnOBJ = document.querySelector("#btn_add");
        if (!type) {
            btnOBJ.style.cssText += "display:none;";
            return;
        }
        confobj ? btnOBJ.setAttribute("data-confobj", confobj) : null;

        if (!dom.querySelector("#btn_add")) {
            dom.appendChild(
                suo.domCreate2(
                    "img",
                    {
                        setName: ["id", "src", "title"],
                        setValue: ["btn_add", "../image/add.svg", suo.getI18n("tip_addnew")],
                    },
                    null,
                    null,
                    {
                        setName: ["confobj", "actiontype"],
                        setValue: [confobj, confobj.split("|")[0]],
                    }
                )
            );
        }
        if (
            !dom.querySelector(".btn_list") &&
            confobj &&
            confobj.indexOf("script") == -1 &&
            confobj.indexOf("ctm") == -1 &&
            confobj.indexOf("pop") == -1
        ) {
            dom.appendChild(
                suo.domCreate2(
                    "img",
                    {
                        setName: ["className", "src", "title"],
                        setValue: ["btn_list", "../image/list.svg", suo.getI18n("tip_showlist")],
                    },
                    null,
                    null,
                    { setName: ["confobj"], setValue: [confobj] }
                )
            );
        }
    },
    itemAddBefore: e => {
        const ele = e.target || e;
        console.log("itemAddBefore");
        editMode = true;
        var confArray = suo.getConfArray(ele, "confobj"),
            confOBJ = config,
            actionType = confArray[0],
            confobj = suo.getDataset(ele, "confobj", "value");
        if (confArray[0] == "drg") {
            actionType = confArray[1];
        }
        console.log(actionType);
        for (var i = 0; i < confArray.length; i++) {
            confOBJ = confOBJ[confArray[i]];
        }
        var confid = confOBJ.length;
        if (["engine", "script"].contains(confArray[1])) {
            suo.itemEdit(confobj, confid, "add", null, confArray[2]);
            return;
        }
        if (confArray[0] == "pop" || confArray[0] == "ctm") {
            suo.itemEdit(confobj, confid, "add", null, confArray[0]);
            return;
        }
        var testdes = suo.getI18n(
            "test_" + (confArray[0] == "mges" || confArray[0] == "touch" ? "mges" : confArray[1])
        );
        var btnArray = ["", suo.getI18n("btn_cancel"), suo.getI18n("btn_done")];
        const testDom = suo.domCreate2(
            "div",
            { setName: ["className"], setValue: ["testbox"] },
            null,
            null,
            null,
            testdes
        );
        if (confArray[1] == "ldrg") {
            testDom.textContent = "";
            testDom.appendChild(
                suo.domCreate2(
                    "a",
                    { setName: ["href"], setValue: ["###"] },
                    null,
                    null,
                    null,
                    suo.getI18n("test_ldrg")
                )
            );
        } else if (confArray[1] == "idrg") {
            testDom.appendChild(suo.domCreate2("br"));
            testDom.appendChild(suo.domCreate2("br"));
            testDom.appendChild(
                suo.domCreate2("img", { setName: ["src"], setValue: ["../image/grand-gesture-icon-064.png"] })
            );
        }
        let domBoxTitle = suo.getI18n("title_editaction");
        if (actionType === "txtengine" || actionType === "imgengine") {
            domBoxTitle = suo.getI18n("title_editengine");
        } else if (actionType === "script") {
            domBoxTitle = suo.getI18n("title_newscript");
        }

        var addOBJ = suo.initAPPbox(btnArray, [480, 320], domBoxTitle, "bg");
        addOBJ.classList.add("su_app_test");
        addOBJ.dataset.confobj = confobj;
        addOBJ.dataset.confid = confid;
        addOBJ.dataset.close = "resetdirect";
        addOBJ.dataset.actiontype = actionType;
        addOBJ.querySelectorAll("input[type=button]")[1].className = "box_btn box_btn_next";
        addOBJ.querySelector(".box_content").appendChild(testDom);
        //when adding drag text, set the test text can be drag.
        if (confArray[1] == "tdrg") {
            addOBJ.style.cssText += "-webkit-user-select:text;-moz-user-select:text;user-select:text;";
        }
        suo.initPos(addOBJ);
    },
    directEdit: e => {
        console.log("directEdit");
        var confobj = suo.getDataset(e, "confobj", "value");
        var confid = suo.getDataset(e, "confid", "value");
        var dataclose = suo.getDataset(e, "close", "value");
        suo.boxClose2(suo.getAPPboxEle(e));
        editMode = true;
        var confArray = confobj.split("|");
        var testdes = suo.getI18n(
            "test_" + (confArray[0] == "mges" || confArray[0] == "touch" ? "mges" : confArray[1])
        );
        var btnArray = ["", suo.getI18n("btn_cancel"), suo.getI18n("btn_done")];
        var addOBJ = suo.initAPPbox(
            btnArray,
            [480, 320],
            suo.getI18n("title_editdirect"),
            "bg",
            suo.getDataset(e, "actiontype", "value")
        );
        addOBJ.classList.add("su_app_test");
        addOBJ.dataset.confobj = confobj;
        addOBJ.dataset.confid = confid;
        addOBJ.dataset.close = dataclose + "resetdirect";
        addOBJ.querySelectorAll("input[type=button]")[1].className = "box_btn box_btn_diredit";

        const testDom = suo.domCreate2(
            "div",
            { setName: ["className"], setValue: ["testbox"] },
            null,
            null,
            null,
            testdes
        );
        if (confArray[1] == "ldrg") {
            testDom.textContent = "";
            testDom.appendChild(
                suo.domCreate2(
                    "a",
                    { setName: ["href"], setValue: ["###"] },
                    null,
                    null,
                    null,
                    suo.getI18n("test_ldrg")
                )
            );
        } else if (confArray[1] == "idrg") {
            testDom.appendChild(suo.domCreate2("br"));
            testDom.appendChild(suo.domCreate2("br"));
            testDom.appendChild(
                suo.domCreate2("img", { setName: ["src"], setValue: ["../image/grand-gesture-icon-064.png"] })
            );
        }
        addOBJ.querySelector(".box_content").appendChild(testDom);

        suo.initPos(addOBJ);
    },
    initAPPbox: (btn, size, title, bg, actiontype) => {
        console.log(actiontype);
        var title = title ? title : "";
        var boxOBJ = document.querySelector("smartup.su_apps").cloneNode(true);
        boxOBJ.style.cssText += "display:block;z-index:1000;opacity:0;";
        title ? (boxOBJ.querySelector(".box_title").innerText = title) : null;
        if (actiontype) {
            boxOBJ.dataset.actiontype = actiontype;
        } else {
            boxOBJ.dataset.actiontype = "";
        }

        var btnOBJ = boxOBJ.querySelectorAll(".box_submit input[type=button]");
        for (var i = 0, i_btn = 0; i < btn.length; i++) {
            if (btn[i]) {
                btnOBJ[i].value = btn[i];
            } else {
                i_btn++;
                btnOBJ[i].remove();
            }
        }
        if (i_btn == btn.length) {
            boxOBJ.querySelector(".box_submit").remove();
        }
        return boxOBJ;
    },
    itemEditBefor: e => {
        function getele(ele) {
            ele = ele.target || ele;
            console.log(ele);
            if (!ele.dataset.actiontype) {
                return getele(ele.parentNode);
            } else {
                return ele;
            }
        }
        var ele = getele(e);

        suo.itemEdit(
            suo.getDataset(ele, "confobj", "value"),
            suo.getDataset(ele, "confid", "value"),
            null,
            null,
            ele.dataset.actiontype
        );
    },
    getAPPboxEle: e => {
        var ele = e.target || e;
        var getele = ele => {
            if (ele.tagName && ele.tagName.toLowerCase() == "smartup" && ele.classList.contains("su_apps")) {
                return ele;
            } else {
                return getele(ele.parentNode);
            }
        };
        return getele(ele);
    },
    getDataset: (e, type, returntype) => {
        console.log(e);
        console.log(type + "//" + returntype);
        var ele = e.target || e;
        var type = type ? type : "confobj",
            returntype = returntype ? returntype : "ele";
        var getdata = ele => {
            if (ele.dataset[type] == "" || ele.dataset[type]) {
                return ele;
            } else {
                return getdata(ele.parentNode);
            }
        };
        if (returntype == "value") {
            return getdata(ele).dataset[type];
        } else {
            return getdata(ele);
        }
    },
    boxMove: e => {
        var ele = e.target || e;
        var OBJ = suo.getAPPboxEle(e);
        if (!OBJ) {
            return false;
        }
        OBJ.querySelector(".box_head").style.cssText += "cursor:move;";
        OBJ.style.cssText +=
            "transition:none;" +
            "left:" +
            (e.clientX - suo.cons.boxmove.posX) +
            "px;" +
            "top:" +
            (e.clientY - suo.cons.boxmove.posY) +
            "px;";
    },
    checkEditDirect: e => {
        console.log("checkEditDirect");
        var dom = suo.getAPPboxEle(e);
        var confobj = dom.dataset.confobj,
            confid = dom.dataset.confid;
        var confOBJ = config;
        var confArray = confobj.split("|");
        console.log(editDirect);
        if (!editDirect) {
            const _span = suo.domCreate2(
                "span",
                null,
                null,
                "font-weight:bold;font-size:16px;",
                null,
                suo.getI18n("msg_dirnone")
            );
            dom.querySelector(".testbox").textContent = "";
            dom.querySelector(".testbox").appendChild(_span);
            dom.querySelector(".testbox").appendChild(suo.domCreate2("br"));
            dom.querySelector(".testbox").appendChild(
                suo.domCreate2("span", null, null, null, null, suo.getI18n("test_" + confArray[1]))
            );
            suo.showMsgBox(suo.getI18n("msg_dirnone"), "error", "", 10000);
            return false;
        }

        for (var i = 0; i < confArray.length; i++) {
            confOBJ = confOBJ[confArray[i]];
        }
        for (var i = 0; i < confOBJ.length; i++) {
            if (confOBJ[i].direct == editDirect) {
                suo.showMsgBox(suo.getI18n("msg_dirrepeat"), "error", "", 10000);
                return false;
                break;
            }
        }
        return [confobj, confid, editDirect];
    },
    setTheme: from => {
        var themediv = document.createElement("link");
        themediv.href = "../css/theme_colorful.css";
        themediv.type = "text/css";
        themediv.rel = "stylesheet";
        document.body.appendChild(themediv);
        document.body.style.cssText += "background:#d0d9ff !important;";
    },
};
chrome.runtime.sendMessage({ type: "opt_getconf" }, response => {
    console.log(response);
    defaultConf = response.defaultConf;
    config = response.config;
    suo.cons.os = response.os;
    devMode = response.devMode;
    suo.cons.reason = response.reason;
    suo.begin();
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "confErr":
            suo.showMsgBox(
                [suo.getI18n("msg_conferr0"), message.lastErr, suo.getI18n("msg_conferr1")],
                "error",
                "5",
                10000
            );
            window.setTimeout(() => {
                location.reload();
            }, 6000);
            break;
        case "confOK":
            suo.showMsgBox();
            break;
    }
});
