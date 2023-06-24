import { SetInformation } from './js/setInformation.js';
import { Search } from './js/search.js';

let search = new Search();
// 初始默认值
let fn = new SetInformation('101044000');
document.querySelector('.location-word > span').innerHTML = '重庆市 南岸区';

let mainDOM = document.querySelector('.main');
let searchDOM = document.querySelector('.search');
let locationDOM = document.querySelector('.location-word');

locationDOM.addEventListener('click', () => {
	searchDOM.style.animation = 'scroll-down2 0.3s ease-in-out forwards';
	setTimeout(() => {
		mainDOM.style.display = 'none';
	}, 300);
});

window.addEventListener('hashchange', () => {
	let hash = window.location.hash;
	let cityCode = hash.slice(1);
	fn.rander(cityCode);
});
