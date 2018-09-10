//
// MMM-GoogleShoppingList
//

Module.register("MMM-GoogleShoppingList", {
  defaults: {
    creds: {
      email: "",
      password: "",
    },
    scanInterval: 1000*60*10,
    displayImage: true,


    // don't care about belows;
    useCookies: true,
    //headless:true, // don't set to false.
    itemPattern: "> (.*) <\/span>",
    imagePattern: "src=\"(.*)\" srcset=",
    browser: {
      headless: true, // don't set to false.
      executablePath: "/usr/bin/chromium-browser" //If you are using OSX or other system, remove this line or change.
    }
  },

  getStyles: function() {
    return ["MMM-GoogleShoppingList.css"]
  },

  start: function() {
    this.sendSocketNotification("START", this.config)
  },

  getDom: function() {
    var wrapper = document.createElement("ul")
    wrapper.id = "GSL_WRAPPER"
    var loading = document.createElement("div")
    loading.id = "GSL_LOADING"
    loading.innerHTML = "loading..."
    wrapper.appendChild(loading)
    return wrapper
  },

  socketNotificationReceived: function(noti, payload) {
    if (noti == "REFRESHED") {
      this.drawItems(payload)
    }
  },

  drawItems: function(items) {
    var wrapper = document.getElementById("GSL_WRAPPER")
    wrapper.innerHTML = ""
    if (items.length > 0) {
      items.forEach(item => {
        var itemTitle = new RegExp(this.config.itemPattern).exec(item)
        var d = document.createElement("li")
        d.className = "GSL_ITEM"

        if (this.config.displayImage) {
          var itemImage = new RegExp(this.config.imagePattern).exec(item)
          if (itemImage) {
            var img = document.createElement("img")
            img.src = itemImage[1]
            d.appendChild(img)
          }
        }


        var title = document.createElement("span")
        title.innerHTML = itemTitle[1]
        d.appendChild(title)
        wrapper.appendChild(d)
      })
    }

  }



})
