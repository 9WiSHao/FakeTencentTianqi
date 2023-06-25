let qweatherKey = 'b22686b21992475d85606e9400778122';
export let tencentLocationKey = 'TZBBZ-EN2CB-PEVU5-JOQ7F-DMMX2-UZBFJ';
export let getLocation = 'https://apis.map.qq.com/ws/location/v1/ip';
let getCityCode = 'https://geoapi.qweather.com/v2/city/lookup';
let getHotCity = 'https://geoapi.qweather.com/v2/city/top';
let getCityWeatherNow = 'https://devapi.qweather.com/v7/weather/now';
let getCityWeather7d = 'https://devapi.qweather.com/v7/weather/7d';
let getCityWeather24h = 'https://devapi.qweather.com/v7/weather/24h';
let getCitySunriseSunset = 'https://devapi.qweather.com/v7/astronomy/sun';
let getIndices1d_1 = 'https://devapi.qweather.com/v7/indices/1d';
let getCityAir = 'https://devapi.qweather.com/v7/air/now';
let getCityWarning = 'https://devapi.qweather.com/v7/warning/now';

export let API = {
	city: `${getCityCode}?key=${qweatherKey}`,
	hotCity: `${getHotCity}?key=${qweatherKey}&range=cn`,
	weatherNow: `${getCityWeatherNow}?key=${qweatherKey}`,
	weather7d: `${getCityWeather7d}?key=${qweatherKey}`,
	weather24h: `${getCityWeather24h}?key=${qweatherKey}`,
	sunriseSunset: `${getCitySunriseSunset}?key=${qweatherKey}`,
	indices1d_1: `${getIndices1d_1}?key=${qweatherKey}&type=0`,
	air: `${getCityAir}?key=${qweatherKey}`,
	warning: `${getCityWarning}?key=${qweatherKey}`,
	// 本来以为腾讯位置的api能用fetch方法获取，但是发现只能用JSONP，弃用了
	// location: `${getLocation}?key=${tencentLocationKey}`,
};
