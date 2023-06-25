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
		let district = result.ad_info.district;
		let city = result.ad_info.city.split('市')[0];
		let province = result.ad_info.province;

		let searchResults = await getCityCode(result.ad_info.district);
		let cityCode = 0;
		let matchLevel = 0; // 匹配等级，0 未匹配，1 匹配省，2 匹配省+市，3 匹配省+市+区
		// 把定位出来的和和风天气模糊搜索出来的逐级匹配，选择匹配最成功的是真实地址
		for (let i = 0; i < searchResults.length; i++) {
			// 匹配省
			if (searchResults[i].adm1 === province && matchLevel < 1) {
				cityCode = searchResults[i].id;
				matchLevel = 1;
			}
			// 匹配省+市
			if (searchResults[i].adm1 === province && searchResults[i].adm2 === city && matchLevel < 2) {
				cityCode = searchResults[i].id;
				matchLevel = 2;
			}
			// 匹配省+市+区
			if (searchResults[i].adm1 === province && searchResults[i].adm2 === city && searchResults[i].name === district && matchLevel < 3) {
				cityCode = searchResults[i].id;
				matchLevel = 3;
				break;
			}
		}
		if (cityCode === 0) {
			alert('定位失败，请手动选择城市');
			return;
		}

		document.querySelector('.location-word > span').innerHTML = `${province} ${city} ${district}`;
		fn.rander(cityCode);
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
