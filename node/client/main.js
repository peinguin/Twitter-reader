var socket = io.connect('http://localhost:8001');
var $tweets = undefined;

var render = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="media list-group-item">\n\t<a href="'+
((__t=( user.url ))==null?'':__t)+
'" class="pull-left">\n\t  <img src="'+
((__t=( user.profile_image_url ))==null?'':__t)+
'" class="media-object" />\n\t</a>\n\t<div class="media-body">\n\t  <h4 class="media-heading">'+
((__t=( user.screen_name ))==null?'':__t)+
'</h4>\n\t  '+
((__t=( text ))==null?'':__t)+
'\n\t</div>\n</div>';
}
return __p;
} 

var show_tweets = function(tweets){
	for(var i in tweets){
		$(render(tweets[i])).prependTo($tweets).show('slow');
	}
}

$(function() {

	$.get('tweet.tpl', function (data) {
		render = _.template(data);
	});

	$tweets = $('#tweets');

	$('#form').submit(function(e){
		e.preventDefault();

		socket.emit('start', JSON.stringify({ username: e.target.username.value, search: e.target.search.value }));

		socket.on('user_timeline', show_tweets);
		socket.on('search', show_tweets);
	})
});