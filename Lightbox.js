define([
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/has",
	"dojo/on",
	"dojo/query",
	"dojo/window",
	"dojo/NodeList-traverse"
], function(decl, evt, lang, win, attr, cls, dom, geom, style, has, on, query, view){

var transitionEvent = has("webkit") ? "webkitTransitionEnd" : "transitionend";

return decl("nano.Lightbox", null, {

	constructor: function(params, node){
		var _t = this,
			n = (params.query ? query(params.query, query("*", node).length ? node : win.body()) : new query.NodeList(node)).filter(function(a){
				return !!attr.get(a, "href");
			});

		n.forEach(
			function(a){
				cls.add(a, "nanoLightbox");

				// if we're inline, then just make it inline-block
				style.get(a, "display") == "inline" && style.set(a, "display", "inline-block") && query("img").style("display", "inline-block");

				// make sure the container has a position
				!/^(relative|absolute)$/.test(style.get(a, "position")) && style.set(a, "position", "relative");
			}
		).onclick(
			function(e){
				evt.stop(e);

				var t = query(e.target).closest(".nanoLightbox", node),
					l = _t._loading,
					o = _t._overlay,
					h = lang.hitch(_t, "_hide"),
					i;

				if(t.length){
					_t._current = t = t[0];

					// show the loading image
					l && dom.destroy(l);
					l = _t._loading = dom.create("div", null, dom.create("div", {
						className: "nanoLightboxLoading"
					}, t));

					// show the overlay
					o && dom.destroy(o);
					o = _t._overlay = dom.create("div", {
						className: "nanoLightboxOverlay",
						onclick: h
					}, win.body());

					// listen for keys
					_t._keyEvent = on(win.doc, "keydown", lang.hitch(_t, "_key"));

					i = _t._img = dom.create("img", {
						className: "nanoLightboxImage",
						style: {
							visibility: "hidden"
						},
						onclick: h,
						onload: function(){
							var p = geom.position(t.firstChild),
								q = geom.position(i);

							// position the image and size
							style.set(i, {
								left: (p.x-10) + "px",
								top: (p.y-10) + "px",
								width: p.w + "px",
								height: p.h + "px",
								visibility: "visible"
							});

							setTimeout(function(){
								style.set(t, "visibility", "hidden");

								cls.add(i, "nanoLightboxImageZoom");

								l && dom.destroy(l);

								setTimeout(function(){
									var v = view.getBox(),
										hs = v.w / q.w,
										vs = v.h / q.h,
										r = Math.min(hs, vs),
										w = ((q.w * r) - 20) * 0.9,
										h = ((q.h * r) - 20) * 0.9;

									cls.add(o, "nanoLightboxOverlayShow");

									style.set(i, {
										left: ((v.w - 20 - w) / 2.0) + v.l + "px",
										top: ((v.h - 20 - h) / 2.0) + "px",
										width: w + "px",
										height: h + "px"
									});
								}, 0);
							}, 0);
						},
						onerror: h
					}, win.body()),
console.debug(attr.get(t, "href"));
					i.src = attr.get(t, "href");
				}
			}
		);

		_t._nodes = n;
	},

	_key: function(e){
		evt.stop(e);
		var c = this._nodes.length > 1;
		switch(e.keyCode){
			case 37: // left arrow
				if(c){
					// TODO: go to the previous item
					break;
				}
			case 39: // right arrow
				if(c){
					// TODO: go to the next item
					break;
				}
			default:
				this._hide();
		}
	},

	// hide if X or overlay is clicked or key is pressed
	_hide: function(){
		var e = this._keyEvent,
			o = this._overlay,
			l = this._loading,
			i = this._img,
			c = this._current,
			p;

		e && e.remove() && (this._keyEvent = null);

		o && cls.remove(o, "nanoLightboxOverlayShow");
		on.once(o, transitionEvent, function(){
			dom.destroy(o);
		});

		l && dom.destroy(l);

		if(i){
			p = c ? geom.position(c.firstChild) : view.getBox();
			q = c ? { x: p.x-10, y: p.y-10, w: p.w, h: p.h } : { x: p.w / 2, y: p.h / 2, w: 0, h: 0 };
			style.set(i, {
				left: q.x + "px",
				top: q.y + "px",
				width: q.w + "px",
				height: q.h + "px"
			});
			on.once(i, transitionEvent, function(){
				if(c){
					style.set(c, "visibility", "visible");
				}
				setTimeout(function(){
					style.set(i, "opacity", 0);
					on.once(i, transitionEvent, function(){
						dom.destroy(i);
					});
				}, 0);
			});
		}
	}

});

});

/*
 tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;
            
        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"');

                // Workaround required for IE9, which doesn't report video support without audio codec specified.
                //   bug 599718 @ msft connect
                var h264 = 'video/mp4; codecs="avc1.42E01E';
                bool.h264 = elem.canPlayType(h264 + '"') || elem.canPlayType(h264 + ', mp4a.40.2"');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"');
            }
            
        } catch(e) { }
        
        return bool;
    };
    */