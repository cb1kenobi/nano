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
], function(arr, decl, fx, lang, attr, cls, dom, geom, style, fx2, query){

var css = "nanoTabs";

return decl("nano.Tabs", null, {

	constructor: function(params, node){
		var _t = this,
			strip = dom.create("div", {
				className: css + "Strip"
			}),
			wrapper = dom.create("div", {
				className: css + "Wrapper"
			});

		_t._panes = [];

		// setup the panes
		query(">", node).forEach(function(n, i){
			var a = function(t){
						return attr.get(n, t) || "";
					},
				p = {
						idx: i,
						tab: dom.create("div", {
							className: css + "Tab",
							innerHTML: a("title"),
							title: a("data-tooltip")
						}, strip),
						node: n
					};
			wrapper.appendChild(n);
		});

		dom.place(strip, node);
		dom.place(wrapper, node);

		// set the active pane
		arr.forEach(_t._panes, function(p, i){
			/*
			_t._select(p);
			if(i != _t._selectedIdx){
				style.set(p.wrapper, {
					display: "none",
					height: 0
				});
			}
			*/
		});

		if(params.onload){
			params.onload.apply(_t);
		}
	}

});

});
