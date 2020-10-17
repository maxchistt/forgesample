var viewer;

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
    
    let preset = 1;
    changeBG(false);

    function changeBG(bool){
      if(bool){
        if(preset<=16)preset++;
      } else {
        if(preset>=0)preset--;
      }
      $('#bg').text(preset);
      viewer.setLightPreset(preset);
      
    }

    $('#+bg').click(function () {
      changeBG(true);
    });
    $('#-bg').click(function () {
      changeBG(false);
    });

    let edgbool=true;

    $('#edges').click(function () {
      viewer.setDisplayEdges(edgbool=!edgbool);
    });

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
