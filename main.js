import { SetInformation } from './js/setInformation.js';
import { Search } from './js/search.js';
import { tencentLocationKey } from './js/API.js';
import { getLocation } from './js/API.js';
import { jsonp } from './js/getCity.js';
import { getCityCode } from './js/getCity.js';
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
		// 取到从腾讯位置信息api的当前地理位置信息，然后根据地理位置信息获取城市代码，然后渲染首页天气
		let res = await getCityCode(result.ad_info.district);
		document.querySelector('.location-word > span').innerHTML = `${res[0].adm1} ${res[0].adm2} ${res[0].name}`;
		fn.rander(res[0].id);

		console.log(result);
		console.log(res);
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
