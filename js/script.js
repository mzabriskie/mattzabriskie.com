var app = (function () {
	function xhr(url, data, callback) {
		try {
			var x = new(this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
			x.open(data ? 'POST' : 'GET', url, true);
			x.setRequestHeader('X-Requested-With', 'XMLHtpRequest');
			x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			x.onreadystatechange = function () {
				x.readyState > 3 && callback && callback(x.responseText, x);
			};
			x.send(data);
		} catch (e) {
			window.console && console.log(e);
		}
	}

	function initMenu() {
		var button = document.querySelector('header button'),
			menu = document.querySelector('header ul');

		button.onclick = function () {
			button.className = button.className === 'active' ? '' : 'active';
			menu.className = menu.className === 'slide' ? '' : 'slide';
		};

		menu.onclick = function (e) {
			var target = e.target || e.srcElement;
			if ('A' === target.nodeName && menu.className.indexOf('slide') > -1) {
				menu.className = '';
			}
		};
	}

	function initProjects() {
		xhr('https://api.github.com/users/mzabriskie/repos', null, function (response) {
			// Parse response
			var repos = JSON.parse(response);

			// Sort repositories by stargazers
			repos = repos.sort(function (a, b) {
				if (a.stargazers_count > b.stargazers_count) {
					return -1;
				} else if (b.stargazers_count > a.stargazers_count) {
					return 1;
				} else {
					return Date.parse(b.updated_at) - Date.parse(a.updated_at);
				}
			});

			// Show top five
			var dl = document.querySelector('dl');
			for (var i=0; i<5; i++) {
				var repo = repos[i],
					dt = document.createElement('dt'),
					dd = document.createElement('dd'),
					a = document.createElement('a'),
					fork = document.createElement('iframe'),
					watch = document.createElement('iframe');

				dl.appendChild(dt);
				dl.appendChild(dd);
				dt.appendChild(a);
				dt.appendChild(fork);
				dt.appendChild(watch);

				a.innerHTML = repo.name;
				dd.innerHTML = repo.description;

				a.setAttribute('href', repo.html_url);
				a.setAttribute('target', '_blank');

				fork.setAttribute('src', 'http://ghbtns.com/github-btn.html?user=mzabriskie&repo=' + repo.name + '&type=fork&count=true');
				fork.setAttribute('allowtransparency', 'true');
				fork.setAttribute('frameborder', '0');
				fork.setAttribute('scrolling', '0');
				fork.setAttribute('width', '75');
				fork.setAttribute('height', '20');
				fork.setAttribute('class', 'right');

				watch.setAttribute('src', 'http://ghbtns.com/github-btn.html?user=mzabriskie&repo=' + repo.name + '&type=watch&count=true');
				watch.setAttribute('allowtransparency', 'true');
				watch.setAttribute('frameborder', '0');
				watch.setAttribute('scrolling', '0');
				watch.setAttribute('width', '75');
				watch.setAttribute('height', '20');
				watch.setAttribute('class', 'right');
			}
		});
	}

	return {
		init: function () {
			initMenu();
			initProjects();
		}
	};
})();