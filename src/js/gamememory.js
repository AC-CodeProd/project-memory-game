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
        var nbClick = 0;
        var nbTileLook = 0;

        plugin.construct = function() {
            plugin.settings = $.extend({}, defaults, options);
            $element.append('<h1 class="title-game text-center">Jeu du memory</h1>');
            $element.append('<section id="zone" class="row"><div id="tiling" class="col-md-10 col-md-offset-1 tiling"></div></section>');
            var $zone = $element.find('#tiling');
            if (plugin.settings.contents.length == 0) {
                $zone.append('<p class="text-center">Pas de carte</p>');
            } else {
                tiling = _.sample(plugin.settings.contents, plugin.settings.quantity / 2);
                console.log(tiling);
                tiling = _.shuffle($.merge(tiling, tiling));
                for (var i = 0; i <= tiling.length - 1; i++) {
                    $zone.append('<div class="tile col-md-2"><div class="front"><i class="fa fa-eye"></i></div>' +
                        tiling[i]["content"] + '</div>');
                };
            }
            $element.append('<p>Nombre de clics : <span  id="number-click" class="number-click">0</span></p>');
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
                if (nbTileLook != 2) {
                    nbClick++;
                    nbTileLook++;
                    $element.find('#number-click').text(nbClick);
                    $(this).toggleClass("tile-look");
                    onTimeOutHideTile($(this));
                    onCheckTile($(this).find('.back').attr("data-tile"));
                }
            });

        }
        var onTimeOutHideTile = function(e) {
            setTimeout(function() {
                // _.without(currentTile, e.find('.back').attr("data-tile"));
                currentTile = $.grep(currentTile, function(value) {
                    return value != e.find('.back').attr("data-tile");
                });
                e.toggleClass("tile-look");
                nbTileLook--;
            }, plugin.settings.interval);
        }
        var onCheckTile = function(value) {
            currentTile.push(value);
            if (nbTileLook == 2) {
                if (currentTile[0] == currentTile[1]) {
                    $element.find('.back[data-tile="' + currentTile[0] + '"]').parent().addClass('tile-valid');
                }
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