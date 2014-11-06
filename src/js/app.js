(function($) {
    var tiling = [];
    tiling.push({
        "content": '<img data-tile="memory01" class="back" src="assets/img/memory01.png">'
    }, {
        "content": '<img data-tile="memory02" class="back" src="assets/img/memory02.png">'
    }, {
        "content": '<img data-tile="memory03" class="back" src="assets/img/memory03.png">'
    }, {
        "content": '<img data-tile="memory04" class="back" src="assets/img/memory04.png">'
    }, {
        "content": '<img data-tile="memory05" class="back" src="assets/img/memory05.png">'
    }, {
        "content": '<img data-tile="memory06" class="back" src="assets/img/memory06.png">'
    });
    $("#game-memory").gameMemory({
        contents: tiling,
        quantity:8
    });
})(jQuery);