define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/fx",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/fx",
	"dojo/query"
], function(arr, decl, fx, lang, attr, css, dom, geom, style, fx2, query){

var cls = "nanoAccordion";

return decl("nano.Accordion", null, {

	duration: 250,

	_selectedIdx: 0,

	constructor: function(params, node){
		var _t = this;
		_t._panes = [];

		// setup the panes
		query(">", node).forEach(function(n, i){
			var a = function(t){
						return attr.get(n, t) || "";
					},
				c = dom.create("div", {
						className: cls + "Container"
					}, node),
				p = {
					idx: i,
					container: c,
					title: dom.create("div", {
							className: a("data-iconclass"),
							innerHTML: a("title"),
							title: a("data-tooltip"),
							onkeypress: function(e){
								var i = _t._selectedIdx,
									j = i,
									l = _t._panes.length;;
								switch(e.keyCode){
									case 33: case 37: case 38: // page up, left arrow, up arrow
										j = i < 1 ? l - 1 : i - 1;
										break;
									case 34: case 39: case 40: // page down, right arrow, down arrow
										j = i + 1 < l ? i + 1 : 0;
										break;
								}
								_t._show(j, _t._panes[i], _t._panes[j], true);
							},
							onclick: (function(j){
								return function(){
									_t._show(j, _t._panes[_t._selectedIdx], _t._panes[j]);
								};
							}(i))
						},
						dom.create("div", {
							className: cls + "Title"
						}, c)
					),
					wrapper: dom.create("div", {
						className: cls + "Wrapper"
					}, c),
					content: n
				};

			a("data-selected") == "true" && (_t._selectedIdx = i);

			dom.place(n, p.wrapper);
			style.set(n, "display", "block");
			css.add(n, cls + "Inner");
			_t._panes.push(p);
		});

		// set the active pane
		arr.forEach(_t._panes, function(p, i){
			_t._select(p);
			i != _t._selectedIdx && style.set(p.wrapper, {
				display: "none",
				height: 0
			});
		});

		params.onload && params.onload.apply(_t);
	},

	_show: function(i, c, n, k){
		if(i != this._selectedIdx){
			var cw = c.wrapper,
				nw = n.wrapper,
				wh,
				ch,
				fn = function(){
					style.set(cw, "display", "none");
					style.set(nw, "height", ch + "px");
				};

			this._anim && this._anim.stop();
			this._selectedIdx = i;
			this._select(c, k);
			this._select(n, k);

			// need to show the next pane and set its height to zero so it isn't visible
			style.set(nw, { display:"block", height:0 });

			// then get the contnet height and the wrapper's collapsed height including margins
			ch = geom.getMarginBox(n.content).h;
			wh = geom.getMarginBox(nw).h;

			this._anim = fx2.combine([
				fx.animateProperty({
					node: cw,
					duration: this.duration,
					properties: {
						height: { start: geom.getMarginBox(c.content).h - wh, end: 0 }
					}
				}),
				fx.animateProperty({
					node: nw,
					duration: this.duration,
					properties: {
						height: { start: 0, end: ch - wh }
					},
					onStop: fn,
					onEnd: fn
				})
			]).play();
		}
	},

	_select: function(p, k){
		var a = (p.idx == this._selectedIdx);
		attr.set(p.title, "tabIndex", a ? 0 : -1);
		css[a ? "add" : "remove"](p.container, cls + "Selected");
		k && p.title[a ? "focus" : "blur"]();
	}

});

});
