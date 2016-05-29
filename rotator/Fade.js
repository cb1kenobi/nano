define([
	'dojo/_base/lang',
	'dojo/dom-style',
	'dojo/_base/fx',
	'dojo/fx'
], function(lang, style, baseFx, coreFx){
	function _fade(/*Object*/args, /*string*/action){
		// summary:
		//		Returns an animation of a fade out and fade in of the current and next
		//		panes.  It will either chain (fade) or combine (crossFade) the fade
		//		animations.
		var n = args.next.node;
		style.set(n, {
			display: "",
			opacity: 0
		});

		args.node = args.current.node;

		return coreFx[action]([ /*dojo.Animation*/
			baseFx.fadeOut(args),
			baseFx.fadeIn(lang.mixin(args, { node: n }))
		]);
	}

	lang.mixin(nano.rotator, {
		fade: function(/*Object*/args){
			// summary:
			//		Returns a dojo.Animation that fades out the current pane, then fades in
			//		the next pane.
			return _fade(args, "chain"); /*dojo.Animation*/
		},

		crossFade: function(/*Object*/args){
			// summary:
			//		Returns a dojo.Animation that cross fades two rotator panes.
			return _fade(args, "combine"); /*dojo.Animation*/
		}
	});

});