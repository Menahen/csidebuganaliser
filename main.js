const {app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const fs = require('fs');

let mainWindow = null;
app.on('ready', () => {

	const menuTemplate = [
        {
            label: 'Arquivo',
            submenu: [
            {
                label: 'Salvar',
                click: () => {
                    console.log('salvando');
                }
            }
        ]
        }
    ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);


    mainWindow = new BrowserWindow({
            width: 900,
            height: 600
        });
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => {
      app.quit();    
 });

ipcMain.on('abrir-arquivo', (event, arg) => {
    console.log("Escutei o chamado");
    dialog.showOpenDialog(function (fileNames) {
      if (fileNames === undefined) return;
      var fileName = fileNames[0];
      fs.readFile(fileName, 'utf-8', function (err, data) {
        event.returnValue = fileName;
      });
     }); 
});
