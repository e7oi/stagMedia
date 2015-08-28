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

//Route::model('song', 'App\Song');

Route::get('/', 'PageController@index');
Route::get('about', 'PageController@about');
Route::get('demo', 'PageController@demo');

Route::get('songs', 'SongsController@index');
Route::get('songs/{slug}', 'SongsController@show');
Route::get('songs/{slug}/edit', 'SongsController@edit');