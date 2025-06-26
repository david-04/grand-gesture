var config;
var per = {
    begin: () => {
        chrome.runtime.sendMessage({ type: "per_getconf" }, response => {
            if (response) {
                console.log(response);
                config = response;
                per.init();
            }
        });
    },
    getI18n: str => chrome.i18n.getMessage(str) || str,
    init: function () {
        console.log(config);
        per.pers = config.pers ? config.pers : null;
        per.orgs = config.orgs ? config.orgs : null;
        console.log(per.pers);
        //show request permissions
        var strs = "";
        for (var i = 0; per.pers && i < per.pers.length; i++) {
            strs = strs + " " + per.pers[i];
        }
        for (var i = 0; per.orgs && i < per.orgs.length; i++) {
            strs = strs + " " + per.orgs[i];
        }
        document.querySelector("#perlist").textContent = strs;
        document.querySelector("#per_msg").innerText = config.msg ? config.msg : "";

        var i18nOBJ = document.querySelectorAll("[data-i18n]");
        for (var i = 0; i < i18nOBJ.length; i++) {
            var trans = per.getI18n(i18nOBJ[i].dataset.i18n);
            if (!trans) {
                continue;
            }
            if (i18nOBJ[i].tagName.toLowerCase() == "input" && i18nOBJ[i].type == "button") {
                i18nOBJ[i].value = trans;
            } else {
                i18nOBJ[i].textContent = trans;
            }
        }
        window.addEventListener("click", this, false);
        window.addEventListener("unload", this, false);
    },
    handleEvent: e => {
        switch (e.type) {
            case "click":
                if (e.target.id == "getpers") {
                    if (per.pers && per.orgs) {
                        chrome.permissions.request({ permissions: per.pers, origins: per.orgs }, granted => {
                            checkRequest(granted);
                        });
                    } else if (per.pers) {
                        chrome.permissions.request({ permissions: per.pers }, granted => {
                            checkRequest(granted);
                        });
                    } else if (per.orgs) {
                        chrome.permissions.request({ origins: per.orgs }, granted => {
                            checkRequest(granted);
                        });
                    }

                    var checkRequest = granted => {
                        if (granted) {
                            chrome.runtime.sendMessage({ type: "per_clear", pers: per.pers }, response => {});
                            document.querySelector("#perbtnbox").remove();
                            document.querySelector("#perlistbox").style.cssText +=
                                "color:#008800;font-weight:500;margin-bottom:1em;";
                            document.querySelector("#perlistbox").innerText = per.getI18n("getper_after");
                        } else {
                            alert(per.getI18n("getper_fail"));
                            window.close();
                        }
                    };
                }
                break;
            case "unload":
                chrome.runtime.sendMessage({ type: "per_clear", pers: per.pers }, response => {});
                break;
        }
    },
};
per.begin();
