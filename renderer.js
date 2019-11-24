// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

console.log("binding functions");
document.getElementById("startButton").addEventListener("click", function() { retrieveData() }, false);
document.getElementById("copyButton").addEventListener("click", function() { copyPlaceholder() }, false);
document.getElementById("dataTypes").addEventListener("change", function() { changeUrl() }, false);
console.log("binded!");

const removeDivChilds = function() {
  const node = document.getElementById("retrievedData");
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

const changeUrl = function() {
  let selector = document.getElementById("dataTypes");
  let n = selector.selectedIndex;
  let inp = document.getElementById("data");
  switch(n) {
    case 0:
      inp.value = "";
      inp.placeholder = "http://www.eunet.lv/library/win/BULGAKOW/master97_engl.txt";
      break;
    case 1:
      inp.value = "";
      inp.placeholder = "https://cdn.crunchify.com/wp-content/uploads/code/json.sample.txt";
      break;
    case 2:
      inp.value = "";
      inp.placeholder = "https://example.url";
      break;
    case 3:
      inp.value = "";
      inp.placeholder = "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/IMG_%28business%29.svg/1200px-IMG_%28business%29.svg.png";
      break;
  }
}

const copyPlaceholder = function() {
  document.getElementById("data").value = document.getElementById("data").placeholder;
}

const retrieveData = async function() {
  let selector = document.getElementById("dataTypes");
  let n = selector.selectedIndex;
  let url = document.getElementById("data").value;
  if (!url) {
    console.log("no url provided");
    let p = document.createElement("p");
    p.innerText = "No url provided!"
    p.style = "font-weight:bold;"

    removeDivChilds();

    document.getElementById("retrievedData").appendChild(p);
    setTimeout(() => {
      p.remove();
    }, 3000);

    return -1;
  }
  else {
    console.log("fetching " + selector[n].value + "\nfrom " + url);
    let response = await fetch(url);

    if (response.ok) {
      switch(selector[n].value) {
        case "text":
          retrieveText(response);
          break;
        case "JSON":
          retrieveJSON(response);
          break;
        case "formData":
          retrieveFormData(response);
          break;
        case "blob (img only)":
          retrieveBlob(response);
          break;
      }
    }
    else {
      let p = document.createElement("p");
      p.innerText = "Bad url!"
      p.style = "font-weight:bold;"

      removeDivChilds();

      document.getElementById("retrievedData").appendChild(p);
      setTimeout(() => {
        p.remove();
      }, 3000);
    }
  }
}

const retrieveText = async function(response) {
  let text = await response.text();
  let p = document.createElement("pre");
  p.innerText = text;

  removeDivChilds();

  document.getElementById("retrievedData").appendChild(p);
  setTimeout(() => {
    p.remove();
  }, 20000);
}

const retrieveJSON = async function(response) {
  let j = await response.json();
  j = JSON.stringify(j, null, 2);
  let p = document.createElement("pre");
  p.innerText = j;

  removeDivChilds();

  document.getElementById("retrievedData").appendChild(p);
  setTimeout(() => {
    p.remove();
  }, 20000);
}

const retrieveBlob = async function(response) {
  let blob = await response.blob();
  console.log("drawing image");
  let img = new Image();
  img = document.createElement("img");
  img.setAttribute("id", "img");
  img.style = "position:fixed;max-width:760px;max-height:440px";
  img.src = URL.createObjectURL(blob);

  removeDivChilds();

  document.getElementById("retrievedData").appendChild(img);
  setTimeout(() => {
    img.remove();
    URL.revokeObjectURL(img.src);
  }, 10000);
}

const retrieveFormData = async function(response) {
  let fd = await response.formData();
  let text = "";
  for (let [type, name, val] of fd) {
    if (type != "blob") {
      text = text.concat(type, ": ", name, " = ", val, "\n");
    }
    else {
      text = text.concat(type, ": ", name, "\n");
    }
  }
  let p = document.createElement("pre");
  p.innerText = text;

  removeDivChilds();

  document.getElementById("retrievedData").appendChild(p);
  setTimeout(() => {
    p.remove();
  }, 20000);
}
