console.log("convertcase");
sue.apps.convertcase = {
    cons: {},
    initUI: function () {
        const appInfo = {
            appName: "convertcase",
            headTitle: "convertcase",
            headCloseBtn: true,
        };
        sue.apps.init();
        var dom = sue.apps.initBox(appInfo);
        dom.id = "su_apps_" + appInfo.appName;
        sue.apps[appInfo.appName].dom = dom;
        sue.apps.initPos(dom);

        const theAppBox = sue.apps.domCreate("div", {
            setName: ["className"],
            setValue: ["su_convertcase_box"],
        });
        dom.querySelector(".su_main").appendChild(theAppBox);

        const _boxIn = sue.apps.domCreate("textarea", {
                setName: ["id"],
                setValue: ["convertcase_textarea_in"],
            }),
            _btnU = sue.apps.domCreate(
                "button",
                { setName: ["id"], setValue: ["convertcase_btn_upper"] },
                null,
                null,
                null,
                sue.apps.i18n("btn_upper")
            ),
            _btnL = sue.apps.domCreate(
                "button",
                { setName: ["id"], setValue: ["convertcase_btn_lower"] },
                null,
                null,
                null,
                sue.apps.i18n("btn_lower")
            ),
            _boxOut = sue.apps.domCreate("textarea", {
                setName: ["id"],
                setValue: ["convertcase_textarea_out"],
            });

        theAppBox.appendChild(_boxIn);
        theAppBox.appendChild(sue.apps.domCreate("br"));
        theAppBox.appendChild(_btnU);
        theAppBox.appendChild(_btnL);
        theAppBox.appendChild(sue.apps.domCreate("br"));
        theAppBox.appendChild(_boxOut);
        dom.addEventListener("click", this.handleEvent, false);
    },
    handleEvent: e => {
        switch (e.type) {
            case "click":
                if (e.target.id == "convertcase_btn_upper") {
                    sue.apps.convertcase.dom.querySelector("#convertcase_textarea_out").value = sue.apps.convertcase.dom
                        .querySelector("#convertcase_textarea_in")
                        .value.toUpperCase();
                } else if (e.target.id == "convertcase_btn_lower") {
                    sue.apps.convertcase.dom.querySelector("#convertcase_textarea_out").value = sue.apps.convertcase.dom
                        .querySelector("#convertcase_textarea_in")
                        .value.toLowerCase();
                }
        }
    },
};
sue.apps.convertcase.initUI();
