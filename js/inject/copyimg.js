var fn_copyimg = {
    init: async () => {
        const port = await fn_copyimg.openPort();
        port.postMessage({ type: "fn_copyimg" });
        port.onMessage.addListener(msg => {
            fn_copyimg.copyImage(msg);
        });
    },
    openPort: async () => {
        for (; ; await new Promise(resolve => setTimeout(resolve, 100))) {
            try {
                return chrome.runtime.connect({ name: "fn_copyimg" });
            } catch {}
        }
    },
    copyImage: async imageURL => {
        const _img = await fetch(imageURL);
        const _blob = await _img.blob(_img);
        const _base64 = await fn_copyimg.blob2canvas(_blob);
        const item = new ClipboardItem({ "image/png": _base64 });
        try {
            await navigator.clipboard.write([item]);
        } catch (error) {
            // Raises "NotAllowedError: Failed to execute 'write' on 'Clipboard': Document is not focused."
            // But it copies the content anyway, so we can ignore this error
            if (error.name !== "NotAllowedError") {
                throw error;
            }
        }
    },
    blob2canvas: blob => {
        console.log(blob);
        var img = new Image();
        var c = document.createElement("canvas");
        var ctx = c.getContext("2d");
        img.src = URL.createObjectURL(blob);
        console.log(img);
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
        return new Promise(resolve => {
            img.onload = function () {
                c.width = this.naturalWidth;
                c.height = this.naturalHeight;
                ctx.drawImage(this, 0, 0, c.width, c.height);
                c.toBlob(
                    blob => {
                        resolve(blob);
                    },
                    "image/png",
                    1
                );
            };
        });
    },
};

fn_copyimg.init();
