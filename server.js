const puppeteer = require('puppeteer');
const url = 'http://www.yvr.ca/en/passengers/flights/departing-flights';
const $ = require('cheerio');
const fs = require('fs');
const tomorrowButtonSelector = 'label[for=flights-toggle-tomorrow]';
const YVRDestinations = {
    "Cities": []
}

const uniqueSet = new Set();
puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto(url);
    let html = await page.content();
    await $('td:nth-child(5)',html).each(function(i, elem) {
        if(uniqueSet.has($(this).text()))return true;
         uniqueSet.add($(this).text())   
     });
    await page.click(tomorrowButtonSelector)
    await page.waitFor(500);
    html = await page.content();
    await $('td:nth-child(5)',html).each(function(i, elem) {
        if(uniqueSet.has($(this).text()))return true;
         uniqueSet.add($(this).text());   
    });
    YVRDestinations.Cities = await [...uniqueSet].sort();
            
    await fs.writeFile('YVRDestinations.json', JSON.stringify(YVRDestinations), function(err){
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });
    await browser.close();
  });

  
