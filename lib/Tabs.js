define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/query"
], function(arr, decl, lang, win, attr, css, dom, geom, style, query){

var cls = "nanoTab";

return decl("nano.Tabs", null, {

	_selectedIdx: 0,

	constructor: function(params, node){
		var _t = this
			create = function(c, p){
				return dom.create("div", { className: c }, p);
			},
			tablist = create(cls + "List"),
			wrapper = create(cls + "Panes");

		_t._panes = [];

		// setup the panes
		query(">", node).forEach(function(n, i){
			var a = function(t){
						return attr.get(n, t) || "";
					},
				t,
				p = {
						idx: i,
						title: dom.create("div",
							{
								className: cls + "Label " + a("data-iconclass"),
								innerHTML: a("title"),
								title: a("data-tooltip"),
								onkeypress: function(e){
									var i = _t._selectedIdx,
										j = i,
										l = _t._panes.length;
									switch(e.keyCode){
										case 36: // home
											j = 0;
											break;
										case 33: case 37: case 38: // page up, left arrow, up arrow
											j = i < 1 ? l - 1 : i - 1;
											break;
										case 35: // end
											j = l - 1;
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
							create(cls + "Content", create(cls + "Inner", t = create(cls, tablist)))
						),
						node: n
					};

			css.add(n, cls + "Pane");
			wrapper.appendChild(n);

			if (a("data-selected") == "true") {
				_t._selectedIdx = i;
			}

			p.tab = t;
			_t._panes.push(p);
		});

		dom.place(tablist, node);
		dom.place(wrapper, node);

		// set the active pane
		arr.forEach(_t._panes, lang.hitch(_t, "_select"));

		if(params.onload){
			params.onload.apply(_t);
		}
	},

	_show: function(i, c, n, k){
		if(i != this._selectedIdx){
			this._selectedIdx = i;
			this._select(c, k);
			this._select(n, k);
		}
	},

	_select: function(p, k){
		var a = (p.idx == this._selectedIdx);
		attr.set(p.title, "tabIndex", a ? 0 : -1);
		css[a ? "add" : "remove"](p.tab, cls + "Selected");
		style.set(p.node, "display", a ? "" : "none");
		if(k){
			p.title[a ? "focus" : "blur"]();
		}
	}

});

});
