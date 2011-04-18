var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-20878765-1'], ['_trackPageview']);

YUI().use('yql', 'event-valuechange', function (Y) {
	var currs = ['USD', 'EUR', 'SEK', 'GBP'],
		ncurrs = currs.length,
		pairs = [],
		rates = {},
		i = 0, j,
		listhtml = '';

	for (; i < ncurrs; i++) {
		listhtml += Y.Lang.sub('<li><label for="{c}">{c}</label><input id="{c}" value="0" type="number" min="0" /></li>', {c: currs[i]});
		for (j = 0; j < ncurrs; j++) {
			if (i !== j) {
				pairs.push(currs[i] + currs[j]);
			}
		}
	}
	Y.YQL('select id, Rate from yahoo.finance.xchange where pair = "' + pairs + '"', function (r) {
		Y.Array.each(r.query.results.rate, function (o) {
			rates[o.id] = parseFloat(o.Rate);
		});
		Y.one('#loading').remove(true);
		Y.one('body').insert('<ul>' + listhtml + '</ul>');
		Y.one('input').focus();
		Y.all('input').on('valueChange', function (e) {
			var amount = parseFloat(e.newVal), src = e.currentTarget.get('id'), dest, i = 0;
			for (amount = Y.Lang.isNumber(amount) && amount > 0 ? amount : 0; i < ncurrs; i++) {
				dest = currs[i];
				if (dest !== src) {
					this.item(i).set('value', Math.round(amount * rates[src + dest] * 100) / 100);
				}
			}
		});
	});
	Y.Get('http://www.google-analytics.com/ga.js', { attributes: { async: true } });
});

