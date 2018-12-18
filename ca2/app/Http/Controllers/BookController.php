<?php
// ------------------------------------- //
// Contollers organise request handling logic into classes
// This contoller is a 'resource' controller
// 'php artisan make:controller BookController --resource'
// A dedicated controller(handles requests) for a resource(books table)
// It assigns CRUD operations for use with our resource
// https://laravel.com/docs/5.6/controllers#introduction
// ------------------------------------- //
// When creating a resource controller
// Nedd to define routes
// i.e. when the URL is book/..
// We need to direct them here
// See routes/web.php
// 'Route::resource('books', 'BookController');'
// Then test index, 'return('Hello world!');'
// 'http://localhost/web_frameworks/ca2/public/books'
// Should return
// ------------------------------------- //
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
// Rest
use Validator;
use App\Book;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      // ------------------------------------- //
      // view() searches views folder
      // for books folder w/ file named index
      // Intro for blade templating language
      // 'views/books/index.blade.php'
      // $name = 'Evan';
      // Note we want to pass things to these views
      // 'name' in index.blade.php now references $name here
      // However,in index, name is written as $name as well
      // So, in index, $name = Evan
      // echo $name accesses index of array with value 'name'
      // return view('books/index')->with(array('name' => $name));
      // ------------------------------------- //
      $books = Book::all();
      return view('books/index')->with(array('books' => $books));
      // collection object, essentially an array
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
      return view('books.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $request->validate([
        'title' => 'required|max:191',
        'author' => 'required|max:191',
        'publisher' => 'required|max:191',
        'year' => 'required|integer|min:1900',
        'isbn' => 'required|alpha_num|size:13|unique:books',
        'price' => 'required|numeric|min:0'
      ]);

      $book = new Book();
      $book->title = $request->input('title');
      $book->author = $request->input('author');
      $book->publisher = $request->input('publisher');
      $book->year = $request->input('year');
      $book->isbn = $request->input('isbn');
      $book->price = $request->input('price');
      $book->save();

      $session = $request->session()->flash('message', 'Book added successfully!');

      return redirect()->route('books.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      $book = Book::findOrFail($id);
      return view('books.show')->with(array('book' => $book));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
      $book = Book::findOrFail($id);
      return view('books.edit')->with(array('book' => $book));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
      $book = Book::findOrFail($id);

      $request->validate([
        'title' => 'required|max:191',
        'author' => 'required|max:191',
        'publisher' => 'required|max:191',
        'year' => 'required|integer|min:1900',
        'isbn' => 'required|alpha_num|size:13|unique:books,isbn,' . $book->id,
        'price' => 'required|numeric|min:0'
      ]);

      $book->title = $request->input('title');
      $book->author = $request->input('author');
      $book->publisher = $request->input('publisher');
      $book->year = $request->input('year');
      $book->isbn = $request->input('isbn');
      $book->price = $request->input('price');
      $book->save();

      $session = $request->session()->flash('message', 'Book updated successfully!');

      return redirect()->route('books.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
      $book = Book::findOrFail($id);
      $book->delete();
      Session::flash('message', 'Book deleted successfully!');
      return redirect()->route('books.index');
    }

    //////////////////////////////////////////////
    ///////////////// REST API ///////////////////
    //////////////////////////////////////////////

    // For sending requests to the server REST format
    // See:
    // 'https://en.wikipedia.org/wiki/Representational_state_transfer#Relationship_between_URL_and_HTTP_methods'
    // We can either send a request to a collection of resources or an individual resource
    // When we request an individual resource, we generally do so with an Id
    // See browser path for our regular application we have made so far
    // e.g
    // 'http://localhost/bookstore/public/books/5'

    // When using REST, we send and recieve using Json

    // Using Chrome extension ARC
    // Request URL is:
    // 'http://localhost/bookstore/public/api/books'
    // Not:
    // 'http://localhost/bookstore/public/books'

    // We need to map these methods to the requests that we are to recieve
    // We do this in the routes folder, in api.php

    public function apiIndex()
    {
      // Get all books using Book model class
      $data = Book::all();
      $status = 200;
      // Response object
      $response = array(
          'status' => $status,
          // Proprety data given our array of books
          'data' => $data
      );

      // Get reference to response object
      // Call json method on response object
      // Give it our php array
      // Json methods encodes that array as Json array object
      // Takes $response, converts into a Json string
      // That string represents the Json object
      return response()->json($response);
    }

    public function apiShow($id)
    {
      $book = Book::find($id);
      // If find method returns null
      // Book not found
      // 404
      if ($book === null) {
          $status = 404;
          $data = null;
      }
      else {
          $status = 200;
          // Set data as reference to the book
          $data = $book;
      }

      // As before, sends to browser as Json string
      $response = array(
          'status' => $status,
          'data' => $data
      );

      return response()->json($response);
    }

    // To store, we send POST request to the collection URL
    // Which will be mapped to apiStore method
    public function apiStore(Request $request)
    {
      // Remember, body of the request will contain
      // Json string which holds details of our form
      // We get that srting
      $content = $request->getContent();

      // 'json_decode($content)'
      // We decode it to give us a Php array
      // Where, key values of array represent the propreties of Json object
      // Then values associated with those keys are the values that are associated with the propreties of the Json object

      // '->merge((array)..'
      // Take that array, merge it into the request array
      // $request array has all the input that would be submitted in our form
      // So, we populate that array with the info we decoded from the Json string
      // Makes it look like it was submitted in a form
      // And is thus handled as such
      $request->merge((array)json_decode($content));

      // Rules for validation
      $rules = [
          'title' => 'required|max:191',
          'author' => 'required|max:191',
          'publisher' => 'required|max:191',
          'year' => 'required|integer|min:1900',
          'isbn' => 'required|alpha_num|size:13|unique:books',
          'price' => 'required|numeric|min:0'
      ];

      // Make validation object
      // Pass it all input values from request
      // Give it reference to the rules
      $validation = Validator::make($request->all(), $rules);

      // fails() returns true of false
      if ($validation->fails()) {
          // Retrieve array that contains errors messages for each field
          // So in 'getMessageBag'
          // If 'title' has an error
          // There will be an entry with a key named title
          // PLus a value associated with it will be an error message
          $data = $validation->getMessageBag();
          // Invalid request code
          $status = 422;
      }
      else {
          // New book object
          $book = new Book();
          // Copy plus save all info from request
          $book->title = $request->input('title');
          $book->author = $request->input('author');
          $book->publisher = $request->input('publisher');
          $book->year = $request->input('year');
          $book->isbn = $request->input('isbn');
          $book->price = $request->input('price');
          // Saved with ID assigned to it plus timestamps
          $book->save();

          // New book object in data
          $data = $book;
          $status = 200;
      }

      // As before
      $response = array(
          'status' => $status,
          'data' => $data
      );
      return response()->json($response);
    }

    public function apiUpdate(Request $request, $id)
    {
      // Find book
      $book = Book::find($id);
      if ($book === null) {
          $data = null;
          $status = 404;
      }
      else {
          // Get all info from request
          // Merge it into input array inside request object
          $content = $request->getContent();
          $request->merge((array)json_decode($content));

          // Specify rules
          $rules = [
              'title' => 'required|max:191',
              'author' => 'required|max:191',
              'publisher' => 'required|max:191',
              'year' => 'required|integer|min:1900',
              // Specify ISBN unique, but, ignore row associated with this book Id
              'isbn' => 'required|alpha_num|size:13|unique:books,isbn,' . $book->id,
              'price' => 'required|numeric|min:0'
          ];
          $validation = Validator::make($request->all(), $rules);

          if ($validation->fails()) {
              $data = $validation->getMessageBag();
              $status = 422;
          }
          else {
              // Copy all values from Json object into book object
              // Save it
              $book->title = $request->input('title');
              $book->author = $request->input('author');
              $book->publisher = $request->input('publisher');
              $book->year = $request->input('year');
              $book->isbn = $request->input('isbn');
              $book->price = $request->input('price');
              $book->save();

              // Store it in data array
              $data = $book;
              $status = 200;
          }
      }

      // Create my response
      // Send it back as a Json string as before
      $response = array(
          'status' => $status,
          'data' => $data
      );
      return response()->json($response);
    }

    public function apiDelete(Request $request, $id)
    {
      // Same as before
      $book = Book::find($id);
      if ($book === null) {
          $data = null;
          $status = 424;
      }
      else {
          $book->delete();
          $data = null;
          $status = 200;
      }

      $response = array(
          'status' => $status,
          'data' => $data
      );
      return response()->json($response);
    }

    // Remember
    // It works the same as processing normal requests
    // Except in this, case we're not building HTML pages
    // We're sending back Json objects
    // No need for views
    // We build up an array with the info we want in Php code
    // Encode it and send it back
}
