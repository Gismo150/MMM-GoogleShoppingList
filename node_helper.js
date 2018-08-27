'use strict'

const puppeteer = require('puppeteer')
const fs = require('fs-extra')

var NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function() {
    this.config = null
  },

  getList: function() {
    var creds = this.config.creds
    this.emul(creds, {cookies:this.config.useCookies}).then(res => {
      this.sendSocketNotification("REFRESHED", res)
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
      get(this.config.headless)
    }
    async function get(headless) {
      const ERROR_CHECK = 'body > div > div.main.content.clearfix > div'
      const USERNAME_SELECTOR = '#Email'
      const EMAIL_NEXT_BUTTON = '#next'
      const PASSWORD_SELECTOR = '#Passwd'
      const PASSWORD_NEXT_BUTTON = '#signIn'
      const SHOPPINGLIST_ITEMS = 'shopping-list-item'

      const browser = await puppeteer.launch({
          headless: headless
      })
      const page = await browser.newPage()
      await page.setUserAgent('Mozilla/5.0 (Macintosh Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/65.0.3312.0 Safari/537.36') // Have to set this because some pages display differently for Headless Chrome

      if(options.cookies) {
        let loadedCookies = await loadCookies()
        if(creds.email in loadedCookies) {
          await page.setCookie(...loadedCookies[creds.email])
        }
      }

      await page.goto('https://shoppinglist.google.com', {waitUntil: 'networkidle2'})

      if (page.url().indexOf("https://shoppinglist.google.com/", 0) == -1) {
        await page.click(USERNAME_SELECTOR)
        await page.keyboard.type(creds.email)
        await page.click(EMAIL_NEXT_BUTTON)
        await page.waitForNavigation()
        await page.keyboard.type(creds.password)
        await page.click(PASSWORD_NEXT_BUTTON)
        await page.waitForNavigation({waitUntil: 'networkidle2'})
        if(options.cookies) {
          let cookies = await page.cookies()
          await saveCookies(creds.email, cookies)
        }
      }

      let list = await page.evaluate(selector => {
        console.log("selector", selector)
        let items = []
        let allItems = document.querySelectorAll(selector)

        allItems.forEach(res => items.push(res.innerHTML))
        return items
      }, SHOPPINGLIST_ITEMS)

       await browser.close()

       resolve(list)
     }

     async function saveCookies(email, cookies) {
       cookies = {[email]: cookies}
       try {
         await fs.writeJson('./cookies.json', cookies)
         return
       } catch (err) {
         return new Error(err)
       }
     }

     async function loadCookies() {
       try {
         let cookies = await fs.readJson('./cookies.json')
         return cookies
        } catch (err) {
          return new Error(err)
        }
      }
    })
  }
})
