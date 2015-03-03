var list=[];
var maxSongs = 2; //to read from the server initially

$("#addSong").click(function(){
  var selectedSong = $('#selected-song').val();
  var id = "#"+selectedSong.substring(14)+'1';
  var name = $(id).attr('idName');
  list.push({spotifyID:selectedSong,name:name});
  text = name+'<button id="'+selectedSong+'">x</button>';
  $('<li />',{html: text}).appendTo('ul.songList');
  if (list.length === maxSongs) {
    $('#addSong').attr('disabled', 'disabled');
  }
  loadSongsToForm();
});

$('ul').on('click','button',function(el){
  song = this.id;
  deleteFromTheList(list,song);
  $(this).parent().remove();
  $('#addSong').removeAttr('disabled');
  loadSongsToForm();
});

deleteFromTheList = function(list,song){
  var index = -1;
  for(var i=0; i < list.length; i++){
    if (list[i].spotifyID == song){
      index = i;
    }
  }
  if (index > -1){
    list.splice(index,1);
  }
}

loadSongsToForm = function() {
  console.log('function called');
  var songIDList = [];
  for (var i = 0; i < list.length; i++) {
    songIDList.push(list[i].spotifyID);
  }
  console.log(songIDList);
  $('#selected-song').val(songIDList);
  $('#pp-party-name-hidden').val($('#pp-party-name').text());
  $('#pp-party-date-hidden').val($('#pp-party-date').text());
}
