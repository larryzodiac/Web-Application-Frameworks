# Web-Application-Frameworks
Creative Computing Year 3 Web Application Frameworks Module / Learning with Laravel + Vue

## Migrations
Setup Database (.env), creating new in _phpmyadmin._ Then double-check migrations.

See [Generating Migrations](https://laravel.com/docs/5.6/migrations#generating-migrations) documentation if necessary migrations not present.

Then migrate!

```
public function up() {
  Schema::create('books', function (Blueprint $table) {
    $table->increments('id');
    $table->string('title');
    $table->string('author');
    $table->string('publisher');
    $table->integer('year')->unsigned();
    $table->string('isbn')->unique();
    $table->decimal('price', 6, 2);
    $table->timestamps();
  });
}
    
public function down() {
  Schema::dropIfExists('books');
}
```

N.B remember for comments to add _onDelete('cascade')_ in order to have all comments relating to a book deleted when said book is deleted.

```
public function up() {
  Schema::create('comments', function (Blueprint $table) {
      $table->increments('id');
      $table->string('title');
      $table->string('body');
      $table->integer('book_id')->unsigned();
      $table->timestamps();
      
      $table->foreign('book_id')->references('id')->on('books')->onDelete('cascade');
  });
}

public function down() {
  Schema::dropIfExists('comments');
}
```

```
public function up() {
  Schema::create('roles', function (Blueprint $table) {
      $table->increments('id');
      $table->string('name')->unique();
      $table->string('description');
      $table->timestamps();
  });
}

public function down() {
  Schema::dropIfExists('roles');
}
```

Link/Pivot table:

```
public function up() {
  Schema::create('role_user', function (Blueprint $table) {
      $table->increments('id');
      $table->integer('role_id')->unsigned();
      $table->integer('user_id')->unsigned();
      $table->timestamps();

      $table->foreign('role_id')->references('id')->on('roles');
      $table->foreign('user_id')->references('id')->on('users');
  });
}

public function down() {
  Schema::dropIfExists('role_user');
}
```

## Seeding Database

Then import SQL files to populate books + comments

Then _seed_ database:

```
composer dump-autoload

php artisan db:seed
```

We are at a stage where logins work + books visible but no actions.

## BookController functions

```
public function __construct() {
  $this->middleware('auth');
  $this->middleware('role:admin');
}
```

### Index

```
public function index() {
  $books = Book::all();
  return view('admin.books.index2')->with(array(
      'books' => $books
  ));
}
```

### Create

```
public function create() {
  return view('admin.books.create');
}
```

### Store

```
public function store(Request $request) {
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

  return redirect()->route('admin.books.index');
}
```

### Show

```
public function show($id) {
  $book = Book::findOrFail($id);
  return view('admin.books.show')->with(array(
      'book' => $book
  ));
}
```

### Edit

```
public function edit($id) {
  $book = Book::findOrFail($id);
  return view('admin.books.edit')->with(array(
      'book' => $book
  ));
}
```

### Update

```
public function update(Request $request, $id) {
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

  return redirect()->route('admin.books.index');
}
```

### Destroy

```
public function destroy($id) {
  $book = Book::findOrFail($id);

  $book->delete();

  Session::flash('message', 'Book deleted successfully!');

  return redirect()->route('admin.books.index');
}
```

## CommentController

Then After all routes working, onto comments

```
public function __construct() {
    $this->middleware('auth');
    $this->middleware('role:admin');
}
```

### Create

```
public function create($id) {
  $book = Book::findOrFail($id);

  return view('admin.books.comments.create')->with(array(
      'book' => $book
  ));
}
```

### Store

```
public function store(Request $request, $id) {
  $request->validate([
    'title' => 'required|max:191',
    'body' => 'required|max:191'
  ]);

  $comment = new Comment();
  $comment->title = $request->input('title');
  $comment->body = $request->input('body');
  $comment->book_id = $id;

  $comment->save();

  $session = $request->session()->flash('message', 'Comment added successfully!');

  return redirect()->route('admin.books.show', $id);
}
```

### Edit

```
public function edit($id, $cid) {
  $book = Book::findOrFail($id);
  $comment = Comment::findOrFail($cid);

  return view('admin.books.comments.edit')->with(array(
    'book' => $book,
    'comment' => $comment
  ));
}
```

### Update

```
public function update(Request $request, $id, $cid) {
  $request->validate([
    'title' => 'required|max:191',
    'body' => 'required|max:191'
  ]);

  $comment = Comment::findOrFail($cid);
  $comment->title = $request->input('title');
  $comment->body = $request->input('body');

  $comment->save();

  $session = $request->session()->flash('message', 'Comment updated successfully!');

  return redirect()->route('admin.books.show', $id);
}
```

### Destroy

```
public function destroy(Request $request, $id, $cid) {
  $comment = Comment::findOrFail($cid);
  $comment->delete();
  $session = $request->session()->flash('message', 'Comment deleted successfully!');
  return redirect()->route('admin.books.show', $id);
}
```
