define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/fx",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/fx",
	"dojo/has",
	"dojo/query"
], function(arr, decl, evt, fx, lang, attr, cls, ctr, geom, style, fx2, has, query){

var css = "nanoLightbox";

return decl("nano.Lightbox", null, {

	constructor: function(params, node){
		var n;

		if(params.query){
			n = query(params.query, query("*", node).length ? node : null);
		}else{
			n = new query.NodeList(node);
		}

		n.forEach(function(a){
			console.debug(a);
		});

		n.on("onclick", function(e){
			evt.stopEvent(e);
			console.debug("Whoo!");
			return false;
		});

		//this._nodes = n;
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