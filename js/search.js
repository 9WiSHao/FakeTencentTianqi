import { getCityCode } from './getCity.js';
import { getHotCity } from './getCity.js';

export class Search {
	constructor() {
		this.mainDOM = document.querySelector('.main');
		this.searchDOM = document.querySelector('.search');
		this.cancelDOM = document.querySelector('.search-top .cancel');

		this.searchInputDOM = document.querySelector('.search-top .input input');
		this.searchMainDOM = document.querySelector('.search-body .search-main');
		this.searchSuggestDOM = document.querySelector('.search-suggest');
		this.historyDOM = document.querySelector('.search-main .history');
		this.historyDeleteDOM = document.querySelector('.search-main .history .title img');
		this.historySeleteDOM = document.querySelector('.search-main .history .place');
		this.hotSeleteDOM = document.querySelector('.search-main .hot .place');

		this.cityNameDOM = document.querySelector('.location-word > span');

		this.cancelDOM.addEventListener('click', () => {
			this.searchDOM.style.animation = 'scroll-up2 0.3s ease-in-out forwards';
			this.mainDOM.style.display = 'block';
		});

		this.#renderHotCity();
		this.#mainSearch();
		this.#renderHistory();
	}

	reRander = () => {
		// 重新渲染历史记录
		let historyArr = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
		if (historyArr.length == 0) {
			this.historyDOM.style.display = 'none';
			return;
		}
		let html = '';
		for (let i = 0; i < historyArr.length; i++) {
			html += `<div class="place1" data-city-code="${historyArr[i].citycode}">${historyArr[i].cityname}</div>`;
		}
		this.historyDOM.style.display = 'block';
		this.historySeleteDOM.innerHTML = html;
	};

	#renderHotCity = async () => {
		let cityArr = await getHotCity();

		let html = '';
		for (let i = 0; i < 12; i++) {
			let name = `${cityArr[i].adm2} ${cityArr[i].name}`;
			if (cityArr[i].adm2 == cityArr[i].name) {
				name = cityArr[i].name;
			}
			html += `<div class="place1" data-city-code="${cityArr[i].id}">${name}</div>`;
		}
		this.hotSeleteDOM.innerHTML = html;

		this.hotSeleteDOM.addEventListener('click', (e) => {
			if (!e.target.classList.contains('place1')) {
				return;
			}
			let cityCode = e.target.dataset.cityCode;
			let cityName = e.target.innerText;
			window.location.hash = cityCode;
			// 改变hash值。同时把搜索记录存到localStorage里面
			this.#saveHistory(cityName, cityCode);

			this.searchDOM.style.animation = 'scroll-up2 0.3s ease-in-out forwards';
			this.mainDOM.style.display = 'block';

			this.cityNameDOM.innerText = cityName;
		});
	};

	#mainSearch = () => {
		// 放一个标志来判断是不是点击了搜索建议，防止点击搜索建议的时候，输入框失去焦点，就直接关了搜索
		let clickedSuggestion = false;

		this.searchInputDOM.addEventListener('focus', () => {
			this.searchMainDOM.style.display = 'none';
			this.searchSuggestDOM.style.display = 'block';
		});
		this.searchInputDOM.addEventListener('blur', () => {
			// 此处用setTimeout是因为，点击搜索建议的时候，会触发blur事件，但是点击搜索建议的时候，会触发click事件，所以用setTimeout来延迟执行，如果点击了搜索建议，就不执行这个函数
			setTimeout(() => {
				if (!clickedSuggestion) {
					this.searchMainDOM.style.display = 'block';
					this.searchSuggestDOM.style.display = 'none';
				}
				clickedSuggestion = false;
			}, 100);
		});

		// 给输入框加一层防抖，不让他每次输入变化都请求一次
		let searchHandler = this.debounce(async () => {
			let search = this.searchInputDOM.value;
			let cityArr = await getCityCode(search);
			if (cityArr == '请求失败') {
				return;
			}

			let html = '';
			for (let i = 0; i < cityArr.length; i++) {
				let city = `${cityArr[i].adm1} ${cityArr[i].adm2} ${cityArr[i].name}`;
				if (cityArr[i].adm2 == cityArr[i].name) {
					city = `${cityArr[i].adm1} ${cityArr[i].name}`;
					if (cityArr[i].adm1 == cityArr[i].name) {
						city = cityArr[i].name;
					}
				}
				html += `<div class="suggest1" data-city-code="${cityArr[i].id}">${city}</div>`;
			}

			this.searchSuggestDOM.innerHTML = html;
		}, 300);

		this.searchInputDOM.addEventListener('input', () => {
			if (this.searchInputDOM.value != '') {
				this.searchSuggestDOM.innerHTML = '<div class="loading">加载中...</div>';
				searchHandler();
			}
		});
		// 点击搜索建议的搜索
		this.searchSuggestDOM.addEventListener('mousedown', (e) => {
			if (!e.target.classList.contains('suggest1')) {
				return;
			}
			clickedSuggestion = true;
			let cityCode = e.target.dataset.cityCode;
			let cityName = e.target.innerText;
			window.location.hash = cityCode;
			// 改变hash值。同时把搜索记录存到localStorage里面
			this.#saveHistory(cityName, cityCode);

			// 这是把搜索页面上拉回去
			this.searchDOM.style.animation = 'scroll-up2 0.3s ease-in-out forwards';
			this.mainDOM.style.display = 'block';
			// 回初始搜索页面
			this.searchMainDOM.style.display = 'block';
			this.searchSuggestDOM.style.display = 'none';

			this.cityNameDOM.innerText = cityName;
		});
	};

	#renderHistory = () => {
		let historyArr = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
		if (historyArr.length == 0) {
			this.historyDOM.style.display = 'none';
			return;
		}
		// 渲染历史记录
		let html = '';
		for (let i = 0; i < historyArr.length; i++) {
			html += `<div class="place1" data-city-code="${historyArr[i].citycode}">${historyArr[i].cityname}</div>`;
		}
		this.historyDOM.style.display = 'block';
		this.historySeleteDOM.innerHTML = html;

		// 点击历史记录
		this.historyDOM.addEventListener('click', (e) => {
			if (!e.target.classList.contains('place1')) {
				return;
			}
			let cityCode = e.target.dataset.cityCode;

			window.location.hash = cityCode;

			this.searchDOM.style.animation = 'scroll-up2 0.3s ease-in-out forwards';
			this.mainDOM.style.display = 'block';

			this.cityNameDOM.innerText = e.target.innerText;
		});

		// 删除历史记录按钮
		this.historyDeleteDOM.addEventListener('click', () => {
			localStorage.removeItem('history');
			this.historyDOM.style.display = 'none';
		});
	};

	// 防抖函数
	debounce(func, wait) {
		let timeout;
		return function () {
			let context = this,
				args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				func.apply(context, args);
			}, wait);
		};
	}

	#saveHistory = (cityname, citycode) => {
		let historyArr = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
		let obj = {
			cityname,
			citycode,
		};
		historyArr.push(obj);
		localStorage.setItem('history', JSON.stringify(historyArr));
	};
}
