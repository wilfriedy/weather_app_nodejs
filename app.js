const express = require('express')
const https = require('https')
const bodyParser = require("body-parser");
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/', (req, res) => {
  
  const city = req.body.city;
  const url =
    `https://api.openweathermap.org/data/2.5/weather?appid=f93d705656b807f8c83775c1c5bd3124&q=${city}&units=metric`;
  https.get(url, (response) => {
    try {
      response.on("data", (data) => {
        let parsedData = JSON.parse(data);
        let temperature = parsedData.main.temp;
        let imgurl = parsedData.weather[0].icon;
        let country = parsedData.sys.country;
        let feels = parsedData.main.feels_like;
        let wind = parsedData.wind.speed;
        let humidity = parsedData.main.humidity;
        let cityName = parsedData.name;
        res.writeHead(200, {
          "Content-Type": "text/html",
        });
        if (parsedData.cod == 404) {
          res.write(
            `<h1 style="text-align: center; color :red "> ${parsedData.message}</h1>`
          );
          res.write(
            `<button onclick="window.location.href = '/index.html'">Go back</button>`
          );
        } else {
          res.write(
            `<div  style="font-family: roboto , sans-serif; width :  40rem ; margin : auto ;display:flex ; justify-content : space-around  ; flex-direction: column; font-size: 1.8rem" >

          <h2 > Query result of ${cityName} ${country} <img style=" width:40px ; height : 40px" src="http://openweathermap.org/img/wn/${imgurl}@2x.png" alt="weather logo"></h2>
          <p>Temperature <b style ="color : green">${temperature}</b> degrees is and  feels like <b style ="color : green">${feels}</b>  degrees </p>
          <p>Wind speed : <b style ="color : green">${wind} mph</b> </p>
          <p>humidity : <b style ="color : green">${humidity} g.m-3</b>  </p>
          <a style="text-decoration: none; color : green" onclick="window.location.href = '/'">Go to main</a>
      </div>`
          );
        }
        res.send();
      });
    } catch (e) {
      res.write(`<h1>Something went wrong ${e}</h1>`)
    }
  })
})



app.listen(process.env.PORT || 3000, () => console.log('port started'))