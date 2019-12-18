 (function() {
  var options = document.querySelector(".config__options"),
      configBtn = document.querySelector(".config__toggle-btn"),
      config = document.querySelector(".config"),
      header = document.querySelector("header"),
      searchForm = document.querySelector(".form"),
      searchInpt = document.querySelector(".form__search-inpt"),
      locationBtn = document.querySelector(".form__location-icon"),
      applicationBody = document.querySelector(".application-body");

  var memorizeConfig = {
      save: function() {;
        var unit = config.querySelector(":checked").id;
        localStorage.setItem("unit", unit);
      },
      load: function() {
        if (localStorage.unit) {
          var unit = localStorage.getItem("unit");
          document.getElementById(unit).checked = true;
        }
        
        
      }
    }    
  function checkForLocalStorage() {
    var test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}
  var weather = function() {
    var geokey = "Ana6jaKgaxChadBgpdy5ggYnHi_kzXA_-HtUoOkf818rfFh_9X2Nopz4aNmEJoUv",
        weatherKey = "720ab8b92c2e6b8f29506432944bf626",
        appData = {
            location: {
              place: "",
              lat: "",
              lon: ""
            },
            weather: {
                summary: "",
                temperature: "",
                weatherIcon: "",
                pressure: "",
                humidity: "",
                temperatureFeel: ""
            },
            view: {
              icon: {
                src: "",
                alt: ""
              },
              background: "",
              temperatureMeasure: ""
            }
        };

      var weatherTemplate = function() {
        var celsiusUnit = document.getElementById("Celsius");
        var fahrenheitUnit = document.getElementById("Fahrenheit");
        var temperatureUnit = function() {
            if(celsiusUnit.checked === true) {
              return '<p class="weather-container__temperature-container"><span class="weather-container__temperature">' + appData.weather.temperature + '</span><span class="weather-container__unit">&#8451;</span></p>';
            } else if(fahrenheitUnit.checked === true) {
              return '<p class="weather-container__temperature-container"><span class="weather-container__temperature">' + Math.round(32 + 5/9 * appData.weather.temperature) + '</span><span class="weather-container__unit">&#8457;</span></p>';
            }
        }
        return '<main class="weather-container ' + appData.view.background + '">'
            + '<img class="weather-container__icon" src="' + appData.view.icon.src + '" alt="' + appData.view.icon.alt +'">'
            + '<p class="weather-container__location">' + appData.location.place + '</p>'
            + temperatureUnit()
            + '<p class="weather-container__summary">' + appData.weather.summary + '</p>'
       + '</main>';
      }
      
      function setBackground() {
        var weatherIcon = appData.weather.weatherIcon;
          if(weatherIcon === "rain") {
              appData.view.background = "weather-status--rain";    
          } else if (weatherIcon === "clear-day" || weatherIcon === "clear-night") {
              appData.view.background = "weather-status--clear";  
          } else if (weatherIcon === "cloudy" || weatherIcon === "partly-cloudy-day" || weatherIcon === "partly-cloudy-night") {
              appData.view.background = "weather-status--cloudy";  
          } else if (weatherIcon === "snow" || weatherIcon === "sleet") {
              appData.view.background = "weather-status--snow";  
          } else if (weatherIcon === "wind") {
              appData.view.background = "weather-status--wind";  
          } else if (weatherIcon === "fog") {
              appData.view.background = "weather-status--fog";  
          }
      }  

      function changeTemperatureUnit(evt) {
        var temperature = $(".weather-container__temperature"),
            temperatureUnit = $(".weather-container__unit"),
            selectedUnit = evt.target.id;
          if(selectedUnit === "Celsius") {
              $(temperature).text(appData.weather.temperature);
              $(temperatureUnit).replaceWith('<span class="weather-container__unit">&#8451;</span></p>');
          } else if(selectedUnit === "Fahrenheit") {
              $(temperature).text(Math.round(32 + 5/9 * appData.weather.temperature));
              $(temperatureUnit).replaceWith('<span class="weather-container__unit">&#8457;</span></p>');
          }
      }

      function setIcon() {
          var icon = appData.weather.weatherIcon;
          var iconUrl = {
              rain: "img/icons/rain.svg",
              clear: "img/icons/clear.svg",
              fog: "img/icons/fog.svg",
              clouds: "img/icons/clouds.svg",
              sun: "img/icons/sun.svg",
              wind: "img/icons/windy.svg",
              snow: "img/icons/snow.svg"
          }
          
          if(icon === "rain") {
              appData.view.icon.src = iconUrl.rain;  
              appData.view.icon.alt = "Hide! It's raining!";        
          } else if (icon === "clear-day" || icon === "clear-night") {
              appData.view.icon.src = iconUrl.clear;  
              appData.view.icon.alt = "Sky is clear";         
          } else if (icon === "cloudy" || icon === "partly-cloudy-day" || icon === "partly-cloudy-night") {
              appData.view.icon.src = iconUrl.clouds,  
              appData.view.icon.alt = "Sky is covered with clouds";
          } else if (icon === "snow" || icon === "sleet") {
              appData.view.icon.src = iconUrl.snow; 
              appData.view.icon.alt = "Snow!";
          } else if (icon === "wind") {
              appData.view.icon.src = iconUrl.wind; 
              appData.view.icon.alt = "Wind";
          } else if (icon === "fog") {
              appData.view.icon.src = iconUrl.fog; 
              appData.view.icon.alt = "Mist";
          }
      }

      function setDataByCoords(lat, lon) {
        $.when(reverseGeocoding(lat, lon), getCurrentWeather(createCurrentWeatherRequestUrl(lat, lon))).done(function(locationData, weatherData) {

              appData.location.place = locationData[0].resourceSets[0].resources[0].name;
              appData.weather.summary = weatherData[0].currently.summary;
              appData.weather.temperature = Math.round(weatherData[0].currently.temperature);
              appData.weather.humidity = weatherData[0].currently.humidity;
              appData.weather.weatherIcon = weatherData[0].currently.icon;
              appData.weather.pressure = weatherData[0].currently.pressure;
              appData.weather.temperatureFeel = weatherData[0].currently.apparentTemperature;
              setBackground();
              setIcon();   
              displayWeather();
              
          });
      }

      function setDataByPlace(place) {
        var button = $(".form__submit-inpt");
        $.when(forwardGeocoding(place)).done(function(data) {
             var lat = data.resourceSets[0].resources[0].geocodePoints[0].coordinates[0];
             var lon = data.resourceSets[0].resources[0].geocodePoints[0].coordinates[1];
             appData.location.place = data.resourceSets[0].resources[0].name;
             $.when(getCurrentWeather(createCurrentWeatherRequestUrl(lat, lon))).done(function(weatherData) {
              appData.weather.summary = weatherData.currently.summary;
              appData.weather.temperature = Math.round(weatherData.currently.temperature);
              appData.weather.humidity = weatherData.currently.humidity;
              appData.weather.pressure = weatherData.currently.pressure;
              appData.weather.weatherIcon = weatherData.currently.icon;
              appData.weather.temperatureFeel = weatherData.currently.apparentTemperature;
              setBackground();
              setIcon();
              displayWeather();
             });
         });
      } 

      function getCoords() {
         if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(succes, fail);
        }
        function succes(position) {
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          setDataByCoords(lat, lon);
          
         }

         function fail(error) {
          console.log(error.code);
          console.log(error.message);
        }
        
      
       }
      function forwardGeocoding(place) {
        var url = "https://dev.virtualearth.net/REST/v1/Locations?query=" + place + "&key=" + geokey;
        return $.ajax({
            url: url, 
            dataType: "jsonp",
            jsonp: "jsonp",
            crossDomain: true
       });
      }
      function reverseGeocoding(lat, lon) {
        var url =  "https://dev.virtualearth.net/REST/v1/Locations/" + lat + "," + lon + "?includeEntityTypes=PopulatedPlace&key=" + geokey;  
        return $.ajax({
            url: url,
            dataType: "jsonp",
            jsonp: "jsonp",
            crossDomain: true 
            }
          );
      }

      function createCurrentWeatherRequestUrl(lat, lon) {
       var url = "https://api.darksky.net/forecast/" + weatherKey + "/" + lat + "," + lon;
       return url;
     }

     function getCurrentWeather(url) {
           return $.ajax({
               url: url, 
               dataType: "jsonp",
               crossDomain: true,
               data: {
                 exclude: "minutely,hourly,daily,alerts,flags",
                 units: "si"
                }
           });
      }
      function displayWeather() {
        var form = $(".form");
        var weatherTemp = weatherTemplate();
        var scrollToWeather = function() {
          $("body", "html").animate({
            scrollTop: $(".weather-container").offset().top
          }, 1000);
        }
        if(!document.querySelector(".weather-container")) {

          $(form).after(weatherTemp);
          var newlyCreated = $(".weather-container");         
          $(newlyCreated).hide();
          $(newlyCreated).slideDown("slow");          
        } else { 
          console.log("yess");
          var oldOne = $(".weather-container");
          $(oldOne).slideUp("slow", function() {
            $(oldOne).remove();
            $(form).after(weatherTemp);
            var current = $(".weather-container");
            $(current).hide();
            $(current).slideDown("slow");
        }); 
      }
      if($(".weather-container").offset().top + $(".weather-container").height() > $(window).height()) {
        scrollToWeather();
      }
      
    }
    


      return {
        getWeatherByCoords: getCoords,
        getWeatherByPlace: setDataByPlace,
        changeTemperatureUnit: changeTemperatureUnit,
      };

  }();

if(checkForLocalStorage() === true) {
  memorizeConfig.load();
}      

weather.getWeatherByCoords();

$(locationBtn).click(weather.getWeatherByCoords);
$(searchForm).submit(function(evt) {
  evt.preventDefault();
  var place = searchInpt.value;
  weather.getWeatherByPlace(place);
});





$(options).hide();
    $(configBtn).on("click", function() {
      $(config).toggleClass("config--opened");
      $(options).slideToggle("slow");
    });  

$(config).change(function(evt) {
    evt.stopPropagation();
    if(document.querySelector(".weather-container") && document.querySelector(".weather-container__temperature")) {
      weather.changeTemperatureUnit(evt);
    }
    if(checkForLocalStorage() === true) {
      memorizeConfig.save();
    }
    
  });  


 }($, jQuery));
