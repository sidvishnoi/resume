// Google Analytics, based on https://minimalanalytics.com/
(function (trackingId) {
  const win = window;
  const doc = document;
  const nav = navigator || {};
  const storage = localStorage;
  const encode = encodeURIComponent;
  const generateId = () => Math.random().toString(36);
  const getId = () => {
    if (!storage.cid) {
      storage.cid = generateId();
    }
    return storage.cid;
  };
  const serialize = obj => {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (obj[p] !== undefined) {
          str.push(encode(p) + "=" + encode(obj[p]));
        }
      }
    }
    return str.join("&");
  };
  win.addEventListener("unload", () => {
    const url = "https://www.google-analytics.com/collect";
    const data = serialize({
      v: "1",
      ds: "web",
      tid: trackingId,
      cid: getId(),
      t: "pageview",
      dr: doc.referrer || undefined,
      dt: doc.title,
      dl: doc.location.origin + doc.location.pathname + doc.location.search,
      ul: (nav.language || "").toLowerCase(),
      de: doc.characterSet,
      sr: `${(win.screen || {}).width}x${(win.screen || {}).height}`,
      vp: `${(win.visualViewport || {}).width}x${
        (win.visualViewport || {}).height
      }`,
    });
    nav.sendBeacon(url, data);
  });
})("UA-145303628-1");
