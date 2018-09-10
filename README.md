# MMM-GoogleShoppingList
MagicMirror module for displaying Google Shoppinglist (Not complete yet.)

## Screenshot
![screenshot](https://github.com/eouia/MMM-GoogleShoppingList/blob/master/screenshot.png?raw=true)

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
This module will get items from your Prime list only.
