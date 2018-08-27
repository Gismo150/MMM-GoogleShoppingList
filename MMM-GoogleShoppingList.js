//
// MMM-GoogleShoppingList
//

Module.register("MMM-GoogleShoppingList", {
  defaults: {
    creds: {
      email: "",
      password: "",
    },
    useCookies: true,
    debug:false, // don't set to true.
    scanInterval: 1000*60
  },

  start: function() {
    this.sendSocketNotification("START", this.config)
  },

  getDom: function() {
    var wrapper = document.createElement("div")
    return wrapper
  },

  socketNotificationReceived: function(noti, payload) {
    if (noti == "REFRESHED") {
      console.log(payload)
    }
  },



})
