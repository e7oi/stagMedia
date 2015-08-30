<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

//Route::get('/', 'HomeController@index');
/*
Route::get('/', function () {
    return view('welcome');
});
*/

//Route::bind('song', function($slug)
//{
//    return App\Song::whereSlug($slug)->first();
//});

get('/', ['as' => 'home.page', 'uses' => 'PageController@index']);
get('about', ['as' => 'about.page', 'uses' => 'PageController@about']);
get('demo', ['as' => 'demo.page', 'uses' => 'PageController@demo']);

get('music', ['as' => 'song.index', 'uses' => 'SongsController@index']);
get('music/{slug}/view', ['as' => 'song.show', 'uses' => 'SongsController@show']);
get('music/{slug}/edit', ['as' => 'song.edit', 'uses' => 'SongsController@edit']);
patch('music/{slug}', ['as' => 'song.patch','uses' => 'SongsController@update']);
get('music/create', ['as' => 'song.create','uses' => 'SongsController@create']);
post('music/store', ['as' => 'song.store','uses' => 'SongsController@store']);
delete('music/{slug}', ['as' => 'song.destroy','uses' => 'SongsController@destroy']);

//$router->resource('songs', 'SongsController');
$router->resource('people', 'PeopleController');
