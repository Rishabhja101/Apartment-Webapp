from flask import Flask, render_template
import requests
import xml.etree.ElementTree as ET
from collections import defaultdict
import datetime
import tokens
import json

app = Flask(__name__)

@app.route('/')
def get_train_arrivals():
    wait_times = get_wait_times()
    weather_data = get_weather()
    return render_template('index.html', wait_times=wait_times, weather=weather_data)

    

@app.route('/wait_times')
def get_wait_times():
    # API endpoint URL for train arrival data
    url = 'https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx'
    
    # Parameters for the specific station
    params = {
        'key': tokens.transit_api_key,
        'mapid': '41460',
        'max': 10
    }

    try:
        # Send a GET request to the API
        response = requests.get(url, params=params)
        response.raise_for_status()
        root = ET.fromstring(response.content)

        arrival_times = defaultdict(lambda: [])
        for eta in root.findall('.//eta'):
            arrival_time = eta.find('arrT').text
            service_description = eta.find('stpDe').text

            arrival_times[service_description].append(arrival_time)

        current_time = datetime.datetime.now()
        wait_times = {}
        
        for direction, times in arrival_times.items():
            wait_times[direction] = []
            for time_str in times:
                arrival_time = datetime.datetime.strptime(time_str, "%Y%m%d %H:%M:%S")
                remaining_time = arrival_time - current_time
                wait_time = {
                    "minutes": remaining_time.seconds // 60,
                    "seconds": remaining_time.seconds % 60
                }
                wait_times[direction].append(wait_time)

        return wait_times

    except requests.exceptions.RequestException as e:
        return 'Error: {}'.format(e)


def kelvin_to_fahrenheit(temp_in_kelvin):
    return round((temp_in_kelvin - 273.15) * 9/5 + 32, 2)

def get_hour(timestamp):
    datetime_obj = datetime.datetime.fromtimestamp(timestamp)
    hour = datetime_obj.strftime("%I %p")
    return hour

def get_day_of_week(timestamp):
    datetime_obj = datetime.datetime.fromtimestamp(timestamp)
    day_of_week = datetime_obj.strftime("%A")
    return day_of_week

def parse_weather_data(data):
    lat = data['lat']
    lon = data['lon']
    timezone = data['timezone']
    current = data['current']
    temperature = kelvin_to_fahrenheit(current['temp'])
    feels_like = kelvin_to_fahrenheit(current['feels_like'])
    pressure = current['pressure']
    humidity = current['humidity']
    weather_desc = current['weather'][0]['description']
    icon = current['weather'][0]['icon']
    
    hourly = data['hourly']
    hourly_data = []
    for hour in hourly:
        dt = get_hour(hour['dt'])
        temp = kelvin_to_fahrenheit(hour['temp'])
        weather_desc = hour['weather'][0]['description']
        icon = hour['weather'][0]['icon']
        precipitation_prob = hour.get('pop', 0) * 100  # Precipitation probability (%)
        hourly_data.append({
            'dt': dt,
            'temp': temp,
            'weather_desc': weather_desc,
            'icon': icon,
            'precipitation_prob': round(precipitation_prob, 2)
        })
    
    daily = data['daily'][1:8]
    daily_data = []
    for day in daily:
        dt = get_day_of_week(day['dt'])
        max_temp = round((day['temp']['max'] - 273.15) * 9/5 + 32, 2)  # Convert Kelvin to Fahrenheit
        min_temp = round((day['temp']['min'] - 273.15) * 9/5 + 32, 2)  # Convert Kelvin to Fahrenheit
        weather_desc = day['weather'][0]['description']
        icon = day['weather'][0]['icon']
        precipitation_prob = day.get('pop', 0) * 100  # Precipitation probability (%)
        daily_data.append({
            'dt': dt,
            'max_temp': max_temp,
            'min_temp': min_temp,
            'weather_desc': weather_desc,
            'icon': icon,
            'precipitation_prob': round(precipitation_prob, 2)
        })
    
    return {
        'lat': lat,
        'lon': lon,
        'timezone': timezone,
        'temperature': temperature,
        'feels_like': feels_like,
        'pressure': pressure,
        'humidity': humidity,
        'weather_desc': weather_desc,
        'icon': icon,
        'hourly_data': hourly_data,
        'daily_data': daily_data
    }

@app.route('/weather')
def get_weather():
    api_key = tokens.weather_api_key  # Replace with your OpenWeatherMap API key
    city = 'Chicago'
    lat = 41.8781
    lon = 87.6298
    timezone = '-05:00'

    # API endpoint URL for weather data
    url= f'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&tz={timezone}&appid={api_key}'

    try:
        # Send a GET request to the API
        response = requests.get(url)
        response.raise_for_status()
        weather_data = response.json()

        weather_data = parse_weather_data(weather_data)

        return weather_data

    except requests.exceptions.RequestException as e:
        return 'Error: {}'.format(e)


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=4000)
