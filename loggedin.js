const globalState = require('electron').remote.getGlobal('globalState')
const saml = globalState.saml

console.log(globalState.currentUser);
saml.getLogoutUrl({user: globalState.currentUser}, function(err, target) {
    document.getElementById('logout').action = target;
})
