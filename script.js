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
//waitForElm("video.video-stream.html5-main-video").then((element) => { //This is here for testing on non-blocked devices
waitForElm(".ytd-enforcement-message-view-model").then((element) => {
  //Sometimes the blocking popup wont show, and video will play normally, so this script will check that on every page load
  replacePlayer();
});
function replacePlayer() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("v");
  if (!replaced) {
    //setTimeout(() => { //This is here for testing on non-blocked devices

    document.getElementById(
      "player"
    ).outerHTML = `<div id='player' style="width: 100%; aspect-ratio: 16 / 9;"><iframe style="width: 100%; aspect-ratio: 16 / 9;" src="https://www.youtube.com/embed/${videoId}?autoplay=1" title=${videoId} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
    //This is the HTML that will replace the player. Its just the embed code provided by youtube player itself

    setTimeout(() => {
      const nextVideoUrl = document.querySelector(
        "ytd-thumbnail.style-scope.ytd-compact-video-renderer a"
      ).href; //Get the next video URL

      document
        .querySelector("iframe")
        .contentWindow.document.querySelector(
          "video.video-stream.html5-main-video"
        )
        .addEventListener("ended", function (event) {
          //This fires when the video tag inside the iframe ends playing
          setTimeout(() => {
            //After 5 seconds, try to load new video
            if (
              nextVideoUrl && //Check if there is a video to play
              window.scrollY == 0 && //Check if user scrolled down
              window.location.search.includes(videoId) //Check if user switched to another video
            ) {
              window.location.assign(nextVideoUrl);
            }
          }, 5000);
        });
    }, 1000);
    // }, 2000); //This is here for testing on non-blocked devices. Timeout is necessary, because youtube will replace the new code, if you do it right away

    replaced = true; //Prevent replacing the player again
  }
}

//This is a temporary solution, it checks the loading bar at the top of the site for changes
document.addEventListener("transitionend", function (e) {
  let replacedVideo = document
    .querySelector("iframe")
    .contentWindow.document.querySelector(
      "video.video-stream.html5-main-video"
    );
  if (e.target.id === "progress" && replacedVideo) {
    //Switch pages manually ONLY if the custom video player was loaded
    window.location.assign(window.location.href);
  }
});
