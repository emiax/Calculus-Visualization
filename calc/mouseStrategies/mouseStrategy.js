'use strict';
/*global CALC */

(CALC.MouseStrategy = function (context) {
    this.context = context;
}).extend({
    mouseDown: function (event) {},
    mouseMove: function (event) {},
    mouseUp: function (event) {},
    mouseWheel: function (event) {},
    touchStart: function (event) {},
    touchEnd: function (event) {},
    touchMove: function (event) {},
    click: function (event) {},
    drag: function (event) {},
    scroll: function (event) {}
});