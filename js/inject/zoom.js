var fn_zoom = {
    init: () => {
        chrome.runtime.sendMessage({ type: "zoom" }, response => {
            var s_value = response.value;
            fn_zoom.s_fn[s_value]();
        });
    },
    s_fn: {
        s_in: () => {
            !document.body.style.zoom ? (document.body.style.zoom = 1.1) : null;
            Math.abs(document.body.style.zoom) < 1.5
                ? (document.body.style.zoom = Math.abs(document.body.style.zoom) + 0.1)
                : (document.body.style.zoom = Math.abs(document.body.style.zoom) + 0.5);
            Math.abs(document.body.style.zoom) > 3 ? (document.body.style.zoom = 1) : null;
        },
        s_out: () => {
            !document.body.style.zoom ? (document.body.style.zoom = 0.9) : null;
            Math.abs(document.body.style.zoom) > 0.5
                ? (document.body.style.zoom = Math.abs(document.body.style.zoom) - 0.1)
                : (document.body.style.zoom = Math.abs(document.body.style.zoom) - 0.2);
            Math.abs(document.body.style.zoom) < 0.2 ? (document.body.style.zoom = 1) : null;
        },
        s_reset: () => {
            document.body.style.zoom = 1;
        },
    },
};
fn_zoom.init();
