var list=[];
var maxSongs = 3; //to read from the server initially
var error;

//Click 'add song' button
$("#addSong").click(function(){
  firstValidation(selectedSongId);
});

//Click 'search' button
$("#search").click(function(){
  $('#addSong').removeAttr('disabled')
  error = "";
  $('#errormessage').text(error);
});

firstValidation = function(selectedSong){
  if (selectedSong == "") {
    var error = "You need to select a song";
    $('#errormessage').text(error);
  }
  else {
    loadSongsToForm(selectedSong);
  }
};

$('ul').on('click','button',function(el){
  song = this.id;
  deleteFromTheList(list,song);
  $(this).parent().remove();
  $('#addSong').removeAttr('disabled');
});

var firstValidation = function(selectedSong){
  if (selectedSong == "") {
    error = "You need to select a song";
    $('#errormessage').text(error);
  }
  else {
    validateSongChoice(selectedSong);
  }
};

var deleteFromTheList = function(list,song){
  var index = -1;
  for(var i=0; i < list.length; i++){
    if (list[i].spotifyID == song){
      index = i;
    }
  }
  if (index > -1){
    list.splice(index,1);
    $('#selected-song').val(list);
  }
};

var validateSongChoice = function(song) {
  if (checkIfSongAlreadyInList(song) === false) {
    var ppPartyName = $('#pp-party-name').text();
    var ppPartyDate = $('#pp-party-date').text();
    var singleSongChoice = song;
    serverVerifySong(location.origin,"/verifySong",{ppPartyName: ppPartyName, ppPartyDate: ppPartyDate, singleSongChoice: singleSongChoice},function(json){
      if (json.songChoiceAllowed == false) {
        error = "Song has been picked for this party already";
      $('#errormessage').text(error);
      }
      else {
        loadSongsToList(song);
        var songIDList = [];
        for (var i = 0; i < list.length; i++) {
          songIDList.push(list[i].spotifyID);
        }
        $('#selected-song').val(songIDList);
        $('#pp-party-name-hidden').val($('#pp-party-name').text());
        $('#pp-party-date-hidden').val($('#pp-party-date').text());
      }
    });
  }
  else {
    error = "You already have this song in your choices";
    $('#errormessage').text(error);
  }
};

var serverVerifySong = function(path,ext,object,callback){
  $.ajax({
          type: "GET",
          dataType: 'json',
          url: path+ext, //ext = '/qry'
          data: object,
          success: function(json){
            callback(json);
          }
        });

};

var loadSongsToList = function(selectedSong) {
  var id = "#"+selectedSong.substring(14)+'1';
  var name = $(id).attr('idName');
  list.push({spotifyID:selectedSong,name:name});
  text = name + '<button class="btn btn-inverse buttonX" id="'+selectedSong+'">x</button>';
  $('<li />',{html: text}).appendTo('ul.songList');
  if (list.length === maxSongs) {
    $('#addSong').attr('disabled', 'disabled');
  }
};

var checkIfSongAlreadyInList = function(song) {
  var index = -1;
  for(var i=0; i < list.length; i++){
    if (list[i].spotifyID == song){
      index = i;
    }
  }
  return (index != -1);
};
