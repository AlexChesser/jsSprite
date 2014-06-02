(function() {
    var prot = ("//"),
        host = document.location.host;

    var scripts = [
        "/js/util/astar.js",
        "/js/rpg.js",
        "/js/engine/Tiles.js",
        "/js/engine/Cell.js",
        "/js/engine/CellType/Solid.js",
        "/js/engine/CellType/Espace.js",
        "/js/engine/CellType/Perim.js",
        "/js/engine/CellType/Up.js",
        "/js/engine/CellType/Down.js",
        "/js/engine/CellType/Hall.js",
        "js/engine/Map.js",
        "js/engine/Character.js"
    ];

    function completed() {
        rpg.init()
    }  

    function checkStateAndCall(path, callback) {
        var _success = false;
        return function() {
            if (!_success && (!this.readyState || (this.readyState == 'complete'))) {
                _success = true;
                //console.log(path, 'is ready'); // FIXME: remove logs
                callback();
            }
        };
    }

    function asyncLoadScripts(files) {
        function loadNext() { // chain element
            if (files.length === 0) { 
                completed();
                return;
            };
            var path = files.shift();
            var scriptElm = document.createElement('script');
            scriptElm.type = 'text/javascript';
            scriptElm.async = 'async';
            scriptElm.src = "/jsSprite/"+path;
            scriptElm.onload = scriptElm.onreadystatechange = 
                checkStateAndCall(path, loadNext); // load next file in chain when
                                                   // this one will be ready 
            var headElm = document.head || document.getElementsByTagName('head')[0];
            headElm.appendChild(scriptElm);
        }
        loadNext(); // start a chain
    }

    asyncLoadScripts(scripts);
})();