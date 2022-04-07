const SpotifyManager = require('./manager');

exports.getPlaylistData = async function(userID, playlistID) {
    var playlist = {};

    const swa = await SpotifyManager.getHandle(userID);
    
    // Get playlist metadata
    const result = await swa.getPlaylist(playlistID, {fields:'name,images,public'});
    playlist.name = result.body.name;
    playlist.image = result.body.images[0]?.url||'http://placehold.jp/3d4070/ffffff/100x100.png?text=No%0Art';
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
            image: x.track.album.images[0]?.url || 'http://placehold.jp/3d4070/ffffff/100x100.png?text=No%0Art',
            local: x.track.is_local,
            type: x.track.type
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