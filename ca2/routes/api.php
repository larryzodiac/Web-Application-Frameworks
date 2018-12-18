<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

// If we get a GET request for '/books',
// we execute apiIndex method in the BookController
Route::get('/books', 'BookController@apiIndex');
Route::get('/books/{id}', 'BookController@apiShow');
Route::post('/books', 'BookController@apiStore');
// If we get a PUT request for '/books' then some ID,
// we invoke apiUpdate in the BookController
Route::put('/books/{id}', 'BookController@apiUpdate');
// Route::put('/books/{id}', 'BookController@apiStore');
Route::delete('/books/{id}', 'BookController@apiDelete');
