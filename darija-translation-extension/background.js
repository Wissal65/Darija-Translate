
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translateSelection',
    title: 'Translate with Darija Translate',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translateSelection') {
    chrome.sidePanel.open({ windowId: tab.windowId });
    
    chrome.runtime.sendMessage({
      action: 'translateText',
      text: info.selectionText
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSidePanel') {
    chrome.sidePanel.open({ windowId: sender.tab.windowId });
    sendResponse({ success: true });
  }
  return true;
});