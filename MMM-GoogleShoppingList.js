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
    browser: {
      headless: true, // Set to false for debugging purposes (will start your chromium browser ui)
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
        var d = document.createElement("li")
        d.className = "GSL_ITEM"

        var v = document.createElement("div")
        v.innerHTML = item
        if (this.config.displayImage) {
          var i = v.querySelector("img.itemImage")
          if (i) {
            var img = document.createElement("img")

            img.src = i.src
            d.appendChild(img)
          }
        }
        var t = v.querySelector(".title").innerHTML
        var title = document.createElement("span")
        title.innerHTML = t
        d.appendChild(title)

        wrapper.appendChild(d)
      })
    }

  }
})
