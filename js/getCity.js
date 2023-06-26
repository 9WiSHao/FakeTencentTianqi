import { API } from './API.js';

export async function getCityCode(search) {
	let res = await fetch(`${API.city}&location=${search}`);
	let json = await res.json();

	if (json.code != '200') {
		console.log('请求失败');
		return '请求失败';
	}
	return json.location;
}

export async function getHotCity() {
	let res = await fetch(`${API.hotCity}&number=12`);
	let json = await res.json();

	if (json.code != '200') {
		console.log('请求失败');
		return '请求失败';
	}
	return json.topCityList;
}

// 这是腾讯位置的api，不能用fetch只能用JSONP，所以只能封装一个JSONP方法
export function jsonp(options) {
	let params = '';
	for (let k in options.data) {
		params += `&${k}=${options.data[k]}`;
	}
	// 创建一个唯一的回调函数名，避免冲突
	let fnName = 'jsonpCallback_' + Date.now() + Math.round(Math.random() * 1000);
	// 生成 script 标签
	let script = document.createElement('script');
	window[fnName] = function (data) {
		// 在回调函数中，把原来的 result 对象传递给用户定义的回调函数
		options.success(data.result);
		// 用完后，删除全局函数和 script 标签
		delete window[fnName];
		document.body.removeChild(script);
	};
	// 设置 src 属性，包括 callback 参数和其他参数
	script.src = options.url + '?callback=' + fnName + params;
	// 把 script 标签添加到页面中
	document.body.append(script);
}

// 通过省市区来匹配城市代码（主要原因是因为和风天气获取城市是模糊搜索，跟地址api的不一定完全匹配）
export async function getMatchedCity(province, city, district) {
	let searchKeyword = district ? district : city;
	let searchResults = await getCityCode(searchKeyword);

	let cityMatched = {
		province: province,
		city: city,
		district: district,
		cityCode: 0,
	};
	let matchLevel = 0;

	for (let i = 0; i < searchResults.length; i++) {
		// 匹配省
		if (searchResults[i].adm1 === province && matchLevel < 1) {
			cityMatched.province = searchResults[i].adm1;
			cityMatched.city = searchResults[i].adm2;
			cityMatched.district = searchResults[i].name;
			cityMatched.cityCode = searchResults[i].id;
			matchLevel = 1;
		}
		// 匹配省+市
		if (searchResults[i].adm1 === province && searchResults[i].adm2 === city && matchLevel < 2) {
			cityMatched.province = searchResults[i].adm1;
			cityMatched.city = searchResults[i].adm2;
			cityMatched.district = searchResults[i].name;
			cityMatched.cityCode = searchResults[i].id;
			matchLevel = 2;
		}
		// 匹配省+市+区
		if (district && searchResults[i].adm1 === province && searchResults[i].adm2 === city && searchResults[i].name === district && matchLevel < 3) {
			cityMatched.province = searchResults[i].adm1;
			cityMatched.city = searchResults[i].adm2;
			cityMatched.district = searchResults[i].name;
			cityMatched.cityCode = searchResults[i].id;
			matchLevel = 3;
			break;
		}
	}

	return cityMatched;
}
