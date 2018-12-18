<?php
// ------------------------------------- //
// Migrations allow for easy modification/creation of tables
// You can set up a migration like this file using:
// 'php artisan makie:migration create_books_table --create=books'
// --create=books means the table created in database will be called books
// The schema below is what will be added to the tables
// When happy, migrate!
// 'php artisan migrate'
// can use rollback to undo:
// 'php artisan migrate:rollback'
// https://laravel.com/docs/5.6/migrations
// ------------------------------------- //
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->string('author');
            $table->string('publisher');
            $table->integer('year')->unassigned();
            $table->string('isbn')->unique();
            $table->decimal('price',5,2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('books');
    }
}
