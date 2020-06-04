# MMM-GoogleShoppingList
MagicMirror module for displaying Google Shoppinglist

## Screenshot
![screenshot](https://github.com/eouia/MMM-GoogleShoppingList/blob/master/screenshot.png?raw=true)

## Version History
### **1.0.3** (4th June, 2020)
-Migration : From Puppeteer 1.15.0 to 2.0.0
-Fixed : Updating the button queryselector according to google's ne page layout.
### **1.0.2** (31th Oct, 2018)
- fixed : Some irregular parsing solved.
### **1.0.1** (10th Sep, 2018)
- fixed : Raspberry Pi puppeteer issue.
- You should remove old version and re-install from `PreInstall` step.

## PreInstall
```shell
sudo apt install chromium-browser
```

## Install
```shell
cd ~/MagicMirror/modules
git clone https://github.com/eouia/MMM-GoogleShoppingList
cd MMM-GoogleShoppingList
npm install
```

## Configuration
```javascript
{
  module: "MMM-GoogleShoppingList",
  position: "top_right",
  header: "My Shopping List",
  config: {
    creds: {
      email: "YOUR GOOGLE ACCOUNT",
      password: "YOUR GOOGLE PASSWORD",
    },
    scanInterval: 1000*60,
    displayImage: false, //if you set, you can get image of items. but very ugly. I don't recommend.
  }
},
```

### Notice
- This module will get items from your Prime list only.
- 2-Factor-Authentication is not supported
