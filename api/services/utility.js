module.exports = {
    toTitleCase: function(str) {
        return str.replace(/(?:^|\s)\w/g, function(match) {
            return match.toUpperCase();
        });
    },
    locationsList: function(cb) {
        var locations = [];
        Location.find().sort('name').exec(function(err,locs) {
            locations.push({val: '', text: 'World'});
            for(l=0;l<locs.length;l++) {
                locations.push({val: locs[l]['id'], text: locs[l]['name']});
            };
            cb(locations);
        });
    }
}