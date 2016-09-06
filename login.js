// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


const {ipcRenderer} = require('electron')
const globalState = require('electron').remote.getGlobal('globalState')
const saml = globalState.saml

const webview = document.getElementById('loginview');
webview.addEventListener("dom-ready", domReady);
webview.addEventListener("did-finish-load", finishedLoad);

function domReady() {
    var authUrl = saml.getAuthorizeUrl(null, function(err, target) {
        webview.removeEventListener("dom-ready", domReady);
        loginLoaded = true;
        webview.src = target;
    });
}

function finishedLoad() {
    webview.executeJavaScript('__samlTools.getSAMLResponse()', false, function(e) {
        if (!e) {
            return;
        }

        // console.log('validating saml response');
        saml.validateResponse(e, function(err, profile, loggedOut) {
            // console.log('validation saml response. err:', err)
            // console.log('profile:', profile)
            // console.log('loggedOut', loggedOut)
            webview.stop();
            ipcRenderer.send('user-logged-in', profile)
        });

    });
}
