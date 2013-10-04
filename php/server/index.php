<?php

DEFINE('MAX_TIMELINE_PER_REQUEST', 10);
DEFINE('MAX_SEARCH_PER_REQUEST', 10);

DEFINE('CACHE_LIVETIME', 60);

$config = require('config.php');

include("phpfastcache/phpfastcache.php");
phpFastCache::setup("storage","auto");

// phpFastCache support "apc", "memcache", "memcached", "wincache" ,"files", "sqlite" and "xcache"
// You don't need to change your code when you change your caching system. Or simple keep it auto
$cache = phpFastCache();

include_once('TwitterOAuth.php');
$tw = new TwitterOAuth($config);

$search_since_id = isset($_GET['search'])?$_GET['search']:'';
$username_since_id = isset($_GET['username'])?$_GET['username']:'';

$all_tweets = array();

if(!$cache->isExisting('search|'.$search_since_id)){

	$params = array(
		'count' => MAX_TIMELINE_PER_REQUEST,
		'screen_name' => $config['username'],
	);
	if($username_since_id){
		$params['since_id'] = $username_since_id;
	}

	$tweets = $tw->get('statuses/user_timeline',$params);

	$cache->set('username|'.$username_since_id, $tweets, CACHE_LIVETIME);
}else{
	$tweets = $cache->get('username|'.$username_since_id);
}

$all_tweets['username'] = $tweets;

if(!$cache->isExisting('search|'.$search_since_id)){

	$params = array(
		'q' => $config['search'],
		'count' => MAX_SEARCH_PER_REQUEST,
	);
	if($search_since_id){
		$params['since_id'] = $search_since_id;
	}

	$tweets = $tw->get('search/tweets', $params)['statuses'];

	$cache->set('search|'.$search_since_id, $tweets, CACHE_LIVETIME);
}else{
	$tweets = $cache->get('search|'.$search_since_id);
}

$all_tweets['search'] = $tweets;

echo json_encode($all_tweets);