console.log("extmgm");
sue.apps.extmgm = {
    cons: {
        boxmove: {},
        curId: 0,
        editMode: false,
    },
    initUI: function () {
        const appInfo = {
            appName: "extmgm",
            headTitle: "extmgm",
            headCloseBtn: true,
            menu: [
                {
                    src: "/image/menu.svg",
                    title: "extmgm_grouplist",
                    className: "menu_item menu_item_extmgmgroup",
                },
                {
                    src: "/image/more.svg",
                    title: "tip_more",
                    className: "menu_item menu_item_extmgmmore",
                },
                {
                    src: "/image/options.svg",
                    title: "app_tip_opt",
                    className: "menu_item menu_item_opt",
                },
                {
                    src: "/image/edit.svg",
                    title: "tip_editmode",
                    className: "menu_item menu_item_extmgmedit",
                },
            ],
            options: [
                {
                    type: "checkbox",
                    label: "n_uninstallconfirm",
                    name: "n_uninstallconfirm",
                },
                {
                    type: "checkbox",
                    label: "n_enableallconfirm",
                    name: "n_enableallconfirm",
                },
                {
                    type: "checkbox",
                    label: "n_disableallconfirm",
                    name: "n_disableallconfirm",
                },
            ],
        };
        sue.apps.init();
        var dom = sue.apps.initBox(appInfo);
        dom.id = "su_apps_" + appInfo.appName;
        sue.apps[appInfo.appName].dom = dom;
        sue.apps.initPos(dom);

        const theAppBox = sue.apps.domCreate("div", {
            setName: ["className"],
            setValue: ["su_extmgm_box"],
        });
        dom.querySelector(".su_main").appendChild(theAppBox);
        sue.apps.extmgm.firstItem(dom);

        const boxMore = sue.apps.domCreate("div", {
                setName: ["className"],
                setValue: ["su_extmgm_boxmore"],
            }),
            moreUl = sue.apps.domCreate("div", {
                setName: ["className"],
                setValue: ["su_extmgm_moreul"],
            });
        boxMore.appendChild(moreUl);
        dom.appendChild(boxMore);
        sue.apps.extmgm.moreInit(dom);

        const boxGroup = sue.apps.domCreate("div", {
                setName: ["className"],
                setValue: ["su_extmgm_boxgroup"],
            }),
            boxUl = sue.apps.domCreate("div", {
                setName: ["className"],
                setValue: ["su_extmgm_boxul"],
            });
        boxGroup.appendChild(boxUl);
        dom.appendChild(boxGroup);
        sue.apps.extmgm.groupInit(dom);

        dom.style.cssText += "border-color:#0a5fa2;";
        dom.querySelector(".su_head").style.cssText += "background-color:#0a5fa2;";
        dom.addEventListener("click", this.handleEvent, false);
    },
    firstItem: dom => {
        const _dom = sue.apps.getAPPboxEle(dom).querySelector(".su_extmgm_box");
        if (_dom.querySelector(".su_extmgm_itemul")) {
            _dom.querySelector(".su_extmgm_itemul").textContent = "";
        } else {
            _dom.appendChild(
                sue.apps.domCreate("ul", {
                    setName: ["className"],
                    setValue: ["su_extmgm_itemul"],
                })
            );
        }
        const _ul = _dom.querySelector(".su_extmgm_itemul");
        _ul.classList.add("su_extmgm_itemul_firstitem");

        const _uldis = _dom.querySelector(".su_extmgm_itemuldis");
        if (_uldis) {
            _uldis.remove();
        }

        const _config = sue.apps.extmgm.config.exts;
        for (var i = 0; i < _config.length; i++) {
            var _li = sue.apps.domCreate("li", {
                setName: ["className"],
                setValue: ["su_extmgm_itemli"],
            });
            var _div = sue.apps.domCreate(
                "div",
                { setName: ["className"], setValue: ["su_extmgm_itemfirst"] },
                null,
                null,
                { setName: ["id"], setValue: [i] },
                _config[i].gpname
            );
            _li.appendChild(_div);
            _ul.appendChild(_li);
        }
        sue.apps.initPos(dom);
    },
    itemInit: (dom, id) => {
        console.log(id);
        const _dom = sue.apps.getAPPboxEle(dom).querySelector(".su_extmgm_box");
        if (_dom.querySelector(".su_extmgm_itemul")) {
            _dom.querySelector(".su_extmgm_itemul").textContent = "";
        } else {
            _dom.appendChild(
                sue.apps.domCreate("ul", {
                    setName: ["className"],
                    setValue: ["su_extmgm_itemul"],
                })
            );
        }
        const _ul = _dom.querySelector(".su_extmgm_itemul");
        _ul.dataset.id = id;
        //delete class before
        _ul.className = "su_extmgm_itemul";

        chrome.runtime.sendMessage(
            {
                type: "appsAction",
                app: "extmgm",
                action: "getAllExt",
                extsEnable: sue.apps.extmgm.config.exts[id],
            },
            response => {
                if (!response || !response.exts || !response.exts.length) {
                    return;
                }

                let _uldis = _dom.querySelector(".su_extmgm_itemuldis");
                if (sue.apps.extmgm.cons.editMode) {
                    if (_uldis) {
                        _uldis.textContent = "";
                    } else {
                        _uldis = sue.apps.domCreate("ul", {
                            setName: ["className"],
                            setValue: ["su_extmgm_itemuldis"],
                        });
                        _dom.appendChild(_uldis);
                    }
                    _uldis.dataset.id = id;
                } else {
                    _uldis ? _uldis.remove() : null;
                }

                const _exts = response.exts;
                console.log(_uldis);
                for (var i = 0; i < _exts.length; i++) {
                    if (_exts[i].id == sue.apps.extmgm.extID) {
                        continue;
                    }
                    if (sue.apps.extmgm.config.exts[id].id.contains(_exts[i].id)) {
                        var _li = sue.apps.domCreate(
                            "li",
                            { setName: ["className"], setValue: ["su_extmgm_itemli"] },
                            null,
                            null,
                            { setName: ["id"], setValue: [_exts[i].id] }
                        );
                        var _div = sue.apps.domCreate(
                            "div",
                            { setName: ["className"], setValue: ["su_extmgm_item"] },
                            null,
                            null,
                            { setName: ["id"], setValue: [_exts[i].id] }
                        );
                        var _img = sue.apps.domCreate("img", {
                            setName: ["src"],
                            setValue: [
                                _exts[i].iconBase64
                                    ? _exts[i].iconBase64
                                    : chrome.runtime.getURL("image/extension.svg"),
                            ],
                        });
                        var _span = sue.apps.domCreate(
                            "span",
                            { setName: ["className"], setValue: ["su_extmgm_itemname"] },
                            null,
                            null,
                            null,
                            _exts[i].name
                        );
                        var _spanAction = sue.apps.domCreate("span", {
                            setName: ["className"],
                            setValue: ["su_extmgm_itemaction"],
                        });
                        var _actionDis = sue.apps.domCreate(
                            "img",
                            {
                                setName: ["src", "title", "className"],
                                setValue: [
                                    chrome.runtime.getURL("image/disable.svg"),
                                    sue.apps.i18n("extmgm_tipdisable"),
                                    "su_extmgm_itemdisable",
                                ],
                            },
                            null,
                            null,
                            { setName: ["id", "type"], setValue: [_exts[i].id, "item"] }
                        );
                        var _actionOpt = sue.apps.domCreate(
                            "img",
                            {
                                setName: ["src", "title", "className"],
                                setValue: [
                                    chrome.runtime.getURL("image/options.svg"),
                                    sue.apps.i18n("extmgm_tipoption"),
                                    "su_extmgm_itemopturl",
                                ],
                            },
                            null,
                            null,
                            { setName: ["url"], setValue: [_exts[i].optionsUrl] }
                        );
                        var _actionUninstall = sue.apps.domCreate(
                            "img",
                            {
                                setName: ["src", "title", "className"],
                                setValue: [
                                    chrome.runtime.getURL("image/uninstall.svg"),
                                    sue.apps.i18n("extmgm_tipuninstall"),
                                    "su_extmgm_itemuninstall",
                                ],
                            },
                            null,
                            null,
                            { setName: ["id"], setValue: [_exts[i].id] }
                        );
                        _div.appendChild(_img);
                        _div.appendChild(_span);

                        _spanAction.appendChild(_actionDis);
                        _exts[i].optionsUrl && !sue.apps.extmgm.cons.editMode
                            ? _spanAction.appendChild(_actionOpt)
                            : null;
                        _spanAction.appendChild(_actionUninstall);
                        _div.appendChild(_spanAction);

                        _li.appendChild(_div);
                        _ul.appendChild(_li);
                        continue;
                    } else {
                        if (sue.apps.extmgm.cons.editMode) {
                            _ul.classList.add("su_extmgm_itemuleditbefore");
                            _uldis.classList.add("su_extmgm_itemuldiseditbefore");
                            var _li = sue.apps.domCreate(
                                "li",
                                { setName: ["className"], setValue: ["su_extmgm_itemli"] },
                                null,
                                null,
                                { setName: ["id"], setValue: [_exts[i].id] }
                            );
                            var _div = sue.apps.domCreate(
                                "div",
                                { setName: ["className"], setValue: ["su_extmgm_item"] },
                                null,
                                null,
                                { setName: ["id"], setValue: [_exts[i].id] }
                            );
                            var _img = sue.apps.domCreate("img", {
                                setName: ["src"],
                                setValue: [
                                    _exts[i].iconBase64
                                        ? _exts[i].iconBase64
                                        : chrome.runtime.getURL("image/extension.svg"),
                                ],
                            });
                            var _span = sue.apps.domCreate(
                                "span",
                                { setName: ["className"], setValue: ["su_extmgm_itemname"] },
                                null,
                                null,
                                null,
                                _exts[i].name
                            );
                            var _spanAction = sue.apps.domCreate("span", {
                                setName: ["className"],
                                setValue: ["su_extmgm_itemaction"],
                            });
                            var _actionDis = sue.apps.domCreate(
                                "img",
                                {
                                    setName: ["src", "title", "className"],
                                    setValue: [
                                        chrome.runtime.getURL("image/enable.svg"),
                                        sue.apps.i18n("extmgm_tipenable"),
                                        "su_extmgm_itemenable",
                                    ],
                                },
                                null,
                                null,
                                { setName: ["id", "type"], setValue: [_exts[i].id, "item"] }
                            );
                            // var _actionOpt=sue.apps.domCreate("img",{setName:["src","title"],setValue:[chrome.runtime.getURL("image/options.svg"),sue.apps.i18n("extmgm_tipoption")]},null,null,{setName:["url"],setValue:[_exts[i].optionsUrl]});
                            var _actionUninstall = sue.apps.domCreate(
                                "img",
                                {
                                    setName: ["src", "title", "className"],
                                    setValue: [
                                        chrome.runtime.getURL("image/uninstall.svg"),
                                        sue.apps.i18n("extmgm_tipuninstall"),
                                        "su_extmgm_itemuninstall",
                                    ],
                                },
                                null,
                                null,
                                { setName: ["id"], setValue: [_exts[i].id] }
                            );
                            _div.appendChild(_img);
                            _div.appendChild(_span);

                            _spanAction.appendChild(_actionDis);
                            // _exts[i].optionsUrl?_spanAction.appendChild(_actionOpt):null;
                            _spanAction.appendChild(_actionUninstall);
                            _div.appendChild(_spanAction);

                            _li.appendChild(_div);
                            _uldis.appendChild(_li);
                        }
                    }
                }
                sue.apps.initPos(dom);
                sue.apps.extmgm.cons.curId = id;
                sue.apps.extmgm.groupSetCur(dom, id);
                sue.apps.extmgm.itemSetSort(dom, id);
            }
        );
    },
    itemSetSort: (e, id) => {
        const _dom = sue.apps.getAPPboxEle(e);
        if (sue.apps.extmgm.cons.editMode) {
            sue.apps.extmgm.cons.sortItemEnabled = Sortable.create(
                sue.apps.getAPPboxEle(e).querySelector(".su_extmgm_itemul"),
                {
                    animation: 200,
                    easing: "ease-in-out",
                    ghostClass: "su_sortable_list",
                    chosenClass: "su_sortable_list",
                    group: {
                        name: "enabled",
                        put: ["disabled"],
                    },
                    onAdd: e => {
                        console.log(e);
                        const item = e.item.querySelectorAll(".su_extmgm_itemaction img")[0];
                        item.src = chrome.runtime.getURL("image/disable.svg");
                        item.title = sue.apps.i18n("extmgm_tipdisable");
                        item.className = "su_extmgm_itemdisable";
                    },
                    onSort: e => {
                        console.log(e);
                        const _lis = e.target.querySelectorAll("li");
                        const _ids = [];
                        for (var i = 0; i < _lis.length; i++) {
                            _ids.push(_lis[i].dataset.id);
                        }
                        sue.apps.extmgm.config.exts[id].id = _ids;
                        sue.apps.extmgm.confSave();
                    },
                }
            );
            sue.apps.extmgm.cons.sortItemDisabled = Sortable.create(
                sue.apps.getAPPboxEle(e).querySelector(".su_extmgm_itemuldis"),
                {
                    animation: 200,
                    easing: "ease-in-out",
                    ghostClass: "su_sortable_list",
                    chosenClass: "su_sortable_list",
                    group: {
                        name: "disabled",
                        put: ["enabled"],
                    },
                    onAdd: e => {
                        console.log(e);
                        const item = e.item.querySelectorAll(".su_extmgm_itemaction img")[0];
                        item.src = chrome.runtime.getURL("image/enable.svg");
                        item.title = sue.apps.i18n("extmgm_tipenable");
                        item.className = "su_extmgm_itemenable";
                    },
                }
            );
        } else {
            // sue.apps.extmgm.cons.sortItemEnabled?sue.apps.extmgm.cons.sortItemEnabled.destroy():null;
            // sue.apps.extmgm.cons.sortItemDisabled?sue.apps.extmgm.cons.sortItemDisabled.destroy():null;
        }
    },
    itemDisable: e => {
        if (e.target.dataset.type == "always") {
            // sue.apps.extmgm.config.always.push(e.target.dataset.id);
            for (var i = 0; i < sue.apps.extmgm.config.always.length; i++) {
                if (sue.apps.extmgm.config.always[i] == e.target.dataset.id) {
                    sue.apps.extmgm.config.always.splice(i, 1);
                    break;
                }
            }
            chrome.runtime.sendMessage({
                type: "appsAction",
                app: "extmgm",
                action: "itemDisable",
                extId: e.target.dataset.id,
            });
            sue.apps.extmgm.confSave();
            sue.apps.extmgm.moreAlways(sue.apps.getAPPboxEle(e));
            return true;
        }
        const _dom = sue.apps.getAPPboxEle(e).querySelector(".su_extmgm_itemul");
        const _id = Number.parseInt(_dom.dataset.id);
        const _extId = e.target.dataset.id;
        // disable ext
        // if(!sue.apps.extmgm.cons.editMode){
        // 	chrome.runtime.sendMessage({type:"appsAction",app:"extmgm",action:"itemDisable",extId:_extId});
        // }
        // remove form cur group
        for (var i = 0; i < sue.apps.extmgm.config.exts[_id].id.length; i++) {
            if (sue.apps.extmgm.config.exts[_id].id[i] == _extId) {
                sue.apps.extmgm.config.exts[_id].id.splice(i, 1);
                break;
            }
        }
        sue.apps.extmgm.itemInit(_dom, sue.apps.extmgm.cons.curId);
        sue.apps.extmgm.confSave();
    },
    itemEnable: e => {
        if (e.target.dataset.type == "always") {
            sue.apps.extmgm.config.always.push(e.target.dataset.id);
            chrome.runtime.sendMessage({
                type: "appsAction",
                app: "extmgm",
                action: "itemEnable",
                extId: e.target.dataset.id,
            });
            sue.apps.extmgm.confSave();
            sue.apps.extmgm.moreAlways(sue.apps.getAPPboxEle(e));
            return true;
        }
        const _dom = sue.apps.getAPPboxEle(e).querySelector(".su_extmgm_itemul");
        const _id = Number.parseInt(_dom.dataset.id);
        const _extId = e.target.dataset.id;
        // enable ext
        // if(!sue.apps.extmgm.cons.editMode){
        // 	chrome.runtime.sendMessage({type:"appsAction",app:"extmgm",action:"itemEnable",extId:_extId});
        // }
        // add to cur group
        sue.apps.extmgm.config.exts[_id].id.push(_extId);
        sue.apps.extmgm.itemInit(_dom, sue.apps.extmgm.cons.curId);
        sue.apps.extmgm.confSave();
    },
    itemOpturl: e => {
        const _url = e.target.dataset.url;
        chrome.runtime.sendMessage({
            type: "appsAction",
            app: "extmgm",
            action: "itemOpturl",
            url: _url,
        });
    },
    itemUninstall: e => {
        const _dom = sue.apps.getAPPboxEle(e).querySelector(".su_extmgm_itemul");
        const _id = Number.parseInt(_dom.dataset.id);
        const _extId = e.target.dataset.id;
        chrome.runtime.sendMessage({
            type: "appsAction",
            app: "extmgm",
            action: "itemUninstall",
            extId: _extId,
            id: _id,
        });
        const _uninstall = () => {
            chrome.runtime.sendMessage({
                type: "appsAction",
                app: "extmgm",
                action: "itemUninstall",
                extId: _extId,
                id: _id,
            });
        };
    },
    moreInit: dom => {
        const _dom = sue.apps.getAPPboxEle(dom).querySelector(".su_extmgm_boxmore");
        const _ul = _dom.querySelector(".su_extmgm_moreul"),
            _array = [
                sue.apps.i18n("extmgm_lastenable"),
                sue.apps.i18n("extmgm_alwaysenable"),
                sue.apps.i18n("extmgm_allenable"),
                sue.apps.i18n("extmgm_alldisable"),
            ],
            _arrayType = ["Last", "Always", "Enableall", "Disableall"];
        for (var i = 0; i < _array.length; i++) {
            var _li = sue.apps.domCreate("li", { setName: ["className"], setValue: ["su_extmgm_moreli"] }, null, null, {
                    setName: ["id"],
                    setValue: [i],
                }),
                _div = sue.apps.domCreate(
                    "div",
                    { setName: ["className"], setValue: ["su_extmgm_moreitem"] },
                    null,
                    null,
                    { setName: ["type", "id"], setValue: [_arrayType[i], [i]] },
                    _array[i]
                );
            _li.appendChild(_div);
            _ul.appendChild(_li);
        }
    },
    groupInit: (dom, id) => {
        console.log("groupInit");
        const _dom = sue.apps.getAPPboxEle(dom).querySelector(".su_extmgm_boxul");

        if (_dom.querySelector(".su_extmgm_groupul")) {
            _dom.querySelector(".su_extmgm_groupul").textContent = "";
        } else {
            _dom.appendChild(
                sue.apps.domCreate("ul", {
                    setName: ["className"],
                    setValue: ["su_extmgm_groupul"],
                })
            );
        }
        const _ul = _dom.querySelector(".su_extmgm_groupul");

        // set default value
        if (!sue.apps.extmgm.config.exts) {
            const _newExts = [
                {
                    gpname: sue.apps.i18n("extmgm_defaultgroup"),
                    id: [],
                },
            ];
            for (var i = 0; i < sue.apps.extmgm.exts.length; i++) {
                if (sue.apps.extmgm.exts[i].enabled) {
                    _newExts[1].id.push(sue.apps.extmgm.exts[i].id);
                }
            }
            sue.apps.extmgm.config.exts = _newExts;
        }
        const _extgroups = sue.apps.extmgm.config.exts;
        console.log(_extgroups);

        for (var i = 0; i < _extgroups.length; i++) {
            var _li = sue.apps.domCreate(
                    "li",
                    { setName: ["className"], setValue: ["su_extmgm_groupli"] },
                    null,
                    null,
                    { setName: ["id"], setValue: [i] }
                ),
                _div = sue.apps.domCreate(
                    "div",
                    { setName: ["className"], setValue: ["su_extmgm_groupitem"] },
                    null,
                    null,
                    { setName: ["id"], setValue: [i] },
                    _extgroups[i].gpname
                );
            if (sue.apps.extmgm.cons.editMode) {
                // var _span=sue.apps.domCreate("span",{setName:["className"],setValue:["su_extmgm_groupdel"]},null,null,{setName:["id"],setValue:[i]},"x");
                // _div.appendChild(_span);
                var _imgdel = sue.apps.domCreate(
                    "img",
                    {
                        setName: ["className", "src", "title"],
                        setValue: [
                            "su_extmgm_groupdel",
                            chrome.runtime.getURL("image/delete.svg"),
                            sue.apps.i18n("tip_del"),
                        ],
                    },
                    "display:inline-block;",
                    null,
                    { setName: ["id"], setValue: [i] }
                );
                var _imgedit = sue.apps.domCreate(
                    "img",
                    {
                        setName: ["className", "src", "title"],
                        setValue: [
                            "su_extmgm_groupedit",
                            chrome.runtime.getURL("image/edit.svg"),
                            sue.apps.i18n("tip_edit"),
                        ],
                    },
                    "display:inline-block;",
                    null,
                    { setName: ["id"], setValue: [i] }
                );
                _div.appendChild(_imgdel);
                _div.appendChild(_imgedit);
            }
            _li.appendChild(_div);
            _ul.appendChild(_li);
        }
        sue.apps.extmgm.groupSetSort(dom, id);
        _dom.appendChild(_ul);
        sue.apps.extmgm.groupSetCur(dom, id);
    },
    groupSetSort: dom => {
        const _dom = sue.apps.getAPPboxEle(dom);
        if (sue.apps.extmgm.cons.editMode) {
            sue.apps.extmgm.cons.sortGroup = Sortable.create(_dom.querySelector(".su_extmgm_groupul"), {
                animation: 200,
                easing: "ease-in-out",
                ghostClass: "su_sortable_list",
                chosenClass: "su_sortable_list",
                onSort: e => {
                    console.log(e);
                    sue.apps.extmgm.config.exts.splice(
                        e.newIndex,
                        0,
                        sue.apps.extmgm.config.exts.splice(e.oldIndex, 1)[0]
                    );
                    console.log(sue.apps.extmgm.config.exts);
                    // reset cur group id
                    if (e.item.classList.contains("su_extmgm_grouplicur")) {
                        sue.apps.extmgm.cons.curId = e.newIndex;
                    }
                    // reload group
                    sue.apps.extmgm.groupInit(dom, sue.apps.extmgm.cons.curId);
                    sue.apps.extmgm.confSave();
                },
            });
        } else {
            //sue.apps.extmgm.cons.sortGroup?sue.apps.extmgm.cons.sortGroup.destroy():null;
        }
    },
    groupNew: e => {
        const dom = sue.apps.editBoxInit(e, { type: "new" });
        const _span = sue.apps.domCreate("span", null, null, null, null, sue.apps.i18n("extmgm_groupname")),
            _text = sue.apps.domCreate("input", { setName: ["type"], setValue: ["text"] }, null, null, null, null);
        dom.appendChild(_span);
        dom.appendChild(_text);
    },
    groupEdit: e => {
        const dom = sue.apps.editBoxInit(e, {
            type: "edit",
            id: e.target.dataset.id.toString(),
        });
        const _span = sue.apps.domCreate("span", null, null, null, null, sue.apps.i18n("extmgm_groupname")),
            _text = sue.apps.domCreate("input", {
                setName: ["type", "value"],
                setValue: ["text", sue.apps.extmgm.config.exts[e.target.dataset.id].gpname],
            });
        dom.appendChild(_span);
        dom.appendChild(_text);
    },
    groupDel: e => {
        const dom = sue.apps.getAPPboxEle(e);
        const _id = e.target.dataset.id;
        sue.apps.extmgm.config.exts.splice(_id, 1);
        sue.apps.extmgm.confSave();
        sue.apps.extmgm.groupInit(e);
    },
    groupSetCur: (e, id) => {
        const _lis = sue.apps.getAPPboxEle(e).querySelectorAll(".su_extmgm_groupul li.su_extmgm_groupli");
        for (var i = 0; i < _lis.length; i++) {
            if (id == Number.parseInt(_lis[i].dataset.id)) {
                _lis[i].classList.add("su_extmgm_grouplicur");
            } else {
                _lis[i].classList.contains("su_extmgm_grouplicur")
                    ? _lis[i].classList.remove("su_extmgm_grouplicur")
                    : null;
            }
        }
    },
    more: e => {
        console.log(e);
        const _type = e.target.dataset.type;
        sue.apps.extmgm.moreSetCur(e, e.target.dataset.id);
        sue.apps.extmgm["more" + _type](e);
    },
    moreSetCur: (e, id) => {
        const _lis = sue.apps.getAPPboxEle(e).querySelectorAll(".su_extmgm_moreul li.su_extmgm_moreli");
        for (var i = 0; i < _lis.length; i++) {
            if (id == Number.parseInt(_lis[i].dataset.id)) {
                _lis[i].classList.add("su_extmgm_morelicur");
            } else {
                _lis[i].classList.contains("su_extmgm_morelicur")
                    ? _lis[i].classList.remove("su_extmgm_morelicur")
                    : null;
            }
        }
    },
    moreLast: e => {
        console.log("morelast");
        const _dom = sue.apps.getAPPboxEle(e).querySelector(".su_extmgm_box");
        if (_dom.querySelector(".su_extmgm_itemul")) {
            _dom.querySelector(".su_extmgm_itemul").textContent = "";
        } else {
            _dom.appendChild(
                sue.apps.domCreate("ul", {
                    setName: ["className"],
                    setValue: ["su_extmgm_itemul"],
                })
            );
        }
        const _ul = _dom.querySelector(".su_extmgm_itemul");
        // _ul.dataset.id=id;
        //delete class before
        _ul.className = "su_extmgm_itemul";

        chrome.runtime.sendMessage(
            {
                type: "appsAction",
                app: "extmgm",
                action: "getAllExt",
                extsLast: sue.apps.extmgm.cons.extLast,
            },
            response => {
                if (!response || !response.exts || !response.exts.length) {
                    return;
                }

                const _uldis = _dom.querySelector(".su_extmgm_itemuldis");
                if (_uldis) {
                    _uldis.remove();
                }

                //let _exts=sue.apps.extmgm.cons.lastenabled;
                const _exts = response.exts;
                console.log(_exts);
                console.log(sue.apps.extmgm.cons.extLast);
                for (var i = 0; i < sue.apps.extmgm.cons.extLast.length; i++) {
                    for (var ii = 0; ii < _exts.length; ii++) {
                        if (sue.apps.extmgm.cons.extLast[i] == _exts[ii].id) {
                            var _li = sue.apps.domCreate(
                                "li",
                                { setName: ["className"], setValue: ["su_extmgm_itemli"] },
                                null,
                                null,
                                { setName: ["id"], setValue: [_exts[ii].id] }
                            );
                            var _div = sue.apps.domCreate(
                                "div",
                                { setName: ["className"], setValue: ["su_extmgm_item"] },
                                null,
                                null,
                                { setName: ["id"], setValue: [_exts[ii].id] }
                            );
                            var _img = sue.apps.domCreate("img", {
                                setName: ["src"],
                                setValue: [
                                    _exts[ii].iconBase64
                                        ? _exts[ii].iconBase64
                                        : chrome.runtime.getURL("image/extension.svg"),
                                ],
                            });
                            var _span = sue.apps.domCreate(
                                "span",
                                { setName: ["className"], setValue: ["su_extmgm_itemname"] },
                                null,
                                null,
                                null,
                                _exts[ii].name
                            );
                            var _spanAction = sue.apps.domCreate("span", {
                                setName: ["className"],
                                setValue: ["su_extmgm_itemaction"],
                            });
                            var _actionOpt = sue.apps.domCreate(
                                "img",
                                {
                                    setName: ["src", "title", "className"],
                                    setValue: [
                                        chrome.runtime.getURL("image/options.svg"),
                                        sue.apps.i18n("extmgm_tipoption"),
                                        "su_extmgm_itemopturl",
                                    ],
                                },
                                null,
                                null,
                                { setName: ["url"], setValue: [_exts[ii].optionsUrl] }
                            );
                            var _actionUninstall = sue.apps.domCreate(
                                "img",
                                {
                                    setName: ["src", "title", "className"],
                                    setValue: [
                                        chrome.runtime.getURL("image/uninstall.svg"),
                                        sue.apps.i18n("extmgm_tipuninstall"),
                                        "su_extmgm_itemuninstall",
                                    ],
                                },
                                null,
                                null,
                                { setName: ["id"], setValue: [_exts[ii].id] }
                            );
                            _div.appendChild(_img);
                            _div.appendChild(_span);

                            // _spanAction.appendChild(_actionDis);
                            _exts[ii].optionsUrl && !sue.apps.extmgm.cons.editMode
                                ? _spanAction.appendChild(_actionOpt)
                                : null;
                            _spanAction.appendChild(_actionUninstall);
                            _div.appendChild(_spanAction);

                            _li.appendChild(_div);
                            _ul.appendChild(_li);
                            continue;
                        }
                    }
                }
                for (var i = 0; i < _exts.length; i++) {
                    break;
                    var _li = sue.apps.domCreate(
                        "li",
                        { setName: ["className"], setValue: ["su_extmgm_itemli"] },
                        null,
                        null,
                        { setName: ["id"], setValue: [_exts[i].id] }
                    );
                    var _div = sue.apps.domCreate(
                        "div",
                        { setName: ["className"], setValue: ["su_extmgm_item"] },
                        null,
                        null,
                        { setName: ["id"], setValue: [_exts[i].id] }
                    );
                    var _img = sue.apps.domCreate("img", {
                        setName: ["src"],
                        setValue: [
                            _exts[i].iconBase64 ? _exts[i].iconBase64 : chrome.runtime.getURL("image/extension.svg"),
                        ],
                    });
                    var _span = sue.apps.domCreate(
                        "span",
                        { setName: ["className"], setValue: ["su_extmgm_itemname"] },
                        null,
                        null,
                        null,
                        _exts[i].name
                    );
                    var _spanAction = sue.apps.domCreate("span", {
                        setName: ["className"],
                        setValue: ["su_extmgm_itemaction"],
                    });
                    // var _actionDis=sue.apps.domCreate("img",{setName:["src","title","className"],setValue:[chrome.runtime.getURL("image/disable.svg"),sue.apps.i18n("extmgm_tipdisable"),"su_extmgm_itemdisable"]},null,null,{setName:["id"],setValue:[_exts[i].id]});
                    var _actionOpt = sue.apps.domCreate(
                        "img",
                        {
                            setName: ["src", "title", "className"],
                            setValue: [
                                chrome.runtime.getURL("image/options.svg"),
                                sue.apps.i18n("extmgm_tipoption"),
                                "su_extmgm_itemopturl",
                            ],
                        },
                        null,
                        null,
                        { setName: ["url"], setValue: [_exts[i].optionsUrl] }
                    );
                    var _actionUninstall = sue.apps.domCreate(
                        "img",
                        {
                            setName: ["src", "title", "className"],
                            setValue: [
                                chrome.runtime.getURL("image/uninstall.svg"),
                                sue.apps.i18n("extmgm_tipuninstall"),
                                "su_extmgm_itemuninstall",
                            ],
                        },
                        null,
                        null,
                        { setName: ["id"], setValue: [_exts[i].id] }
                    );
                    _div.appendChild(_img);
                    _div.appendChild(_span);

                    // _spanAction.appendChild(_actionDis);
                    _exts[i].optionsUrl && !sue.apps.extmgm.cons.editMode ? _spanAction.appendChild(_actionOpt) : null;
                    _spanAction.appendChild(_actionUninstall);
                    _div.appendChild(_spanAction);

                    _li.appendChild(_div);
                    _ul.appendChild(_li);
                }
            }
        );
        sue.apps.initPos(e);
    },
    moreAlways: e => {
        const _dom = sue.apps.getAPPboxEle(e).querySelector(".su_extmgm_box");
        if (_dom.querySelector(".su_extmgm_itemul")) {
            _dom.querySelector(".su_extmgm_itemul").textContent = "";
        } else {
            _dom.appendChild(
                sue.apps.domCreate("ul", {
                    setName: ["className"],
                    setValue: ["su_extmgm_itemul"],
                })
            );
        }
        const _ul = _dom.querySelector(".su_extmgm_itemul");
        // _ul.dataset.id=id;
        //delete class before
        _ul.className = "su_extmgm_itemul";

        chrome.runtime.sendMessage({ type: "appsAction", app: "extmgm", action: "getAllExt" }, response => {
            if (!response || !response.exts || !response.exts.length) {
                return;
            }

            let _uldis = _dom.querySelector(".su_extmgm_itemuldis");
            if (_uldis) {
                _uldis.textContent = "";
            } else {
                _uldis = sue.apps.domCreate("ul", {
                    setName: ["className"],
                    setValue: ["su_extmgm_itemuldis"],
                });
                _dom.appendChild(_uldis);
            }
            // _uldis.dataset.id=id;

            const _exts = response.exts;
            console.log(_uldis);
            for (var i = 0; i < _exts.length; i++) {
                if (sue.apps.extmgm.config.always.contains(_exts[i].id)) {
                    var _li = sue.apps.domCreate(
                        "li",
                        { setName: ["className"], setValue: ["su_extmgm_itemli"] },
                        null,
                        null,
                        { setName: ["id"], setValue: [_exts[i].id] }
                    );
                    var _div = sue.apps.domCreate(
                        "div",
                        { setName: ["className"], setValue: ["su_extmgm_item"] },
                        null,
                        null,
                        { setName: ["id"], setValue: [_exts[i].id] }
                    );
                    var _img = sue.apps.domCreate("img", {
                        setName: ["src"],
                        setValue: [
                            _exts[i].iconBase64 ? _exts[i].iconBase64 : chrome.runtime.getURL("image/extension.svg"),
                        ],
                    });
                    var _span = sue.apps.domCreate(
                        "span",
                        { setName: ["className"], setValue: ["su_extmgm_itemname"] },
                        null,
                        null,
                        null,
                        _exts[i].name
                    );
                    var _spanAction = sue.apps.domCreate("span", {
                        setName: ["className"],
                        setValue: ["su_extmgm_itemaction"],
                    });
                    var _actionDis = sue.apps.domCreate(
                        "img",
                        {
                            setName: ["src", "title", "className"],
                            setValue: [
                                chrome.runtime.getURL("image/disable.svg"),
                                sue.apps.i18n("extmgm_tipdisable"),
                                "su_extmgm_itemdisable",
                            ],
                        },
                        null,
                        null,
                        { setName: ["id", "type"], setValue: [_exts[i].id, "always"] }
                    );
                    var _actionOpt = sue.apps.domCreate(
                        "img",
                        {
                            setName: ["src", "title", "className"],
                            setValue: [
                                chrome.runtime.getURL("image/options.svg"),
                                sue.apps.i18n("extmgm_tipoption"),
                                "su_extmgm_itemopturl",
                            ],
                        },
                        null,
                        null,
                        { setName: ["url"], setValue: [_exts[i].optionsUrl] }
                    );
                    var _actionUninstall = sue.apps.domCreate(
                        "img",
                        {
                            setName: ["src", "title", "className"],
                            setValue: [
                                chrome.runtime.getURL("image/uninstall.svg"),
                                sue.apps.i18n("extmgm_tipuninstall"),
                                "su_extmgm_itemuninstall",
                            ],
                        },
                        null,
                        null,
                        { setName: ["id"], setValue: [_exts[i].id] }
                    );
                    _div.appendChild(_img);
                    _div.appendChild(_span);

                    _spanAction.appendChild(_actionDis);
                    _exts[i].optionsUrl && !sue.apps.extmgm.cons.editMode ? _spanAction.appendChild(_actionOpt) : null;
                    _spanAction.appendChild(_actionUninstall);
                    _div.appendChild(_spanAction);

                    _li.appendChild(_div);
                    _ul.appendChild(_li);
                    continue;
                } else {
                    var _li = sue.apps.domCreate(
                        "li",
                        { setName: ["className"], setValue: ["su_extmgm_itemli"] },
                        null,
                        null,
                        { setName: ["id"], setValue: [_exts[i].id] }
                    );
                    var _div = sue.apps.domCreate(
                        "div",
                        { setName: ["className"], setValue: ["su_extmgm_item"] },
                        null,
                        null,
                        { setName: ["id"], setValue: [_exts[i].id] }
                    );
                    var _img = sue.apps.domCreate("img", {
                        setName: ["src"],
                        setValue: [
                            _exts[i].iconBase64 ? _exts[i].iconBase64 : chrome.runtime.getURL("image/extension.svg"),
                        ],
                    });
                    var _span = sue.apps.domCreate(
                        "span",
                        { setName: ["className"], setValue: ["su_extmgm_itemname"] },
                        null,
                        null,
                        null,
                        _exts[i].name
                    );
                    var _spanAction = sue.apps.domCreate("span", {
                        setName: ["className"],
                        setValue: ["su_extmgm_itemaction"],
                    });
                    var _actionDis = sue.apps.domCreate(
                        "img",
                        {
                            setName: ["src", "title", "className"],
                            setValue: [
                                chrome.runtime.getURL("image/enable.svg"),
                                sue.apps.i18n("extmgm_tipenable"),
                                "su_extmgm_itemenable",
                            ],
                        },
                        null,
                        null,
                        { setName: ["id", "type"], setValue: [_exts[i].id, "always"] }
                    );
                    // var _actionOpt=sue.apps.domCreate("img",{setName:["src","title"],setValue:[chrome.runtime.getURL("image/options.svg"),sue.apps.i18n("extmgm_tipoption")]},null,null,{setName:["url"],setValue:[_exts[i].optionsUrl]});
                    var _actionUninstall = sue.apps.domCreate(
                        "img",
                        {
                            setName: ["src", "title", "className"],
                            setValue: [
                                chrome.runtime.getURL("image/uninstall.svg"),
                                sue.apps.i18n("extmgm_tipuninstall"),
                                "su_extmgm_itemuninstall",
                            ],
                        },
                        null,
                        null,
                        { setName: ["id"], setValue: [_exts[i].id] }
                    );
                    _div.appendChild(_img);
                    _div.appendChild(_span);

                    _spanAction.appendChild(_actionDis);
                    // _exts[i].optionsUrl?_spanAction.appendChild(_actionOpt):null;
                    _spanAction.appendChild(_actionUninstall);
                    _div.appendChild(_spanAction);

                    _li.appendChild(_div);
                    _uldis.appendChild(_li);
                }
            }
            sue.apps.initPos(e);
            sue.apps.extmgm.moreAlwaysSort(e);
        });
    },
    moreAlwaysSort: e => {
        const _dom = sue.apps.getAPPboxEle(e);
        sue.apps.extmgm.cons.sortItemEnabled = Sortable.create(
            sue.apps.getAPPboxEle(e).querySelector(".su_extmgm_itemul"),
            {
                animation: 200,
                easing: "ease-in-out",
                ghostClass: "su_sortable_list",
                chosenClass: "su_sortable_list",
                group: {
                    name: "enabled",
                    put: ["disabled"],
                },
                onAdd: e => {
                    console.log(e);
                    const item = e.item.querySelectorAll(".su_extmgm_itemaction img")[0];
                    item.src = chrome.runtime.getURL("image/disable.svg");
                    item.title = sue.apps.i18n("extmgm_tipdisable");
                    item.className = "su_extmgm_itemdisable";
                },
                onSort: e => {
                    console.log(e);
                    const _lis = e.target.querySelectorAll("li");
                    const _ids = [];
                    for (var i = 0; i < _lis.length; i++) {
                        _ids.push(_lis[i].dataset.id);
                    }
                    sue.apps.extmgm.config.always = _ids;
                    sue.apps.extmgm.confSave();
                },
            }
        );
        sue.apps.extmgm.cons.sortItemDisabled = Sortable.create(
            sue.apps.getAPPboxEle(e).querySelector(".su_extmgm_itemuldis"),
            {
                animation: 200,
                easing: "ease-in-out",
                ghostClass: "su_sortable_list",
                chosenClass: "su_sortable_list",
                group: {
                    name: "disabled",
                    put: ["enabled"],
                },
                onAdd: e => {
                    console.log(e);
                    const item = e.item.querySelectorAll(".su_extmgm_itemaction img")[0];
                    item.src = chrome.runtime.getURL("image/enable.svg");
                    item.title = sue.apps.i18n("extmgm_tipenable");
                    item.className = "su_extmgm_itemenable";
                },
            }
        );
    },
    moreEnableall: e => {
        if (sue.apps.extmgm.config.n_enableallconfirm) {
            if (window.confirm(sue.apps.i18n("extmgm_confirmenableall"))) {
                chrome.runtime.sendMessage({
                    type: "appsAction",
                    app: "extmgm",
                    action: "enableAll",
                });
                sue.apps.extmgm.firstItem(e);
            }
        } else {
            chrome.runtime.sendMessage({
                type: "appsAction",
                app: "extmgm",
                action: "enableAll",
            });
            sue.apps.extmgm.firstItem(e);
        }
    },
    moreDisableall: e => {
        if (sue.apps.extmgm.config.n_disableallconfirm) {
            if (window.confirm(sue.apps.i18n("extmgm_confirmdisableall"))) {
                chrome.runtime.sendMessage({
                    type: "appsAction",
                    app: "extmgm",
                    action: "disableAll",
                });
                sue.apps.extmgm.firstItem(e);
            }
        } else {
            chrome.runtime.sendMessage({
                type: "appsAction",
                app: "extmgm",
                action: "disableAll",
            });
            sue.apps.extmgm.firstItem(e);
        }
    },
    btnAction: e => {
        const getType = e => {
            const ele = e.target || e;
            if (ele.classList.contains("su_editbox") && ele.dataset && ele.dataset.type) {
                return ele.dataset.type;
            } else {
                return getType(ele.parentNode);
            }
        };
        const getDataSet = (e, datatype) => {
            const ele = e.target || e;
            if (ele.dataset && ele.dataset[datatype]) {
                return ele.dataset[datatype];
            } else {
                return getDataSet(ele.parentNode, datatype);
            }
        };
        const groupNew = e => {
            const _dom = sue.apps.getAPPboxEle(e);
            const _id = _dom.querySelectorAll(".su_extmgm_groupul li").length;
            const _new = {
                gpname: _dom.querySelector("input[type=text]").value,
                id: [],
            };
            sue.apps.extmgm.config.exts.push(_new);
            sue.apps.extmgm.confSave();
            sue.apps.extmgm.groupInit(e);
            sue.apps.editBoxClose(e);
        };
        const groupEdit = e => {
            const _dom = sue.apps.getAPPboxEle(e);
            console.log(getDataSet(e, "id"));
            sue.apps.extmgm.config.exts[getDataSet(e, "id")].gpname = _dom.querySelector("input[type=text]").value;
            sue.apps.extmgm.confSave();
            sue.apps.extmgm.groupInit(e);
            sue.apps.editBoxClose(e);
        };
        const _type = getType(e);
        switch (_type) {
            case "new":
                groupNew(e);
                break;
            case "edit":
                groupEdit(e);
                break;
        }
    },
    confSave: () => {
        console.log(sue.apps.extmgm.config);
        chrome.runtime.sendMessage({
            type: "apps_saveconf",
            apptype: "extmgm",
            config: sue.apps.extmgm.config,
        });
    },
    handleEvent: e => {
        switch (e.type) {
            case "click":
                if (e.target.classList.contains("menu_item_extmgmgroup")) {
                    sue.apps.extmgm.showGroupPanel(e);
                } else if (e.target.classList.contains("menu_item_extmgmmore")) {
                    sue.apps.extmgm.showMorePanel(e);
                } else if (e.target.classList.contains("su_extmgm_itemfirst")) {
                    sue.apps.extmgm.itemInit(sue.apps.getAPPboxEle(e), e.target.dataset.id);
                } else if (e.target.classList.contains("su_extmgm_groupitem")) {
                    sue.apps.extmgm.itemInit(sue.apps.getAPPboxEle(e), e.target.dataset.id);
                    sue.apps.extmgm.showGroupPanel(e);
                    sue.apps.extmgm.moreSetCur(e, -1);
                } else if (e.target.classList.contains("su_extmgm_groupedit")) {
                    sue.apps.extmgm.groupEdit(e);
                } else if (e.target.classList.contains("su_extmgm_groupdel")) {
                    sue.apps.extmgm.groupDel(e);
                } else if (e.target.classList.contains("menu_item_extmgmedit")) {
                    sue.apps.extmgm.editMode(e);
                } else if (e.target.classList.contains("su_extmgm_groupaddbtn")) {
                    sue.apps.extmgm.groupNew(e);
                } else if (e.target.classList.contains("su_editbtnadd")) {
                    sue.apps.extmgm.btnAction(e);
                } else if (e.target.classList.contains("su_editbtncancel")) {
                    sue.apps.editBoxClose(e);
                } else if (e.target.classList.contains("su_extmgm_itemenable")) {
                    sue.apps.extmgm.itemEnable(e);
                } else if (e.target.classList.contains("su_extmgm_itemdisable")) {
                    sue.apps.extmgm.itemDisable(e);
                } else if (e.target.classList.contains("su_extmgm_itemopturl")) {
                    sue.apps.extmgm.itemOpturl(e);
                } else if (e.target.classList.contains("su_extmgm_itemuninstall")) {
                    sue.apps.extmgm.itemUninstall(e);
                } else if (e.target.classList.contains("su_extmgm_moreitem")) {
                    sue.apps.extmgm.showMorePanel(e);
                    sue.apps.extmgm.more(e);
                    sue.apps.extmgm.groupSetCur(e, -1);
                }
                break;
        }
    },
    editMode: e => {
        if (e.target.classList.contains("su_extmgm_editmode")) {
            e.target.classList.remove("su_extmgm_editmode");
            sue.apps.extmgm.cons.editMode = false;
            sue.apps.getAPPboxEle(e).querySelector(".su_title").textContent = sue.apps.i18n("extmgm");
        } else {
            e.target.classList.add("su_extmgm_editmode");
            sue.apps.extmgm.cons.editMode = true;
            sue.apps.getAPPboxEle(e).querySelector(".su_title").textContent =
                sue.apps.i18n("extmgm") + " (" + sue.apps.i18n("editmode") + ")";
        }
        sue.apps.extmgm.editModeItem(e);
        sue.apps.extmgm.editModeGroup(e);
    },
    editModeItem: e => {
        sue.apps.extmgm.itemInit(e, sue.apps.extmgm.cons.curId);
    },
    editModeGroup: e => {
        sue.apps.extmgm.groupInit(e);
        const _dom = sue.apps.getAPPboxEle(e).querySelector(".su_extmgm_boxgroup");
        const _domAddbtn = _dom.querySelector(".su_extmgm_groupaddbtn");
        if (sue.apps.extmgm.cons.editMode) {
            if (!_domAddbtn) {
                const _listAddBtn = sue.apps.domCreate(
                    "div",
                    { setName: ["className"], setValue: ["su_extmgm_groupaddbtn"] },
                    null,
                    "background:url(" + chrome.runtime.getURL("image/add.svg") + ") no-repeat 2px 5px #e7e9fd;",
                    null,
                    sue.apps.i18n("extmgm_newgroup")
                );
                _dom.insertBefore(_listAddBtn, _dom.querySelector(".su_extmgm_boxall"));
            }
        } else {
            const _listAddBtn = _dom.querySelector(".su_extmgm_groupaddbtn");
            _listAddBtn ? _listAddBtn.remove() : null;
        }

        if (sue.apps.extmgm.cons.editMode) {
            console.log(sue.apps.getAPPboxEle(e));
            sue.apps.extmgm.cons.sortGroup = Sortable.create(
                sue.apps.getAPPboxEle(e).querySelector(".su_extmgm_groupul"),
                {
                    animation: 200,
                    easing: "ease-in-out",
                    ghostClass: "su_sortable_list",
                    chosenClass: "su_sortable_list",
                    onMove: (/**Event*/ evt, /**Event*/ originalEvent) => {},
                    onEnd: evt => {},
                    onSort: (/**Event*/ evt) => {},
                }
            );
        }
    },
    showGroupPanel: e => {
        const _dom = sue.apps.getAPPboxEle(e);
        const _domGroup = _dom.querySelector(".su_extmgm_boxgroup"),
            _domMore = _dom.querySelector(".su_extmgm_boxmore");
        _domGroup.style.display = window.getComputedStyle(_domGroup).display == "none" ? "block" : "none";
        _domMore.style.display = "none";
    },
    showMorePanel: e => {
        const _dom = sue.apps.getAPPboxEle(e);
        const _domGroup = _dom.querySelector(".su_extmgm_boxgroup"),
            _domMore = _dom.querySelector(".su_extmgm_boxmore");

        _domMore.style.display = window.getComputedStyle(_domMore).display == "none" ? "block" : "none";
        _domGroup.style.display = "none";
    },
};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "itemUninstall":
            console.log(message);
            const _id = message.id;
            const _extId = message.extId;
            // remove form cur group
            for (var i = 0; i < sue.apps.extmgm.config.exts[_id].id.length; i++) {
                if (sue.apps.extmgm.config.exts[_id].id[i] == _extId) {
                    sue.apps.extmgm.config.exts[_id].id.splice(i, 1);
                    sue.apps.extmgm.itemInit(sue.apps.extmgm.dom, sue.apps.extmgm.cons.curId);
                    sue.apps.extmgm.confSave();
                    break;
                }
            }
            break;
    }
});
chrome.runtime.sendMessage({ type: "apps_getvalue", apptype: "extmgm" }, response => {
    console.log(response);
    sue.apps.extmgm.config = response.config;
    sue.apps.extmgm.cons.extLast = response.value?.extLast;
    sue.apps.extmgm.extID = response.value?.extID;
    sue.apps.extmgm.initUI();
});
