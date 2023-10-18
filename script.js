const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("v");

//From https://stackoverflow.com/a/61511955
function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

var replaced = false;
waitForElm(".ytd-enforcement-message-view-model").then(() => {
  if (!replaced) {
    document.getElementById(
      "player"
    ).outerHTML = `<iframe style="width: 100%; aspect-ratio: 16 / 9;" src="https://www.youtube.com/embed/${videoId}?autoplay=1" title=${videoId} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  }
  replaced = true;
});
