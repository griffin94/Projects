class Weather{
    constructor(){
        this.weather = document.querySelector('.weather');
        this.form = this.weather.querySelector('.header__form');
        this.city = this.weather.querySelector('.header__city');
        this.temperature = this.weather.querySelector('.main__temperature');
        this.descript = this.weather.querySelector('.main__description');    
        this.icon = this.weather.querySelector('.main__icon');
        this.pressure = this.weather.querySelector('.main__pressure');
        this.wind = this.weather.querySelector('.main__wind');
        this.sunrise = this.weather.querySelector('.main__sunrise');
        this.sunset = this.weather.querySelector('.main__sunset');
        this.humidity = this.weather.querySelector('.main__humidity');
        this.visibility = this.weather.querySelector('.main__visibility');
        this.errorPopup = this.weather.querySelector('.error-popup');
        this.forecast = document.querySelector('.forecast');

        this.init();
    }

    init = () => {

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = e.target.elements['city-name'];
            input.classList.remove('header__input--error');
            if(input.value) {
                this.getData(input.value);
                input.value = '';
            } else {
                input.classList.add('header__input--error');
                return;
            }
        });

        this.getData("Londyn");

        navigator.geolocation.getCurrentPosition(position => this.getCity(position), error => this.showError("You have denied permission to check your location"));
    }


    getCity = (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
  
        const cityAPI = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pl`;

        fetch(cityAPI).
        then(res => res.json()).
        then(data => this.getData(data.city)).
        catch(() => this.showError("Failure during getting location"));
    }

    getWeather = async (city) => {
        const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=fc92e02793be08beb0b8c9686e03962b`;
        
        const res = await fetch(weatherAPI);
        const data = await res.json();
        return data;
    }

    getForecast = async (city) => {
        const forecastApi = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=fc92e02793be08beb0b8c9686e03962b`;

        const response = await fetch(forecastApi);
        const data = await response.json();
        return data.list;
    }

    getData = async (city) => {
        try {
            const weather = await this.getWeather(city);
            const forecast = await this.getForecast(city);
            this.fillWeatherData(weather, city);
            this.fillWeatherForecast(forecast);
        } catch(err) {
            this.showError("Failure during getting weather data");
            console.log(err)
        }
    }

    fillWeatherData = (weatherData, city) => {
        const {
            main: {
                temp,
                temp_min,
                temp_max,
                pressure,
                humidity
            },
            sys: {
                sunrise,
                sunset
            },
            weather: [{
                description,
                icon
            }],
            wind: {
                speed
            },
            visibility           
        } = weatherData;

        const sunriseDate = new Date(sunrise*1000);
        const sunsetDate = new Date(sunset*1000);

        this.city.textContent = city.charAt(0).toUpperCase()+city.slice(1);
        this.temperature.innerHTML = Math.round(temp * 10) / 10+`<sup>&#176;</sup>C`;
        this.descript.textContent = description.charAt(0).toUpperCase()+description.slice(1);
        this.icon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        this.pressure.textContent = `Pressure: ${pressure} hPa`;
        this.wind.textContent = `Wind speed: ${speed} mph`;
        this.sunrise.textContent = `Sunrise: ${sunriseDate.getHours() < 10 ? `0${sunriseDate.getHours()}` : sunriseDate.getHours()}:${sunriseDate.getMinutes() < 10 ? `0${sunriseDate.getMinutes()}` : sunriseDate.getMinutes()}`;
        this.sunset.textContent = `Sunset: ${sunsetDate.getHours() < 10 ? `0${sunsetDate.getHours()}` : sunsetDate.getHours()}:${sunsetDate.getMinutes() < 10 ? `0${sunsetDate.getMinutes()}` : sunsetDate.getMinutes()}`;
        this.humidity.textContent = `Humidity: ${humidity} %`;
        this.visibility.textContent = `Visibility: ${visibility/1000} km`;
    }

    fillWeatherForecast = (forecast) => {
        this.forecast.innerHTML = '';
        
        forecast.forEach(item => {
            const tile = document.createElement('div');
            const row = document.createElement('div');
            const img = document.createElement('img');
            const info = document.createElement('div');
            const date = document.createElement('div');

            tile.classList.add('forecast__tile');
            row.classList.add('row');

            img.setAttribute('src', `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`);
            img.classList.add('forecast__icon');

            info.classList.add('forecast__info');
            info.innerHTML = `${Math.round(item.main.temp * 10) / 10} <sup>&#176;</sup>C ${item.main.pressure} hPa`;

            date.classList.add('forecast__date');
            date.innerText = item.dt_txt.slice(0, 16);

            row.appendChild(img);
            row.appendChild(info);
            tile.appendChild(date);
            tile.appendChild(row);
            this.forecast.appendChild(tile);
        })
    }

    showError = (text) => {
        this.errorPopup.classList.add('error-popup--visible');
        this.errorPopup.querySelector('.error-popup__validation-text').textContent = text;
        this.errorPopup.querySelector('.error-popup__close-button').addEventListener('click', () => {
            this.errorPopup.classList.remove('error-popup--visible');
        });
    }
}