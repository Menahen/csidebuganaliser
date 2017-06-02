const {app, BrowserWindow, Menu, ipcMain, dialog, Tray } = require("electron");
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
    tray = new Tray(__dirname + '/app/images/evil-cat.png');
    let trayMenu = Menu.buildFromTemplate([
            {label: 'Abrir', click:  function(){
               mainWindow.show();
             } },
            {label: '', type: 'separator'},
            {label: 'JavaScript', type: 'radio'},
            {label: 'Java', type: 'radio'},
            {label: 'Photoshop', type: 'radio'}
        ]);
    tray.setContextMenu(trayMenu);
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.webContents.openDevTools();
     mainWindow.on('minimize',function(event){
        event.preventDefault()
            mainWindow.hide();
    });
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
