var viewer;

let preset = 1;
let edgbool = true;

function changeBG(bool) {
  if (bool) {
    if (preset <= 16) preset++;
  } else {
    if (preset >= 0) preset--;
  }
  $("#bg").text(preset);
  viewer.setLightPreset(preset);
}

$('#bgPlus').click(function (e) { 
  e.preventDefault();
  alert("bg+");
  console.log("bg+");
});

$('#bgMinus').click(() => {
  changeBG(false);
  console.log("bg-");
});

$('#edges').click(function () {
  viewer.setDisplayEdges((edgbool = !edgbool));
  console.log("edges");
});


function launchViewer(urn) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: [ 'Autodesk.DocumentBrowser'] });
    viewer.start();
    var documentId = 'urn:' + urn;
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);

    
  });
}

function onDocumentLoadSuccess(doc) {
  var viewables = doc.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(doc, viewables).then((i) => {
    // documented loaded, any action?
    changeBG(false);
    
  });

}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}
