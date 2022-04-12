const SpotifyManager = require('./manager');

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