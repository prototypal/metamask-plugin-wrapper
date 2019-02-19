//Test host on github
alert("script loaded")
function submit() {
  window.parent.postMessage("iFrameFunction", "*")
}
