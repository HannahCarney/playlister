var list=[];
var maxSongs = 2; //to read from the server initially
var error;

$("#addSong").click(function(){
  var selectedSong = $('#selected-song').val();
  firstValidation(selectedSong);
});

$("#search").click(function(){
  $('#addSong').removeAttr('disabled')
  error = "";
  $('#errormessage').text(error);
});

firstValidation = function(selectedSong){
   if (selectedSong == "") {
    error = "You need to select a song";
    $('#errormessage').text(error);
   }
   else {
    loadSongsToForm(selectedSong);
   }
};


$('ul').on('click','button',function(el){
  console.log('This id: ' + this.id);
  song = this.id;
  deleteFromTheList(list,song);
  $(this).parent().remove();
  $('#addSong').removeAttr('disabled');
});

deleteFromTheList = function(list,song){
  var index = -1;
  console.log('List: ' + list + ' Song: ' + song);
  for(var i=0; i < list.length; i++){
    if (list[i].spotifyID == song){
      index = i;
    }
  }
  if (index > -1){
    console.log(index);
    list.splice(index,1);
    $('#selected-song').val(list);
  }
};

loadSongsToForm = function(song) {
  var ppPartyName = $('#pp-party-name').text();
  var ppPartyDate = $('#pp-party-date').text();
  var singleSongChoice = song;
  serverVerifySong(location.origin,"/verifySong",{ppPartyName: ppPartyName, ppPartyDate: ppPartyDate, singleSongChoice: singleSongChoice},function(json){
    if (json.songChoiceAllowed == false) {
      error = "Song has already been picked";
    $('#errormessage').text(error);
    }
    else {
      console.log('function called');
      validate(song);
      var songIDList = [];
      for (var i = 0; i < list.length; i++) {
        songIDList.push(list[i].spotifyID);
      }
      console.log(songIDList);
      $('#selected-song').val(songIDList);
      $('#pp-party-name-hidden').val($('#pp-party-name').text());
      $('#pp-party-date-hidden').val($('#pp-party-date').text());
    }
  });
};

serverVerifySong = function(path,ext,object,callback){
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

validate = function(selectedSong) {

    var id = "#"+selectedSong.substring(14)+'1';
    var name = $(id).attr('idName');
    list.push({spotifyID:selectedSong,name:name});
    text = name + '<button class="btn btn-inverse buttonX" id="'+selectedSong+'">x</button>';
    $('<li />',{html: text}).appendTo('ul.songList');
    if (list.length === maxSongs) {
      $('#addSong').attr('disabled', 'disabled');
    }
};
