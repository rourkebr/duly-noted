var $noteTitle = $('.note-title');
var $noteText = $('.note-textarea');
var $saveNoteBtn = $('.save-note');
var $newNoteBtn = $('.new-note');
var $noteList = $('.list-container .list-group');

// // Show an element
// var showNote = function () {
//   return $.ajax({
//     url: '/api/notes',
//     method: 'SHOW'
// });
// };

// // Hide an element
// var hideNote = function () {
//   return $.ajax({
//     url: '/api/notes',
//     method: 'HIDE'
//   });
// };

// activeNote is used to keep track of the note in the textarea
var activeNote = {};

var getNotes = function () {
  return $.ajax({
    url: '/api/notes',
    method: 'GET'
  });
};

  var deleteNote = function (id) {
    return $.ajax({
      url: 'api/notes/' + id,
      method: 'DELETE'
    });
  };

  var renderActiveNote = function () {
    $saveNoteBtn.hide();
  
    if (activeNote.id) {
      $noteTitle.attribute('readonly', true);
      $noteText.attribute('readonly', true);
      $noteTitle.value(activeNote.title);
      $noteText.value(activeNote.text);
    } else {
      $noteTitle.attribute('readonly', false);
      $noteText.attribute('readonly', false);
      $noteTitle.value('');
      $noteText.value('');
    }
  };

var handleNoteSave = function () {
  var newNote = {
    title: $noteTitle.value(),
    text: $noteText.value(),
  };
  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
var handleNoteDelete = function (event) {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this)
  .parentElement('list-group-item')
  .data();

  
  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(function() {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
var handleNoteView = function () {
  e.preventDefault();
  activeNote = $(this).data();
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
var handleNewNoteView = function () {
  activeNote = {};
  renderActiveNote();
};

var handleRenderSaveBtn = function () {
  if (!noteTitle.value().trim() || !noteText.value.trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render the list of note titles
var renderNoteList = function (notes) {
  $noteList.empty();

  var noteListItems = [];
  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $('<li class="list-group-item">').data(note);
    var $span = $('<span>').text(note.title);
    var $delBtn = $(
      '<i class="fas fa-trash-alt float-right text-danger delete-note">'
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function () {
  return getNotes().then(function (data) {
    renderNoteList(data);
  });
};




  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  };

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function () {
  return getNotes().then(function (data) {
    renderNoteList(data);
  });
};


$saveNoteBtn.on('click', handleNoteSave);
$noteList.on('click', '.list-group-item', handleNoteView);
$newNoteBtn.on('click', handleNewNoteView);
$noteList.on('click', '.delete-note', handleNoteDelete);
$noteTitle.on('keyup', handleRenderSaveBtn);
$noteText.on('keyup', handleRenderSaveBtn);

getAndRenderNotes();
