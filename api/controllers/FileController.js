// Gets uploaded files for display

module.exports = {
get: function (req, res) {
res.sendfile(req.path.substr(1));
},
_config: {
rest: false,
shortcuts: false
}
};