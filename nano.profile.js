(function(){
	var testResourceRe = /^nano\/tests\//,
		copyOnly = function(mid){
			var list = {
				"nano/nano.profile":1,
				"nano/package.json":1,
				"nano/tests":1
			};
			return (mid in list) || /^nano\/resources\//.test(mid);
		};

	return {
		resourceTags:{
			test: function(filename, mid){
				return testResourceRe.test(mid) || mid=="nano/tests";
			},

			copyOnly: function(filename, mid){
				return copyOnly(mid);
			},

			amd: function(filename, mid){
				return !testResourceRe.test(mid) && !copyOnly(mid) && /\.js$/.test(filename);
			}
		},

		trees:[
			[".", ".", /(\/\.)|(~$)/]
		]
	};
})()
