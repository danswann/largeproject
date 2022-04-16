const SpotifyManager = require('./manager');
const PlaylistData = require('../models/playlistdata');
const Post = require('../models/post');

exports.getPlaylistData = async function(userID, playlistID) {
    var playlist = {};

    const swa = await SpotifyManager.getHandle(userID);

    // Get playlist metadata
    const result = await swa.getPlaylist(playlistID, {fields:'name,images,public'});
    playlist.name = result.body.name;
    if(result.body.images && result.body.images.length > 0) {
        //playlist.image = result.body.images[result.body.images.length - 1].url;
        playlist.image = result.body.images[0].url;
    }
    else playlist.image = 'https://placehold.jp/e0e0e0/787878/150x150.png?text=No%0AArt';
    playlist.public = result.body.public;

    // Get metadata on all tracks
    playlist.tracks = [];
    var offset = 0;
    var total = 0;
    do {
        const result = await swa.getPlaylistTracks(playlistID, {offset:offset, limit:50})
        playlist.tracks = playlist.tracks.concat(result.body.items.map(x => ({
            name: x.track.name,
            album: x.track.album.name,
            artists: x.track.artists.map(a => (a.name)),
            preview: x.track.preview_url,
            image: (x.track.album.images && x.track.album.images.length > 0 ? x.track.album.images[x.track.album.images.length - 1].url : 'https://placehold.jp/e0e0e0/787878/40x40.png?text=No%0AArt'),
            local: x.track.is_local,
            type: x.track.type,
            duration: x.track.duration_ms
        })));
        offset += 50;
        total = result.body.total;
    } while(total > offset)

    // Filter out Episode-type items and local-only items
    playlist.tracks = playlist.tracks.filter(x => x.type=='track' && !x.local);
    // Remove extra fields
    playlist.tracks = playlist.tracks.map(({local, type, ...rest}) => {return rest});

    // Return value
    return playlist;
}

exports.getPlaylistNameandImage = async function(userID, playlistID) {
    // Get playlist data from cache
    var playlist = await PlaylistData.findById(playlistID, {_id:0}).lean();
    if(playlist) return playlist;

    var playlist = {};

    // Attempt to get playlist data from cache
    const query = await PlaylistData.findById(playlistID, {_id:0}).lean();
    if(query) {
        playlist.name = query.name;
        playlist.image = query.image;
    }
    // Otherwise, fetch it from Spotify and create a new cache entry
    else {
        console.log('Cache miss!');
        const swa = await SpotifyManager.getHandle(userID);
        const result = await swa.getPlaylist(playlistID, {fields:'name,images'});
        if(result.body.images && result.body.images.length > 0)
            playlist.image = result.body.images[0].url;
        else playlist.image = 'https://placehold.jp/e0e0e0/787878/150x150.png?text=No%0AArt';
        playlist.name = result.body.name;
        // Add to cache
        PlaylistData.findByIdAndUpdate(playlistID, playlist, {upsert:true}, function(err) {
            console.log(err);
        });
    }
    return playlist;
}


exports.runUpdateLoop = async function() {
    // Get an instance of the SpotifyWebApi
    const swa = await SpotifyManager.getHandle();

    // Get a list of all posts
    const posts = await Post.find({}, {playlistID:1});

    // Loop through all posts and update playlist data
    for(post of posts) {
        // Get new data from Spotify API
        var update = {};
        const result = await swa.getPlaylist(post.playlistID, {fields:'name,images'});
        if(result.body.images && result.body.images.length > 0)
            update.image = result.body.images[0].url;
        else update.image = 'https://placehold.jp/e0e0e0/787878/150x150.png?text=No%0AArt';
        update.name = result.body.name;
        // Update cache
        PlaylistData.findByIdAndUpdate(post.playlistID, update, {upsert:true}, function(err) {
            if(err) console.log(err);
        });
    }
}
