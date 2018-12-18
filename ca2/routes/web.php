<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

// Any URL that begin with '../books/..'
// 'books' is name of path
// We want to direct them to the BookController
// '::resource' method sets up the routes
// These are specified in the actions table
// https://laravel.com/docs/5.6/controllers#resource-controllers
// i.e if URL of 'books/'
// Invokes action of index method in BookController
Route::resource('books', 'BookController');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
