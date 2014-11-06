"use strict";
(function($, App) {
    $.gameMemory = function(element, options) {
        var defaults = {
            contents: [],
            interval: "2000",
            quantity: 6,
            callback: {}
        };
        var plugin = this;
        plugin.settings = {};
        var $element = $(element);
        var element = element;
        var tiling;
        var currentTile = [];
        var currentIndex;
        var timerId = [];
        var nbClick = 0;
        var nbTileLook = 0;

        plugin.construct = function() {
            plugin.settings = $.extend({}, defaults, options);
            $element.append('<h1 class="title-game text-center">Jeu du memory</h1>');
            $element.append('<section class="row"><div id="tiling" class="col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1 tiling"></div></section>');
            var $tiling = $element.find('#tiling');
            if (plugin.settings.contents.length == 0) {
                $tiling.append('<p class="text-center">Pas de carte</p>');
            } else {
                tiling = _.sample(plugin.settings.contents, plugin.settings.quantity / 2);
                tiling = _.shuffle($.merge(tiling, tiling));
                for (var i = 0; i <= tiling.length - 1; i++) {
                    $tiling.append('<li class="tile col-xs-5 col-sm-2 col-md-4 col-lg-2"><div class="front"><i class="fa fa-eye"></i></div>' +
                        tiling[i]["content"] + '</li>');
                };
            }
            $element.append('<p class="info-game">Nombre de clics : <span  id="number-click" class="number-click">0</span></p>');
            plugin.init();
        };
        plugin.init = function() {
            setBindingEvents();
        };
        var setBindingEvents = function() {;
            setClickTile();
        };
        var setClickTile = function() {
            $element.find('.tile').on('click', function(e) {
                var index = $(this).index();
                if (_.isEmpty(currentTile)) {
                    currentTile.push({
                        id: $(this).find('.back').attr("data-tile"),
                        index: index
                    });
                }

                if (currentIndex != index) {
                    currentIndex = index;
                    if (nbTileLook != 2) {
                        nbClick++;
                        nbTileLook++;
                        $element.find('#number-click').text(nbClick);
                        $(this).toggleClass("tile-look");
                        timerId.push(_.delay(onTimeOutHideTile($(this)), plugin.settings.interval));
                        if (nbTileLook == 2 && currentTile[0].index != index) {
                            currentTile.push({
                                id: $(this).find('.back').attr("data-tile"),
                                index: index
                            });
                            onMatchedTile();
                        }
                    }
                }
            });
        }
        var onTimeOutHideTile = function(e) {
            return {
                apply: function() {
                    e.toggleClass("tile-look");
                    currentIndex = -1;
                    nbTileLook--;
                }
            }
        }
        var onMatchedTile = function() {
            currentIndex = -1;
            if (currentTile[0].id == currentTile[1].id) {
                toastr.success('Win !');
                $element.find('.back[data-tile="' + currentTile[0].id + '"]').parent().addClass('tile-valid');
                currentTile = [];
            } else {
                toastr.error('Loser !');
                currentTile = [];
                for (var i = 0; i < timerId.length; i++) {
                    clearTimeout(timerId[i]);
                };
                _.delay(function() {
                    $element.find(".tile").each(function() {
                        if ($(this).hasClass("tile-look")) {
                            $(this).removeClass("tile-look");
                            nbTileLook--;
                        }
                    });
                }, 1000);

            }
        }

        /*** external api ***/

        plugin.construct();
    }
    $.fn.gameMemory = function(options, customParams) {
        return $(this).each(function() {
            if (undefined == $(this).data('gameMemory')) {
                if (typeof options == "undefined") options = {};
                var plugin = new $.gameMemory(this, options);
                $(this).data('gameMemory', plugin);
            }
            if (typeof options === 'string') {
                $(this).data('gameMemory')[options].call($(this), $(this), customParams);
            }
        });
    }
})(jQuery, window.App);