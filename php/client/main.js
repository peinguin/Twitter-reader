var $tweets = undefined;
var to_show = [];
var since_ids = {};
var TWEETS_TYPES = ['username', 'search'];
var show_started = false;

var render = undefined;

var show_tweets = function(tweets, type){
	var tweet = undefined;
	while(tweets && (tweet = tweets.pop())){
		if(tweet.id != since_ids[type]){
			to_show.push(tweet);
			since_ids[type] = tweet.id;
		}
	}
	run_show();
}

var run_show = function(){
	to_show.sort(function(a, b){return a.id < b.id;});
	if(!show_started){
		show_started = true;
		show_tweet();
	}
}

var show_tweet = function(){
	var tweet = to_show.pop();
	if(tweet){
		$(render(tweet)).prependTo($tweets).show('slow', show_tweet);
	}else{
		show_started = false;
	}
}

var get_tweets = function(){

	var params = ($.map(since_ids, function(a, i){ return i+'='+a;})).join('&');

	var url = config.host + (params.length > 0?'?'+params:'');

	$.get(url, function(tweets){
		tweets = JSON.parse(tweets);
		for(var i in TWEETS_TYPES){
			show_tweets(tweets[TWEETS_TYPES[i]], TWEETS_TYPES[i]);
		}

		setTimeout(get_tweets, 1000);
	});
}

$(function() {
	$.get('tweet.tpl', function (data) {
		render = _.template(data);
	});

	$tweets = $('#tweets');

	get_tweets();
});