'use strict'

const puppeteer = require("puppeteer")
const fs = require("fs-extra")
const path = require("path")

var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function() {
    this.config = null
  },

  getList: function() {
    var creds = this.config.creds
    this.emul(creds, {cookies:this.config.useCookies}).then(res => {
      if (res.length > 0) {
        this.sendSocketNotification("REFRESHED", res)
      }
    })

    var timer = setTimeout(()=>{
      this.getList()
    }, this.config.scanInterval)
  },

  socketNotificationReceived: function(noti, payload) {
    if (noti == "START") {
      this.job(payload)
    }
  },

  job: function(config) {
    this.config = config
    this.getList()
  },

  emul: function(creds, options) {
    return new Promise((resolve, reject) => {
      if(options === undefined) {
        options = {
          cookies: false
        }
      }
      if(!creds) {
      reject(new Error('Credentials not supplied'))
    } else if(!('email' in creds)) {
      reject(new Error('Email not supplied'))
    } else if (!('password' in creds)) {
      reject(new Error('Password not supplied'))
    } else {
      get(this.config.browser)
    }
    async function get(browserOption) {
      function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      const ERROR_CHECK = 'body > div > div.main.content.clearfix > div'
	
	console.log("[GSL] Launching puppeteer browser")
      const browser = await puppeteer.launch(browserOption)
      const page = await browser.newPage()
      await page.setUserAgent('Mozilla/5.0 (Macintosh Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/65.0.3312.0 Safari/537.36') // Have to set this because some pages display differently for Headless Chrome
      if(options.cookies) {
        let loadedCookies = await loadCookies()
        if(creds.email in loadedCookies) {
          await page.setCookie(...loadedCookies[creds.email])
        }
      }
	console.log("[GSL] Goto Shoppinglist")
      await page.goto('https://shoppinglist.google.com/', {
	waitUntil: ['load', 'networkidle0'],
	timeout: 0
      }) // .catch((e) => {console.log("Catched Error: " + e)})
  
      if (page.url().indexOf("https://shoppinglist.google.com/", 0) == -1) {
        console.log("[GSL] Trying to login")
        //await page.click(USERNAME_SELECTOR)
        await page.evaluate(() => {
          document.querySelector("#Email").click()
        })
        await page.keyboard.type(creds.email)


        //await page.click(EMAIL_NEXT_BUTTON)
        await page.evaluate(() => {
          document.querySelector("#next").click()
        })
        await page.waitForNavigation()
        await page.keyboard.type(creds.password)

        //await page.click(PASSWORD_NEXT_BUTTON)
        await page.evaluate(() => {
          document.querySelector("#submit").click()
        })
        await page.waitForNavigation({waitUntil: ['load', 'networkidle2']})
        if(options.cookies) {
          let cookies = await page.cookies()
          await saveCookies(creds.email, cookies)
          console.log("[GSL] Cookies are saved.")
        }
        await timeout(5000)
      }
      console.log("[GSL] Landed on the target page. Trying to get list")
      let list = await page.evaluate(selector => {
        console.log(selector)
        let items = []
        let allItems = document.querySelectorAll(selector)
        allItems.forEach(res => items.push(res.innerHTML))
        return items
      }, "shopping-list-item")

       resolve(list)
       await browser.close()
       console.log("[GSL] Tried. (when even failed) : ", list.length)
     }

     async function saveCookies(email, cookies) {
       cookies = {[email]: cookies}
       try {
         await fs.writeJson(path.resolve(__dirname), "cookies.json", cookies)
         return
       } catch (err) {
         return new Error(err)
       }
     }

     async function loadCookies() {
       try {
         let cookies = await fs.readJson(path.resolve(__dirname), "cookies.json")
         return cookies
        } catch (err) {
          return new Error(err)
        }
      }
    })
  }
})
