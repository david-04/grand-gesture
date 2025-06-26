const getBackup = {
    init: function () {
        window.addEventListener("click", this.handleEvent, false);
    },
    handleEvent: e => {
        switch (e.type) {
            case "click":
                if (e.target.id == "btn_get") {
                    getBackup.set();
                }
                break;
        }
    },
    set: () => {
        document.querySelector("#url").textContent = "";
        document.querySelector("#msgbox").innerText = "";
        const dbname = "backup",
            id = Number.parseInt(document.querySelector("#text_ver").value);
        domURL = document.createElement("a");
        const request = indexedDB.open(dbname, 1);
        request.onsuccess = e => {
            db = e.target.result;
            var dbobj = db.transaction(["config"], "readwrite").objectStore("config");
            var dbget = dbobj.get(id);
            dbget.onsuccess = e => {
                if (e.target.result) {
                    _conf = e.target.result.config;
                    var blob = new Blob([JSON.stringify(_conf)]);
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = e => {
                        var str = e.target.result.substr(13);
                        var newBlob = new Blob([str]);
                        domURL.id = "btn_export";
                        domURL.href = window.URL.createObjectURL(newBlob);
                        domURL.download = "smartup.backup" + id;
                        domURL.textContent = "Download the backup data";
                        document.querySelector("#url").appendChild(domURL);
                    };
                } else {
                    document.querySelector("#msgbox").innerText =
                        "Don't get any data, you may try to contact the developer get the right version number.";
                }
            };
        };
    },
};
getBackup.init();
