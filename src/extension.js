const vscode = require('vscode');
const { getWebviewContent } = require('./webview/getWebviewContent');

function activate(context) {
  let currentPanel = undefined;

  const disposable = vscode.commands.registerCommand('jsonVisualizer.open', () => {
    if (currentPanel) {
      currentPanel.reveal(vscode.ViewColumn.One);
      return;
    }

    const nonce = getNonce();

    currentPanel = vscode.window.createWebviewPanel(
      'jsonVisualizer',
      'JSON Visualizer',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: []
      }
    );

    currentPanel.webview.html = getWebviewContent(nonce);

    currentPanel.webview.onDidReceiveMessage(
      (message) => handleMessage(currentPanel, message),
      undefined,
      context.subscriptions
    );

    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    }, null, context.subscriptions);
  });

  context.subscriptions.push(disposable);
}

async function handleMessage(panel, message) {
  switch (message.type) {
    case 'fetchApi': {
      try {
        const responseText = await fetchUrl(message.url);
        const data = JSON.parse(responseText);
        panel.webview.postMessage({ type: 'apiResponse', data });
      } catch (error) {
        panel.webview.postMessage({
          type: 'apiError',
          error: error.message || 'Failed to fetch API'
        });
      }
      break;
    }
  }
}

function fetchUrl(urlString) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(urlString);
    const lib = urlObj.protocol === 'https:' ? require('https') : require('http');

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'VSCode-JSON-Visualizer/0.0.1'
      }
    };

    const req = lib.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(body));
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timed out after 15 seconds'));
    });
    req.end();
  });
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function deactivate() {}

module.exports = { activate, deactivate };
