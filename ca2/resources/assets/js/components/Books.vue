<template>
  <div>

    <div class="modal fade" id="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
          <h5 class="modal-title">Book Form</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- Prevents page change -->
            <!-- Rid of @submit="checkForm" -->
            <form class="" id="modalForm" @submit.prevent="addBook">
              <!-- <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
                <ul>
                  <li v-for="error in errors">{{ error }}</li>
                </ul>
              </p> -->
              <div class="form-group">
                <!-- v-model: directive to create two-way data bindings on form input and textarea elements -->
                <input type="text" class="form-control" placeholder="Title" v-model="book.title"/>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" placeholder="Author" v-model="book.author"/>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" placeholder="Publisher" v-model="book.publisher"/>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" placeholder="Year" v-model="book.year"/>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" placeholder="ISBN" v-model="book.isbn"/>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" placeholder="Price" v-model="book.price"/>
              </div>
              <div class="pr-0 pb-0 modal-footer">
                <!-- full syntax -->
                <!-- <a v-on:click="doSomething"></a> -->
                <!-- shorthand -->
                <!-- <a @click="doSomething"></a> -->
                <button @click="addBook()" type="submit" id="modalSubmit" class="btn btn-outline-primary" data-dismiss="modal">Save</button>
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalDelete" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Remove book?</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-footer">
            <!-- this.book.book_id is set to id of book clicked, then modal appears -->
            <!-- So we can pass it here -->
            <!-- See  -->
            <button @click="deleteBook(book_id)" class="btn btn-outline-danger" data-dismiss="modal">Yes</button>
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">No</button>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4 text-center">
      <img class="mb-4" src="/web_frameworks/ca2/resources/assets/brand/bootstrap-solid.svg" width="72" height="72" alt="">
      <h1 class="h3 mb-3 font-weight-normal">Web Frameworks CA2 Books Database</h1>
      <p class="lead">By Evan MacHale / N00150552</p>
      <p class="mb-4 mx-auto" style="width:600px;">
        An application utilising a
        <a href="https://stackoverflow.com/questions/671118/what-exactly-is-restful-programming?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa">REST API</a>
        that allows contents of a database
        table to be created, read, updated and deleted. Implemented using
        <a href="https://getbootstrap.com/">Bootstrap</a>,
        <a href="https://laravel.com/">Laravel</a> and
        <a href="https://vuejs.org/">Vue.js</a>
      </p>
      <button @click="clearForm()" type="button" class="btn btn-outline-primary mb-3" data-toggle="modal" data-target="#modal">Add a Book</button>
    </div>

    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Author</th>
          <th scope="col">Publisher</th>
          <th scope="col">Year</th>
          <th scope="col">ISBN</th>
          <th scope="col">Price</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <!-- v-for -->
        <!-- directive to render a list of items based on an array -->
        <!-- requires a special syntax in the form of item in items -->
        <!-- where items is the source data array and item is an alias for the array element being iterated on -->
        <!-- v-bind: -->
        <!-- Dynamically bind attributes, or a component prop to an expression -->
        <!-- key -->
        <!-- Attribute to keep track of node identity -->
        <!-- + reuse and reorder existing elements -->
        <tr v-for="book in books" v-bind:key="book.id">
          <th scope="row">{{ book.title }}</th>
          <td>{{ book.author }}</td>
          <td>{{ book.publisher }}</td>
          <td>{{ book.year }}</td>
          <td>{{ book.isbn }}</td>
          <td>{{ book.price }}</td>
          <td><button @click="populateFormDetails(book)" class="btn btn-outline-primary" data-toggle="modal" data-target="#modal">Edit</button></td>
          <!-- <td><button @click="deleteBook(book.id)" class="btn btn-outline-danger" data-toggle="modal" data-target="#modalDelete">Remove</button></td> -->
          <td><button @click="grabBookId(book.id)" class="btn btn-outline-danger" data-toggle="modal" data-target="#modalDelete">Remove</button></td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
// Component
  export default {
   data() {
    return {
      errors: [],
      books: [],
      book: {
        id: '',
        title: '',
        author: '',
        publisher: '',
        year: '',
        isbn: '',
        price: ''
      },
      // When we do PUT/DELETE request to api
      // See 'api.php' for PUT/DELETE
      // Need to send id with requests
      book_id: '',
      // Same form to add/edit
      // edit used to check whether or not editing a book
      edit: false
    }
   },
   // Created runs automatically when page loads
   created(){
     // Define methods to use them
     this.getBooks();
   },
   methods: {
     getBooks() {
       // 'fetch api' for requests
       // URL
       fetch('api/books')
       // Response, but no data
       // Data is array of objects inside respone object
       // See object response raw through URL
       // 'http://localhost/web_frameworks/ca2/public/api/books'
       // Map respone to JSON
       .then(res => res.json())
       // Then get the data and
       .then(res => {
         // console.log(res.data);
         this.books = res.data;
       })
     },
     deleteBook(id) {
       console.log(id);
       // Note grave accent ``, not '' or ""
       // Different address + request -> delete
       fetch(`api/books/${id}`, {method: 'delete'})
       .then(res => res.json())
       .then(data => {
         console.log(data)
         this.getBooks();
       })
       this.book_id = '';
       console.log(this.book_id);
     },
     addBook() {
       // Handles add and update
       if(this.edit === false) {
         // Add
         fetch('api/books', {
           method: 'post',
           // REST API -> ARC
           body: JSON.stringify(this.book),
           headers: {'content-type': 'application/json'}
         })
         .then(res => res.json())
         .then(data => {
           console.log(data)
           this.book.title = '';
           this.book.author = '';
           this.book.publisher = '';
           this.book.year = '';
           this.book.isbn = '';
           this.book.price = '';
           this.getBooks();
         })
       }
       else {
         // Update
         fetch(`api/books/${this.book.book_id}`, {
           method: 'put',
           body: JSON.stringify(this.book),
           headers: {'content-type': 'application/json'}
         })
         .then(res => res.json())
         .then(data => {
           console.log(data)
           this.book.title = '';
           this.book.author = '';
           this.book.publisher = '';
           this.book.year = '';
           this.book.isbn = '';
           this.book.price = '';
           this.getBooks();
         })
       }
     },
     populateFormDetails(book) {
       // Populates form with selected book's info
       this.edit = true;
       this.book.id = book.id;
       this.book.book_id = book.id;
       this.book.title = book.title;
       this.book.author = book.author;
       this.book.publisher = book.publisher;
       this.book.year = book.year;
       this.book.isbn = book.isbn;
       this.book.price = book.price;
       console.log(this.book.book_id);
     },
     grabBookId(id) {
       console.log(id);
       this.book_id = id;
       console.log("book_id = " + this.book_id);
     },
     clearForm() {
       this.book.title = '';
       this.book.author = '';
       this.book.publisher = '';
       this.book.year = '';
       this.book.isbn = '';
       this.book.price = '';
     },
     // checkForm(fields) {
     //   this.errors = [];
     //   if(this.books.name === '') {
     //     this.errors.push("Title is required.");
     //   }
     //   fields.preventDefault();
     // }
   }
  }
</script>
