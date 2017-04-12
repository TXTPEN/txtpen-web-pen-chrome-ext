var callback = function(details) {


  for (var i = 0; i < details.responseHeaders.length; i++) {
    if ('content-security-policy' === details.responseHeaders[i].name.toLowerCase()) {
      details.responseHeaders[i].value = '';
    }
  }

  return {
    responseHeaders: details.responseHeaders
  };
};

var filter = {
  urls: ["*://*/*"],
  types: ["main_frame", "sub_frame"]
};

chrome.webRequest.onHeadersReceived.addListener(callback, filter, ["blocking", "responseHeaders"]);



chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.storage.sync.get('state', function(data) {
    if (data.state === 'on') {
      chrome.storage.sync.set({state: 'off'});
      toggle('off');
      disable(tab.id);
    } else {
      chrome.storage.sync.set({state: 'on'});
      toggle('on');
      inject(tab.id);
    }
  });
});



chrome.webNavigation.onCompleted.addListener(function(details) {
  chrome.storage.sync.get('state', function(data) {
    if (data.state === 'on') {
      inject(details.tabId);
    }
  });
});

function disable(id){
  chrome.tabs.executeScript(id, {code: "alert(1);window.txtpenConfig = Object.assign({}, window.txtpenConfig, {canAdd:false});"});
}; //TODO:FIXME:XXX: get window object and apply this line of code :(

function inject(id){
  chrome.tabs.executeScript(id, {
      file: 'inject.js'
  });
};

function toggle(state) {
  chrome.browserAction.setIcon({path:"icon_" + state + ".png"});
}
