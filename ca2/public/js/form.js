$(document).ready(function(){
    
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////

    var modalState = "closed";
    // Remembers Id of current modal in use
    var modalBookId = null;
    
    ///////////////////////////////////////////////////////////////
    //////////////// JQUERY FORM VALIDATION PLUGIN ////////////////
    ///////////////////////////////////////////////////////////////
    
    // Plugin doesn't have rules for interger + alpha numerics
    // We add custom ones
    
    $.validator.addMethod("integer", function(value, element) {
        return this.optional(element) || /^-?[0-9]+$/i.test(value);
    }, "Whole numbers only please");

    ///////////////////////////////////////////////////////////////
    
    $.validator.addMethod("alpha_numeric", function(value, element) {
        return this.optional(element) || /^[A-Za-z0-9]+$/i.test(value);
    }, "Letters and digits only please");
    
    ///////////////////////////////////////////////////////////////
    
    // JQUERY plugin
    $('#form-book').validate({
        // Define rules
        rules: {
            title: {
                required: true,
                maxlength: 191
            },
            author: {
                required: true,
                maxlength: 191
            },
            publisher: {
                required: true,
                maxlength: 191
            },
            year: {
                required: true,
                // Custom method from above
                integer: true,
                min: 1900
            },
            isbn: {
                required: true,
                // Again, custom method from above
                alpha_numeric: true,
                minlength: 13,
                maxlength: 13
            },
            price: {
                required: true,
                number: true,
                min: 0
            }
        },
        // Customise where errros go
        messages: {
            title: {
                required: "The title field is required.",
                maxlength: "The title field must be less than 191 chars."
            },
            author: {
                required: "The author field is required.",
                maxlength: "The author field must be less than 191 chars."
            },
            publisher: {
                required: "The publisher field is required.",
                maxlength: "The publisher field must be less than 191 chars."
            },
            year: {
                required: "The year field is required.",
                integer: "The year must be an integer." ,
                min: "The year field cannot be less than 1900."
            },
            isbn: {
                required: "The ISBN field is required",
                alpha_numeric: "The ISBN field can only contain letters and digits.",
                minlength: "The ISBN field must be 13 chars long.",
                maxlength: "The ISBN field must be 13 chars long."
            },
            price: {
                required: "The price field is required.",
                number: "The year must be a number." ,
                min: "The price field cannot be negative."
            }
        },
        errorPlacement: function(error, element) {
            // Find the <span> element thathas the class '.error'
            // Replace text with error message
            // Depending on where you want them to go
            // You'll have to change this line of code
            element.siblings('.error').html(error);
        }
    });
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////// MODAL DISPLAYS ///////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////
    ///////////////////// MODAL ADD DISPLAY ///////////////////////
    ///////////////////////////////////////////////////////////////

    $('.btn-book-add').on('click', function() {
        modalState = "add";
        $('#modal-book-heading').text("Add new book");
        $('#btn-submit').show();
        $('#btn-submit').text("Store");
        $('#modal-form').modal('show');
    });
    
    ///////////////////////////////////////////////////////////////
    ///////////////////// VIEW MODAL DISPLAY //////////////////////
    ///////////////////////////////////////////////////////////////
    
    // New listener to the table
    // If we click
    // In particular, if we click on something with this class
    // See 'index.blade.php'
    // '<tr data-id="{{$book->id}}">'
    // Looping adding rows with their Ids
    // Look in inspector at the table rows
    $('#table-books').on('click', '.btn-book-view', function() {
        modalState = "view";
        // Retrieve modal Id from nearest row
        // 'this' reference to button clicked
        // '.closest('tr')' goes up DOM tree looking for closest <tr>
        // Plus gets the Id data proprety of that row
        modalBookId = $(this).closest('tr').data('id');
        // Ajax request to the URl w/ book Id
        // Asking for details as a JSON object
        $.ajax("api/books/" + modalBookId, {
            contentType: 'application/json',
            method: 'GET',
            success: function (response) {
                if (response.status === 200) {
                    // If the reply is successful
                    // Retrieve the book from response
                    var book = response.data;
                    // Takes the details of the book
                    // Pass to modal dialogue
                    populateForm(book, true);
                    $('#modal-book-heading').text("View book details");
                    $('#btn-submit').hide();
                    $('#modal-form').modal('show');
                }
                else if (response.status === 404) {
                    showMessage("Book not found", "alert-warning");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showMessage("Server error: " + textStatus, "alert-warning");}
        });
    });
    
    ///////////////////////////////////////////////////////////////
    //////////////////// UPDATE MODAL DISPLAY /////////////////////
    ///////////////////////////////////////////////////////////////
    
    // Click on an edit button within table
    $('#table-books').on('click', '.btn-book-edit', function() {
        modalState = "edit";
        // Retriev row Id
        modalBookId = $(this).closest('tr').data('id');
        // send a GET request w/ Id
        $.ajax("api/books/" + modalBookId, {
            contentType: 'application/json',
            method: 'GET',
            success: function (response) {
                if (response.status === 200) {
                    var book = response.data;
                    // Want to be able to add to input fields
                    populateForm(book, false);
                    $('#modal-book-heading').text("Edit book details");
                    $('#btn-submit').text("Update").show();
                    $('#modal-form').modal('show');
                }
                // if the  book was not found, display an error message
                else if (response.status === 404) {
                    showMessage("Book not found", "alert-warning");
                }
            },
            // if there is an error with the AJAX request, execute this function
            error: function (jqXHR, textStatus, errorThrown) {
                showMessage("Server error: " + textStatus, "alert-warning");
            }
        });
    });
    
    ///////////////////////////////////////////////////////////////
    /////////////////// DELETE MODAL DISPLAY //////////////////////
    ///////////////////////////////////////////////////////////////
    
    // Same as other modal displays, no explaination needed
    $('#table-books').on('click', '.btn-book-delete', function() {
        modalState = "delete";
        modalBookId = $(this).closest('tr').data('id');
        $.ajax("api/books/" + modalBookId, {
            contentType: 'application/json',
            method: 'GET',
            success: function (response) {
                if (response.status === 200) {
                    var book = response.data;
                    populateForm(book, true);
                    $('#modal-book-heading').text("Confirm book deletion");
                    $('#btn-submit').text("Delete").show();
                    $('#modal-form').modal('show');
                }
                else if (response.status === 404) {
                    showMessage("Book not found", "alert-warning");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showMessage("Server error: " + textStatus, "alert-warning");}
        });
        $('#btn-submit').show();
        $('#modal-form').modal('show');
    });
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////// REST API REQUEST FUNCTIONS //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    ///////////////////////////////////////////////////////////////
    /////////////////// ADD REQUEST FUNCTION //////////////////////
    ///////////////////////////////////////////////////////////////
    
    function storeBook() {
        // Ref to form
        // Retrieve details from array
        var form = $('#form-book').get(0);
        // Serialise
        // Returns info inside an array
        var formData = $(form).serializeArray();
        // Map to format we can send to the server
        // Transform 'formData' from the format that is generated by the array to a format that can be sent to the request
        // ->Turnn it into a JSON object
        var data = {};
        // Lopp through
        formData.map(function(x){
            data[x.name] = x.value;
        });
        // Same as before
        $.ajax('api/books', {
            contentType: 'application/json',
            dataType: 'json',
            method: 'POST',
            data: JSON.stringify(data),
            // if the AJAX request is successful, execute this function
            success: function (response) {
                if (response.status === 200) {
                    var book = response.data;
                    $('#modal-form').modal('hide');
                    // Add new book with info
                    addTableRow(book);
                    showMessage("Book added successfully", "alert-success");
                }
                else if (response.status === 422) {
                    // Retrieve errors from response
                    // Put them into the modal
                    var errors = response.data;
                    // Loop through errors
                    // Populate <span> elements w/ errors
                    for (var prop in errors) {
                        var message = errors[prop][0];
                        $('#error-' + prop, form).text(message);
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }
    
    ///////////////////////////////////////////////////////////////
    /////////////////// ADD REQUEST FUNCTION //////////////////////
    ///////////////////////////////////////////////////////////////
    
    // Same as before
    // We retrieve data
        // Serialise the data so the server understands it
        // Format the data so JSOn understands it
        // Send a request to our collection w/ Id
            // Setup JSON object in body of request
                // Return responses
                    // Edit the modal propreties
                    // Add errors if any
        // Checck if the request fails
    // End
    function updateBook() {
        var form = $('#form-book').get(0);
        var formData = $(form).serializeArray();
        var data = {};
        formData.map(function(x){
            data[x.name] = x.value;
        });
        data.id = modalBookId;
        $.ajax('api/books/' + modalBookId, {
            contentType: 'application/json',
            dataType: 'json',
            method: 'PUT',
            data: JSON.stringify(data),
            success: function (response) {
                if (response.status === 200) {
                    var book = response.data;
                    $('#modal-form').modal('hide');
                    updateTableRow(book);
                    showMessage("Book updated successfully", "alert-success");
                }
                else if (response.status === 404) {
                    $('#modal-form').modal('hide');
                    showMessage("Book could not be found", "alert-warning");
                }
                else if (response.status === 422) {
                    var errors = response.data;
                    for (var prop in errors) {
                        var message = errors[prop][0];
                        $('#error-' + prop, form).text(message);
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }
    
    ///////////////////////////////////////////////////////////////
    /////////////////// DELETE REQUEST FUNCTION ///////////////////
    ///////////////////////////////////////////////////////////////
    
    function deleteBook() {
        $.ajax('api/books/' + modalBookId, {
            method: 'DELETE',
            success: function (response) {
                if (response.status === 200) {
                    var book = response.data;
                    $('#modal-form').modal('hide');
                    deleteTableRow(modalBookId);
                    showMessage("Book deleted successfully", "alert-success");
                }
                else if (response.status === 404) {
                    $('#modal-form').modal('hide');
                    showMessage("Book could not be found", "alert-warning");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////// DYNAMIC TABLE MANIPULATION //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    ///////////////////////////////////////////////////////////////
    ////////////////////////// ADD ROW ////////////////////////////
    ///////////////////////////////////////////////////////////////
    
    // Called by storeBook()
    // Straightforward
    function addTableRow(book) {
        var row = '<tr data-id="' + book.id + '">' +
                      '<td>' + book.title + '</td>' +
                      '<td>' + book.author + '</td>' +
                      '<td>' + book.publisher + '</td>' +
                      '<td>' + book.year + '</td>' +
                      '<td>' + book.isbn + '</td>' +
                      '<td>' + book.price + '</td>' +
                      '<td>' +
                          '<button type="button" class="btn btn-default btn-book-view">View</button> ' +
                          '<button type="button" class="btn btn-warning btn-book-edit">Edit</button> ' +
                          '<button type="button" class="btn btn-danger btn-book-delete">Delete</button> ' +
                      '</td>' +
                  '</tr>';

        $('#table-books tbody').append(row);
    }
    
    ///////////////////////////////////////////////////////////////
    //////////////////////// UPDATE ROW ///////////////////////////
    ///////////////////////////////////////////////////////////////
    
    function updateTableRow(book) {
        var tableRow = $('tr[data-id="' + modalBookId + '"]');
        var tableCells = $('td', tableRow);
        $(tableCells[0]).text(book.title);
        $(tableCells[1]).text(book.author);
        $(tableCells[2]).text(book.publisher);
        $(tableCells[3]).text(book.year);
        $(tableCells[4]).text(book.isbn);
        $(tableCells[5]).text(book.price);
    }
    
    ///////////////////////////////////////////////////////////////
    //////////////////////// DELETE ROW ///////////////////////////
    ///////////////////////////////////////////////////////////////
    
    function deleteTableRow($id) {
        var tableRow = $('tr[data-id="' + modalBookId + '"]');
        tableRow.remove();
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////// OTHER FUNCTIONS ///////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    ///////////////////////////////////////////////////////////////
    //////////////////// WHEN SUBMIT CLICKED //////////////////////
    ///////////////////////////////////////////////////////////////
    
    // Checks what modal state is, and acts upon it
    // 'modalState'
    $('#btn-submit').on('click', function(){
        if (modalState === "add") {
            // Run validation
            // Run by JQuery plugin
            // Easy to use, simply specify you rules
            // See at top
            // '$('#form-book').validate({});'
            if ($('#form-book').valid()) {
                // Store itself
                storeBook();
            }
        }
        else if (modalState === "edit") {
            if ($('#form-book').valid()) {
                // Update the books
                // Needs to send a PUT request to REST API 
                // Saying we want to replace the object 
                // W/ the specified Id with the new info
                updateBook();
            }
        }
        else if (modalState === "delete") {
            // Send DELETE request into API
            deleteBook();
        }
    });
    
    ///////////////////////////////////////////////////////////////
    ////////////////// BOOSTRAP DIALOGUE CLOSE ////////////////////
    ///////////////////////////////////////////////////////////////
    
    //-------------------------------------------------------------
    // reset the modal when it is closed
    // - remove modal heading text
    // - clear and enable all form controls, and remove error class from controls if present
    // - clear any error messages
    // - reset modal state and book id associated with modal form
    //-------------------------------------------------------------
    
    // We need to trap the 'dialogue close' event that Bootsrap executes
    // i.e So that in 'populateForm()' below, when we view a row
    // It indicates that the fields should be disabled (true)
    // But then when we close the modal, it is still set to true
    // So when we try to add a new table, directly after closing it
    // The add modal form's input fields are disabled too
    
    // When modal closes itself
    $('#modal-form').on('hidden.bs.modal', function (e) {
        $(this)
            .find("h4#modal-book-heading")
                .text('')
                .end()
            .find("input,textarea,select")
                .val('')
                .prop('disabled', false)
                .removeClass('error')
                .end()
            .find("input[type=checkbox], input[type=radio]")
                .prop("checked", "")
                .prop('disabled', false)
                .removeClass('error')
                .end()
            .find("span.error")
                .text('')
                .end();

        modalState = "closed";
        // Set to null as everytime we click a button, looks for a new Id
        modalBookId = null;
    });
    
    ///////////////////////////////////////////////////////////////
    /////////////////// POPULATE INPUT FIELDS /////////////////////
    ///////////////////////////////////////////////////////////////

    // Ref to book object
    // Ref to var that indicates if input vars should be disabled
    // True or false
    function populateForm(book, disabled) {
        // Ref to form object
        // Returns JQuery object with array
        // Look for the first form object in it
        var form = $('#form-book').get(0);
        $('#title', form).val(book.title).prop("disabled", disabled);
        $('#author', form).val(book.author).prop("disabled", disabled);
        $('#publisher', form).val(book.publisher).prop("disabled", disabled);
        $('#year', form).val(book.year).prop("disabled", disabled);
        $('#isbn', form).val(book.isbn).prop("disabled", disabled);
        $('#price', form).val(book.price).prop("disabled", disabled);
    }
    
    ///////////////////////////////////////////////////////////////
    ///////////////////// ALERT ERROR MESSAGE /////////////////////
    ///////////////////////////////////////////////////////////////
    
    // Takes message + Bootstrap class (type)
    // 'type' used to style
    function showMessage(message, type) {
        // config the message and display it
        $('#alert-message').text(message);
        $('#alert-message').addClass(type);
        $('#alert-message').show();
        // set a timeout function to remove the message in 5 seconds
        setTimeout(function () {
            $('#alert-message').hide();
            $('#alert-message').removeClass(type);
        }, 5000);
    }
});
