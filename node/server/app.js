
var config = require('./config');

var Twitter = require('twitter-js-client').Twitter;
var twitter = new Twitter(config);

var io = require('socket.io').listen(config.port, {log: false });

io.sockets.on('connection', function (socket) {
	var user_sinse_id = undefined;
	var search_sinse_id = undefined;

	var username = undefined;
	var search = undefined;

	var username_timeout = undefined;
	var search_timeout = undefined;

	var username_timeout_func = function(){
		if(username){
			username_timeout = setTimeout(
				function(){
					twitter.doRequest(
						'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='
							 + encodeURIComponent(username)
							 + '&count=100'
							 +(user_sinse_id?'&since_id='+user_sinse_id:''),
						function(err, response, body){
							console.log(err, body);
						},
						function(body){
							body = JSON.parse(body);
							if(body.length > 0){
								var curr_last_id = body[0].id;
								if(curr_last_id != user_sinse_id){
									user_sinse_id = curr_last_id;
									socket.emit('user_timeline', body);
								}
							}
							username_timeout_func();
						}
					);
				},
				3000
			);
		}
	}

	var search_timeout_func = function(){
		if(search){
			search_timeout = setTimeout(
				function(){
					twitter.doRequest(
						'https://api.twitter.com/1.1/search/tweets.json?q='
							+encodeURIComponent(search)
							+'&result_type=resent&count=200'
							+(search_sinse_id?'&since_id='+search_sinse_id:''),
						function(err, response, body){
							console.log(err, body);
						},
						function(body){
							body = JSON.parse(body).statuses;
							if(body.length > 0){
								var curr_last_id = body[0].id;
								 if(curr_last_id != search_sinse_id){
									search_sinse_id = curr_last_id;
									socket.emit('search', body);
								}
							}
							search_timeout_func();
						}
					);
				},
				2000
			);
		}
	}

	var timeouts = function(){
		search_timeout_func();
		username_timeout_func();
	}

	var clearTimeouts = function(){
		if(search_timeout){
			clearTimeout(search_timeout);
		}
		if(username_timeout){
			clearTimeout(username_timeout);
		}
	}

	socket.on('start', function(data){

		data = JSON.parse(data);

		clearTimeouts();

		username = data.username;
		search = data.search;
		timeouts();

		socket.on('disconnect', function () {
	    clearTimeouts();
	  });
	})
	
});