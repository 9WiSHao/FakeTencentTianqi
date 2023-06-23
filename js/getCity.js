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
