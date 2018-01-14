// We'll be rewriting the table's data frequently, so let's make our code more DRY
// by writing a function that takes in 'animals' (JSON) and creates a table 
$(document).on('click', '#getnews', function(){
  $.getJSON("/articles", function(data) {
  console.log(data);
    // Call our function to generate a table body
    displayResults(data);
});
});

function displayResults(data) {
    // First, empty the table
     //   $("tbody").empty();
    // Then, for each entry of that json...
     for (var i = 0; i<data.length; i++){
    // display the apropos information on the page
        // Append each of the animal's properties to the table
        $("tbody").append("<tr id='found.id'><td>" + data[i].title + "</td>" +
            "<td>" + data[i].link + "<button id='save' data-id="+ data[i]._id+">Save </button></td></tr>");
}
}



$(document).on('click', '#save', function(){
  // empty the notes from the note section
  $('#results').hide();
  $('#notes').empty();
  // save the id from the p tag
  var thisId = $(this).attr('data-id');

  // now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    // with that done, add the note information to the page
    .done(function( data ) {
      console.log(data);
      // the title of the article
      $('#notes').append('<h2>' + data.title + '</h2>'); 
      // an input to enter a new title
      $('#notes').append('<input id="titleinput" name="title" placeholder="Title">'); 
      // a textarea to add a new note body
      $('#notes').append('<textarea id="bodyinput" name="body" placeholder="Enter your note"></textarea>'); 
      // a button to submit a new note, with the id of the article saved to it
      $('#notes').append('<button class="btn btn-primary btn-lg" data-id="' + data._id + '" id="savenote">Save Note</button>');

      // if there's a note in the article
      if(data.note){
        // place the title of the note in the title input
        $('#titleinput').val(data.note.title);
        // place the body of the note in the body textarea
        $('#bodyinput').val(data.note.body);
      }
    });
});


// First thing: ask the back end for json with all animals

