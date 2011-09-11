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
], function(arr, decl, fx, lang, attr, cls, ctr, geom, style, fx2, query){

var css = "nanoAccordion";

return decl("nano.Accordion", null, {

	duration: 250,

	_selectedIdx: 0,

	constructor: function(params, node){
		var _t = this;
		_t._panes = [];

		// setup the panes
		query(">", node).forEach(function(n, i){
			var c = ctr.create("div", {
						className: css + "Container"
					}, node),
				p = {
					idx: i,
					container: c,
					title: ctr.create("div", {
							innerHTML: attr.get(n, "title"),
							onkeypress: function(e){
								var i = _t._selectedIdx,
									j = i,
									l = _t._panes.length,
									p, q;
								switch(e.keyCode){
									case 33: case 37: case 38: // page up, left arrow, up arrow
										j = i < 1 ? l - 1 : i - 1;
										break;
									case 34: case 39: case 40: // page down, right arrow, down arrow
										j = i + 1 < l ? i + 1 : 0;
										break;
								}
								if(i != j){
									_t._show(j, p = _t._panes[i], q = _t._panes[j]);
									p.title.blur();
									q.title.focus();
								}
							},
							onclick: (function(j){
								return function(){
									if(j != _t._selectedIdx){
										_t._show(j, _t._panes[_t._selectedIdx], _t._panes[j]);
									}
								};
							}(i))
						},
						ctr.create("div", {
							className: css + "Title"
						}, c)
					),
					wrapper: ctr.create("div", {
						className: css + "Wrapper"
					}, c),
					content: n
				};

			if (attr.get(n, "data-selected") == "true") {
				_t._selectedIdx = i;
			}

			ctr.place(n, p.wrapper);
			style.set(n, "display", "block");
			cls.add(n, css + "Inner");
			_t._panes.push(p);
		});

		// set the active pane
		arr.forEach(_t._panes, function(p, i){
			_t._select(p);
			if(i != _t._selectedIdx){
				style.set(p.wrapper, {
					display: "none",
					height: 0
				});
			}
		});

		if(params.onload){
			params.onload.apply(_t);
		}
	},

	_show: function(i, c, n){
		var cw = c.wrapper,
			nw = n.wrapper,
			wh,
			ch,
			fn = function(){
				style.set(cw, "display", "none");
				style.set(nw, "height", ch + "px");
			};

		if(this._anim){
			this._anim.stop();
		}

		this._selectedIdx = i;
		this._select(c);
		this._select(n);

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
	},

	_select: function(p){
		var a = (p.idx == this._selectedIdx);
		attr.set(p.title, "tabIndex", a ? 0 : -1);
		cls[a ? "add" : "remove"](p.container, css + "Selected");
	}

});

});
