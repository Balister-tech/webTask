const cheerio = require("cheerio");
const request = require("request-promise");
const fs = require("fs");
const json2csv = require("json2csv").Parser;
const http = require("http");
const url = require("url");

///////////////////////////////////// TIMES OF INDIA//////////////////////////
const URL = "https://timesofindia.indiatimes.com/briefs";
let TimesNews = "";
let news = async () => {
  let timeData = [];
  let paragraph = [];
  let ImageArr = [];
  let businessNews = [];
  const response = await request({
    uri: URL,
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
    },
    gzip: true,
  });

  let $ = cheerio.load(response);
  $('div[class="brief_box "] > h2').each((_, l) => {
    let head = $(l).text();
    timeData.push(head);
  });

  $('div[class="brief_box "] > p').each((_, l) => {
    let para = $(l).text();
    paragraph.push(para);
  });

  $('div[class="brief_box "] a > div > img').each((_, l) => {
    let image = $(l).attr("src");
    ImageArr.push(image);
  });

  timeData.forEach((el, i) => {
    businessNews.push({
      HeaderContent: timeData[i],
      ImageLink: ImageArr[i],
      BriefNews: paragraph[i],
    });
  });
  let j2cp = new json2csv();
  const csv = j2cp.parse(businessNews);
  TimesNews = csv;
  // fs.writeFileSync("./timesIndiaNews.txt", csv, "utf-8");
  // console.log("File written");
  // console.log(businessNews);
};
news();

////////////////////////////////  Business News////////////
const url1 =
  "https://timesofindia.indiatimes.com/business/india-businessspeed-at-which-india-adapts-has-always-amazed-me-capgemini-ceo/articleshow/81981043.cms";

let busNews = "";
let BusinessNews = async () => {
  let Business = [];
  const response = await request({
    uri: url1,
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
    },
    gzip: true,
  });

  let $ = cheerio.load(response);
  $('div[class="_3lvqr clearfix"] > div').each((_, l) => {
    let head = $(l).text();
    Business.push(head);
  });
  // let j2cp = new json2csv();
  // const csv1 = j2cp.parse(Business);
  busNews = Business.join("");
  // fs.writeFileSync("./BusinessIndiaNews.txt", Business, "utf-8");
  // console.log(Business);
};
BusinessNews();

///////////////////////////////////////////////// Mutual fund /////////////////////
const url2 = "https://www.moneycontrol.com/mutualfundindia/";
let mutual = "";
const moneyControl = async () => {
  let Business = [];
  const response = await request({
    uri: url2,
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
    },
    gzip: true,
  });

  let $ = cheerio.load(response);
  const mutualFund = $('div[class="tableprfm PR"] > p').text();
  mutual = mutualFund;
  // console.log(mutualFund);
};
moneyControl();

//////////////////////////////// money control news////////////////////////////////

const url3 = "https://www.moneycontrol.com/news/news-all/";
let moneyNews = "";
const MoneyControlNews = async () => {
  let Business = [];
  const response = await request({
    uri: url3,
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
    },
    gzip: true,
  });

  let $ = cheerio.load(response);
  const MutualDataNews = $("[href]").text();
  let j2cp = new json2csv();
  const csv = JSON.stringify(MutualDataNews);
  moneyNews = csv;
  // moneyNews = MutualDataNews;
  // console.log(MutualDataNews);
};
MoneyControlNews();

///////////////// server
const server = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === "/" || pathName === "/timesofindianews") {
    res.end(TimesNews);
  } else if (pathName === "/businessnews") {
    res.end(busNews);
  } else if (pathName === "/moneymarket") {
    res.end(moneyNews);
  } else if (pathName === "/mutualfund") {
    res.end(mutual);
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on request on 8000");
});
