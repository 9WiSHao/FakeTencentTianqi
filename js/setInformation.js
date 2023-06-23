import { API } from './API.js';

export class SetInformation {
	cityCode = '';
	sunrise1 = '';
	sunset1 = '';
	sunrise2 = '';
	sunset2 = '';

	constructor(cityCode) {
		this.cityCode = cityCode;
		this.rander(this.cityCode);

		this.latestReleaseDOM = document.querySelector('.latest-release div');
		this.mainCityTemperatureDOM = document.querySelector('.main-page > .top > .temperature');
		this.mainWeatherTextDOM = document.querySelector('.main-page > .top > .weather');
		this.mainHumidityDOM = document.querySelector('.main-page > .top > .humidity-wind > .humidity');
		this.mainWindDOM = document.querySelector('.main-page > .top > .humidity-wind > .wind');
		this.greetingDOM = document.querySelector('.greeting');

		this.mainTodayTemperatureDOM = document.querySelector('.main-page > .bottom .today-weather > .temperature');
		this.mainTodayWeatherDOM = document.querySelector('.main-page > .bottom .today-temperature > div');
		this.mainTodayWeatherIconDOM = document.querySelector('.main-page > .bottom .today-temperature > img');
		this.mainTomorrowTemperatureDOM = document.querySelector('.main-page > .bottom .tomorrow-weather > .temperature');
		this.mainTomorrowWeatherDOM = document.querySelector('.main-page > .bottom .tomorrow-temperature > div');
		this.mainTomorrowWeatherIconDOM = document.querySelector('.main-page > .bottom .tomorrow-temperature > img');
		this.weatherForecastDayDOM = document.querySelector('.weather-forecast > .day');
		this.weatherForecastDay0DOM = document.querySelector('.weather-forecast > .day > .day0');
		this.weatherForecastMiddle = document.querySelector('.weather-forecast > .middle');
		this.weatherForecastNighyDOM = document.querySelector('.weather-forecast > .night');
		this.weatherForecastNighy0DOM = document.querySelector('.weather-forecast > .night > .night0');

		this.realTimeWeatherDOM = document.querySelector('.real-time-weather > .flexbox');

		this.activitiesSuggestedDOM = document.querySelector('.activities-suggested');
		this.activitiesSuggestedTrDOMall = document.querySelectorAll('.activities-suggested tr');

		this.suggestDialogDOM = document.querySelector('.suggest-dialog');
		this.suggestDialogTitleDOM = document.querySelector('.suggest-dialog .title');
		this.suggestDialogMessageDOM = document.querySelector('.suggest-dialog .text');
		this.suggestDialogButtonDOM = document.querySelector('.suggest-dialog .ok');
		this.maskDOM = document.querySelector('.gary-mask');

		this.activitiesSuggestedDOM.addEventListener('click', (e) => {
			if (!e.target.closest('.indices1')) {
				return;
			}
			console.log(123);

			let title = e.target.closest('.indices1').dataset.name;
			let message = e.target.closest('.indices1').dataset.text;

			this.suggestDialogTitleDOM.innerHTML = title;
			this.suggestDialogMessageDOM.innerHTML = message;

			this.suggestDialogDOM.style.display = 'block';
			this.maskDOM.style.display = 'block';
			this.suggestDialogDOM.style.animation = 'scroll-up3 0.3s ease-in-out';
		});

		this.suggestDialogButtonDOM.addEventListener('click', () => {
			this.suggestDialogButtonDOM.style.backgroundColor = '#9ABFBA';

			this.maskDOM.style.display = 'none';
			this.suggestDialogDOM.style.animation = 'scroll-down3 0.3s ease-in-out';
			setTimeout(() => {
				this.suggestDialogDOM.style.display = 'none';
			}, 300);
		});
	}

	rander = async (data) => {
		this.#setWeatherNow(data);
		await this.#setWeather7d(data);
		this.#setWeather24h(data);
		this.#setIndices1d(data);
	};

	#setWeatherNow = async (data) => {
		let res = await fetch(`${API.weatherNow}&location=${data}`);
		let json = await res.json();

		this.latestReleaseDOM.innerHTML = `和⻛天气 ${json.updateTime.split('T')[1].split('+')[0]}发布`;
		this.mainCityTemperatureDOM.innerHTML = `${json.now.temp}°`;
		this.mainWeatherTextDOM.innerHTML = json.now.text;
		this.mainHumidityDOM.innerHTML = `湿度 ${json.now.humidity}%`;
		this.mainWindDOM.innerHTML = `${json.now.windDir} ${json.now.windScale}级`;
		this.greetingDOM.innerHTML = '假装这是一句相关天气的问候语';
	};

	#setWeather7d = async (data) => {
		let res = await fetch(`${API.weather7d}&location=${data}`);
		let json = await res.json();

		this.sunrise1 = json.daily[0].sunrise;
		this.sunset1 = json.daily[0].sunset;
		this.sunrise2 = json.daily[1].sunrise;
		this.sunset2 = json.daily[1].sunset;

		this.mainTodayTemperatureDOM.innerHTML = `${json.daily[0].tempMax}/${json.daily[0].tempMin}°`;
		this.mainTodayWeatherDOM.innerHTML = this.#deleteDuplicate(json.daily[0].textDay, json.daily[0].textNight);
		this.mainTodayWeatherIconDOM.src = this.#setIconSrc(json.daily[0].textDay, 'day');
		this.mainTomorrowTemperatureDOM.innerHTML = `${json.daily[1].tempMax}/${json.daily[1].tempMin}°`;
		this.mainTomorrowWeatherDOM.innerHTML = this.#deleteDuplicate(json.daily[1].textDay, json.daily[1].textNight);
		this.mainTomorrowWeatherIconDOM.src = this.#setIconSrc(json.daily[1].textDay, 'day');

		let dayHTML = '';
		for (let i = 0; i < 7; i++) {
			let day = `${json.daily[i].fxDate.split('-')[1]}/${json.daily[i].fxDate.split('-')[2]}`;

			dayHTML += `
        <div class="day${i + 1}">
					<div class="day-text">${this.#setDayOfWeek(json.daily[i].fxDate)}</div>
					<div class="day-date">${day}</div>
					<div class="night-weather">${json.daily[i].textDay}</div>
					<img src="${this.#setIconSrc(json.daily[i].textDay, 'day')}" alt="" />
				</div>
      `;
		}

		let nightHTML = '';
		for (let i = 0; i < 7; i++) {
			nightHTML += `
        <div class="night${i + 1}">
					<img src="${this.#setIconSrc(json.daily[i].textNight, 'night')}" alt="" />
					<div class="day-weather">${json.daily[i].textNight}</div>
					<div class="wind-direction">${json.daily[i].windDirNight}</div>
					<div class="wind-power">${json.daily[i].windScaleNight}级</div>
				</div>
      `;
		}

		this.weatherForecastDay0DOM.querySelector('.day-date').innerHTML = '是昨天吧';
		this.weatherForecastDay0DOM.querySelector('.day-weather').innerHTML = '我不道啊';
		this.weatherForecastDay0DOM.querySelector('img').src = '../images/unknow.png';
		this.weatherForecastNighy0DOM.querySelector('img').src = '../images/unknow.png';
		this.weatherForecastNighy0DOM.querySelector('.night-weather').innerHTML = '我不道啊';
		this.weatherForecastNighy0DOM.querySelector('.wind-direction').innerHTML = '啥啥风';
		this.weatherForecastNighy0DOM.querySelector('.wind-power').innerHTML = '114514级';

		let children = Array.from(this.weatherForecastDayDOM.children);
		for (let i = 1; i < children.length; i++) {
			this.weatherForecastDayDOM.removeChild(children[i]);
		}
		children = Array.from(this.weatherForecastNighyDOM.children);
		for (let i = 1; i < children.length; i++) {
			this.weatherForecastNighyDOM.removeChild(children[i]);
		}

		this.weatherForecastDayDOM.insertAdjacentHTML('beforeend', dayHTML);
		this.weatherForecastNighyDOM.insertAdjacentHTML('beforeend', nightHTML);

		let dayTemperature = [];
		let nightTemperature = [];
		json.daily.forEach((item, index) => {
			dayTemperature[index] = parseInt(item.tempMax);
			nightTemperature[index] = parseInt(item.tempMin);
		});
		// 此处开始制作图表

		let myChart = echarts.init(this.weatherForecastMiddle);

		// 指定图表的配置项和数据
		let option = {
			tooltip: {
				show: false, // 隐藏鼠标悬停的显示效果
			},
			xAxis: {
				type: 'category',
				data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], // 这里假设你有12个小时的数据
				show: false, // 隐藏x轴
			},
			yAxis: {
				type: 'value',
				min: Math.min(...dayTemperature, ...nightTemperature), // 这里我们设置y轴最小值为两组温度数据中的最小值
				show: false, // 隐藏y轴
			},
			grid: {
				// 网格配置
				show: false, // 隐藏网格线

				left: '60', // 距离容器左侧的距离
				right: '-350', // 距离容器右侧的距离
				top: '20', // 距离容器顶部的距离
				bottom: '20', // 距离容器底部的距离
				containLabel: true, // 是否包含坐标轴的标签，如果你的标签被切掉，可以设置此项为true
			},
			series: [
				{
					name: '白天温度',
					type: 'line',
					data: dayTemperature,
					label: {
						show: true,
						position: 'top',
						formatter: '{c}°',
					},
					lineStyle: {
						color: '#ffb74d', // 你可以根据需要更改折线的颜色
					},
					smooth: true, // 这会使折线平滑
					symbol: 'circle', // 设置点的形状
					itemStyle: {
						color: '#ffb74d', // 设置点的颜色
						borderWidth: 0, // 设置点的描边宽度，0 表示没有描边
					},
					label: {
						show: true,
						position: 'top',
						formatter: '{c}°',
						color: '#000000', // 设置标签颜色为黑色
					},
				},
				{
					name: '夜间温度',
					type: 'line',
					data: nightTemperature,
					symbol: 'circle', // 设置点的形状
					itemStyle: {
						color: '#4fc3f7', // 设置点的颜色
						borderWidth: 0, // 设置点的描边宽度，0 表示没有描边
					},
					label: {
						show: true,
						position: 'bottom',
						formatter: '{c}°',
						color: '#000000', // 设置标签颜色为黑色
					},
					lineStyle: {
						color: '#4fc3f7', // 你可以根据需要更改折线的颜色
					},
					smooth: true, // 这会使折线平滑
				},
			],
		};

		myChart.setOption(option);
		// myChart.resize();
	};

	#setWeather24h = async (data) => {
		let res = await fetch(`${API.weather24h}&location=${data}`);
		let json = await res.json();

		let jsonAfter = this.#get24hJson(json);

		let weather24hHTML = '';

		let sunriseTime1 = parseInt(this.sunrise1.split(':')[0]);
		let sunsetTime1 = parseInt(this.sunset1.split(':')[0]);
		let sunriseTime2 = parseInt(this.sunrise2.split(':')[0]);
		let sunsetTime2 = parseInt(this.sunset2.split(':')[0]);

		let sunriseTime = sunriseTime1;
		let sunsetTime = sunsetTime1;

		if (sunriseTime1 < parseInt(jsonAfter.hourly[0].fxTime.split('T')[1].split(':')[0])) {
			sunriseTime = sunriseTime2;
		}
		if (sunsetTime1 < parseInt(jsonAfter.hourly[0].fxTime.split('T')[1].split(':')[0])) {
			sunsetTime = sunsetTime2;
		}

		for (let i = 0; i < 26; i++) {
			let time = jsonAfter.hourly[i].fxTime.split('T')[1].split('+')[0];
			let hour = parseInt(time.split(':')[0]);
			let d = 'night';
			let temperature = `${jsonAfter.hourly[i].temp}°`;

			if (hour > sunriseTime && hour <= sunsetTime) {
				d = 'day';
			}
			if (jsonAfter.hourly[i].text == 'sunset') {
				d = 'sunset';
				temperature = '日落';
			}
			if (jsonAfter.hourly[i].text == 'sunrise') {
				d = 'sunrise';
				temperature = '日出';
			}
			if (time == '00:00') {
				time = '明天';
			}

			weather24hHTML += `
        <div class="time${i + 1}">
          <div class="time">${time}</div>
          <img src="${this.#setIconSrc(jsonAfter.hourly[i].text, d)}" alt="" />
          <div class="temperature">${temperature}</div>
        </div>
      `;
		}

		this.realTimeWeatherDOM.innerHTML = weather24hHTML;
	};

	#setIndices1d = async (data) => {
		let res = await fetch(`${API.indices1d_1}&location=${data}`);
		let json = await res.json();

		let html1 = '';
		for (let i = 0; i < 8; i++) {
			html1 += `
        <td class="indices1" data-name="${json.daily[i].name}" data-text="${json.daily[i].text}">
          <div>
            <img src="../images/indices/${i + 1}.png" alt="" />
            <div class="suggest">${json.daily[i].category}</div>
            <div class="active">${json.daily[i].name}</div>
          </div>
        </td>
      `;
		}
		let html2 = '';
		for (let i = 8; i < 16; i++) {
			html2 += `
        <td class="indices1" data-name="${json.daily[i].name}" data-text="${json.daily[i].text}">
          <div>
            <img src="../images/indices/${i + 1}.png" alt="" />
            <div class="suggest">${json.daily[i].category}</div>
            <div class="active">${json.daily[i].name}</div>
          </div>
        </td>
      `;
		}
		this.activitiesSuggestedTrDOMall[0].innerHTML = html1;
		this.activitiesSuggestedTrDOMall[1].innerHTML = html2;
	};

	#setIconSrc = (weather, time) => {
		if (time == 'day') {
			switch (weather) {
				case '晴':
					return '../images/day/qing.png';
				case '阴':
					return '../images/day/yin.png';
				case '雨':
				case '小雨':
				case '中雨':
				case '大雨':
				case '暴雨':
				case '大暴雨':
				case '特大暴雨':
				case '阵雨':
				case '极端降雨':
					return '../images/day/yu.png';
				case '雷阵雨':
					return '../images/thunderstorms.svg';
				case '多云':
					return '../images/day/yun.png';
				default:
					return '../images/unknow.png';
			}
		}
		if (time == 'night') {
			switch (weather) {
				case '晴':
					return '../images/night/qing.png';
				case '阴':
					return '../images/night/yin.png';
				case '雨':
				case '小雨':
				case '中雨':
				case '大雨':
				case '暴雨':
				case '大暴雨':
				case '特大暴雨':
				case '阵雨':
				case '极端降雨':
					return '../images/night/yu.png';
				case '雷阵雨':
					return '../images/thunderstorms.svg';
				case '多云':
					return '../images/night/yun.png';
				default:
					return '../images/unknow.png';
			}
		}
		if (time == 'sunset') {
			return '../images/set.png';
		}
		if (time == 'sunrise') {
			return '../images/rise.png';
		}
	};

	#deleteDuplicate = (a, b) => {
		if (a == b) {
			return a;
		}
		return `${a}转${b}`;
	};

	#setDayOfWeek = (date) => {
		let now = new Date().getDate();
		let day = new Date(date).getDate();
		let minus = day - now;
		if (minus <= 2) {
			switch (minus) {
				case -1:
					return '昨天';
				case 0:
					return '今天';
				case 1:
					return '明天';
				case 2:
					return '后天';
			}
		}
		switch (new Date(date).getDay()) {
			case 0:
				return '周日';
			case 1:
				return '周一';
			case 2:
				return '周二';
			case 3:
				return '周三';
			case 4:
				return '周四';
			case 5:
				return '周五';
			case 6:
				return '周六';
		}
	};

	// 这是用来把日出日落插入进24小时天气的函数
	#get24hJson = (json) => {
		let resultJson = json;
		// 这是判断日出日落是否应该插到第二天（就是0点过后）的布尔值
		let day2 = false;
		let night2 = false;

		// 这一大串是获取应该用的日出日落时间（因为接口只能从7天天气预报那搞到两天的，只能自行判断）
		let sunriseTime1 = parseInt(this.sunrise1.split(':')[0]);
		let sunsetTime1 = parseInt(this.sunset1.split(':')[0]);

		let realSunrise = this.sunrise1;
		let realSunset = this.sunset1;

		if (sunriseTime1 < parseInt(json.hourly[0].fxTime.split('T')[1].split(':')[0])) {
			realSunrise = this.sunrise2;
			day2 = true;
		}
		if (sunsetTime1 < parseInt(json.hourly[0].fxTime.split('T')[1].split(':')[0])) {
			realSunset = this.sunset2;
			night2 = true;
		}

		// 这是如果判断是得插第二天，就先获取第二天从数组里哪一号开始
		let h24Index = 0;
		if (day2 || night2) {
			for (let i = 0; i < json.hourly.length; i++) {
				if (json.hourly[i].fxTime.split('T')[1].split(':')[0] == '00') {
					h24Index = i;
					break;
				}
			}
		}

		let sunriseHour = parseInt(realSunrise.split(':')[0]);
		let sunsetHour = parseInt(realSunset.split(':')[0]);

		// 这是获取日出要插哪
		let sunriseIndex = 0;
		let i = 0;
		if (day2) {
			i = h24Index;
		}
		while (i < json.hourly.length) {
			if (sunriseHour < parseInt(json.hourly[i].fxTime.split('T')[1].split(':')[0])) {
				sunriseIndex = i;
				break;
			}
			i++;
		}

		resultJson.hourly.splice(sunriseIndex, 0, { fxTime: `2023-06-23T${realSunrise}+08:00`, text: 'sunrise' });

		// 这是获取日落要插哪
		let sunsetIndex = 0;
		i = 0;
		if (night2) {
			i = h24Index;
		}
		while (i < json.hourly.length) {
			if (sunsetHour < parseInt(json.hourly[i].fxTime.split('T')[1].split(':')[0])) {
				sunsetIndex = i;
				break;
			}
			i++;
		}

		json.hourly.splice(sunsetIndex, 0, { fxTime: `2023-06-23T${realSunset}+08:00`, text: 'sunset' });

		return resultJson;
	};
}