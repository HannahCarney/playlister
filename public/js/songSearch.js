$(document).ready(function() {

// find template and compile it
var source = document.getElementById('results-template').innerHTML;
var template = Handlebars.compile(source);
var resultsPlaceholder = document.getElementById('results');
var playingCssClass = 'playing';
var audioObject = null;

var fetchTracks = function (trackId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/tracks/' + trackId,
        success: function (response) {
            callback(response);
        }
    });
};

var searchTracks = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search?&market=GB&limit=5&offset=0',
        data: {
            q: query,
            type: 'track'
        },
        success: function (response) {
            resultsPlaceholder.innerHTML = template(response);
        }
    });
};

results.addEventListener('click', function (e) {
    var target = e.target;
    if (target !== null && target.classList.contains('cover')) {
        if (target.classList.contains(playingCssClass)) {
            audioObject.pause();
        } else {
            if (audioObject) {
                audioObject.pause();
            }
            fetchTracks(target.getAttribute('data-track-id'), function (data) {
                audioObject = new Audio(data.preview_url);
                audioObject.play();
                target.classList.add(playingCssClass);
                audioObject.addEventListener('ended', function () {
                    target.classList.remove(playingCssClass);
                });
                audioObject.addEventListener('pause', function () {
                    target.classList.remove(playingCssClass);
                });
            });
        }
    }
});

document.getElementById('song-choices').addEventListener('submit', function (e) {
    e.preventDefault();
    searchTracks(document.getElementById('query').value);
}, false);
});