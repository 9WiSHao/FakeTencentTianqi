import { SetInformation } from './js/setInformation.js';
import { Search } from './js/search.js';
import { tencentLocationKey } from './js/API.js';
import { getLocation } from './js/API.js';
import { jsonp } from './js/getCity.js';
import { getCityCode } from './js/getCity.js';
import { getMatchedCity } from './js/getCity.js';

let mainDOM = document.querySelector('.main');
let searchDOM = document.querySelector('.search');
let locationDOM = document.querySelector('.location-word');

let search = new Search();
// 初始默认值
let fn = new SetInformation('101044000');
document.querySelector('.location-word > span').innerHTML = '重庆市 南岸区';

// 首次打开的时候来获取用户的地理位置
jsonp({
	url: getLocation,
	data: {
		key: tencentLocationKey,
		output: 'jsonp',
	},
	success: async function (result) {
		let district = result.ad_info.district;
		let city = result.ad_info.city.split('市')[0];
		let province = result.ad_info.province;

		let cityMatched = await getMatchedCity(province, city, district);

		if (cityMatched.cityCode === 0) {
			alert('定位失败，请手动选择城市');
			return;
		}

		let displayLocation = district ? `${cityMatched.province} ${cityMatched.city} ${cityMatched.district}` : `${cityMatched.province} ${cityMatched.city}`;
		document.querySelector('.location-word > span').innerHTML = displayLocation;
		fn.rander(cityMatched.cityCode);
	},
});

// 监听搜索框打开按钮
locationDOM.addEventListener('click', () => {
	searchDOM.style.animation = 'scroll-down2 0.3s ease-in-out forwards';
	setTimeout(() => {
		mainDOM.style.display = 'none';
	}, 300);
});

// 监听地址栏hash变化，根据城市地址渲染首页天气
window.addEventListener('hashchange', () => {
	let hash = window.location.hash;
	let cityCode = hash.slice(1);
	fn.rander(cityCode);
});
