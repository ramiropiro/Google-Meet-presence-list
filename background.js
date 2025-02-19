// Background Service Worker para Manifest V3
chrome.action.onClicked.addListener((tab) => {
    // Solo ejecutar en páginas de Google Meet
    if (tab.url.includes("meet.google.com")) {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content.js']
      });
    }
  });
  
  // Manejar mensajes del content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "downloadCSV") {
      // Crear y descargar el archivo CSV
      const csvContent = message.data;
      const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      
      chrome.downloads.download({
        url: url,
        filename: 'google_meet_participants.csv',
        saveAs: true
      });
      
      sendResponse({status: "success"});
    }
    return true; // Mantener el canal de comunicación abierto para respuesta asíncrona
  });