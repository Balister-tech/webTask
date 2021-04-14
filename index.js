const cheerio = require("cheerio");
const request = require("request-promise");
const fs = require("fs");
const json2csv = require("json2csv").Parser;
const http = require("http");
const url = require("url");

const urlAll = {
  TimesNewsUrl: "https://timesofindia.indiatimes.com/briefs",
  BusinessUrl:
    "https://timesofindia.indiatimes.com/business/india-businessspeed-at-which-india-adapts-has-always-amazed-me-capgemini-ceo/articleshow/81981043.cms",
  FirstPostNewsUrl: "https://www.firstpost.com",
  MoneyControlUrl: "https://www.moneycontrol.com/news/news-all",
};
const Header = {
  TimesHeader:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-encoding": "gzip, deflate, br",
  "accept-language": "en-US,en;q=0.9",
  BusinessHeader:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-encoding": "gzip, deflate, br",
  "accept-language": "en-US,en;q=0.9",
  FirstPostHeader:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-encoding": "gzip, deflate, br",
  "accept-language": "en-US,en;q=0.9",
  MoneyControlHeader:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-encoding": "gzip, deflate, br",
  "accept-language": "en-US,en;q=0.9",
};

const HtmlAll = {
  NewsHeader: 'div[class="brief_box "] > h2',
  NewsParagraph: 'div[class="brief_box "] > p',
  BusinessHeader: 'div[class="_3lvqr clearfix"] > div',
  BusinessParagraph: 'div[class="bgImg notloggedin bgImg scroll-up"]>p', // check
  FirstPostHeader: 'div[class="title-wrap"]>h3',
  FirstPostParagraph: 'div[class="title-wrap"]>p',
  MoneyControlHeader: "#cagetory>li>h2",
  MoneyControlParagraph: "#cagetory>li>p",
};

///////////////////////////////////// TIMES OF INDIA//////////////////////////

let news = async (str) => {
  var url1 = "";
  var Header = "";
  var HtmlHeader = "";
  var HtmlParagraph = "";
  if (str == "MoneyControl") {
    url1 = `${urlAll.MoneyControlUrl}`;
    Header = `${Header.MoneyControlHeader}`;
    HtmlHeader = `${HtmlAll.MoneyControlHeader}`;
    HtmlParagraph = `${HtmlAll.MoneyControlParagraph}`;
  } else if (str == "TimesNews") {
    url1 = `${urlAll.TimesNewsUrl}`;
    Header = `${Header.TimesHeader}`;
    HtmlHeader = `${HtmlAll.NewsHeader}`;
    HtmlParagraph = `${HtmlAll.NewsParagraph}`;
  } else if (str == "BusinessNews") {
    url1 = `${urlAll.BusinessUrl}`;
    Header = `${Header.BusinessHeader}`;
    HtmlHeader = `${HtmlAll.BusinessHeader}`;
    HtmlParagraph = `${HtmlAll.BusinessParagraph}`;
  } else if (str == "FirstPostNews") {
    url1 = `${urlAll.FirstPostNewsUrl}`;
    Header = `${Header.FirstPostHeader}`;
    HtmlHeader = `${HtmlAll.FirstPostHeader}`;
    HtmlParagraph = `${HtmlAll.FirstPostParagraph}`;
  }

  const URL = url1;
  const data = {
    HeadContent: [],
    Paragraph: [],
    Img: [],
  };

  const response = await request({
    uri: URL,
    headers: {
      accept: Header,
    },
    gzip: true,
  });

  // Head
  let $ = cheerio.load(response);
  $(HtmlHeader).each((_, l) => {
    let head = $(l).text().trim();
    data.HeadContent.push(head);
  });

  // Paragraph
  $(HtmlParagraph).each((_, l) => {
    let para = $(l).text().trim();
    data.Paragraph.push(para);
  });

  // Image Link
  $("img").each((index, image) => {
    var img = $(image).attr("src");
    // var baseUrl = `${url}` + `/`;
    // var Links = baseUrl + img;
    data.Img.push(img);
  });
  var obj = JSON.stringify(data);
  fs.writeFileSync("./data.json", `${obj}`, function (err) {
    if (err) return console.error(err);
  });
  console.log(data);
};

// news("BusinessNews");
// news("TimesNews");
news("MoneyControl");
// news("FirstPostNews");

///////////////// server
// const server = http.createServer((req, res) => {
//   const pathName = req.url;
//   if (pathName === "/" || pathName === "/timesofindianews") {
//     res.end(TimesNews);
//   } else if (pathName === "/businessnews") {
//     res.end(busNews);
//   } else if (pathName === "/moneymarket") {
//     res.end(moneyNews);
//   } else if (pathName === "/mutualfund") {
//     res.end(mutual);
//   }
// });

// server.listen(8000, "127.0.0.1", () => {
//   console.log("Listening on request on 8000");
// });
