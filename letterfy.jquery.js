/*
 *  Project: Letterfy
 *  Description: Turns the selected dom elements into individual letters.
 *  preserves links, etc...
 *
 *  Author: Scott Rogers
 *  License: Just give me some credit.
 */

// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, undefined ) {

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variables rather than globals
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = 'letterfy',
      document = window.document,
      defaults = {
        propertyName: "value"
      };

  // The actual plugin constructor
  function Plugin( element, options ) {
    this.element = element;

    // jQuery has an extend method which merges the contents of two or 
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.options = $.extend( {}, defaults, options) ;

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype.init = function () {
    // Place initialization logic here
    // You already have access to the DOM element and the options via the instance, 
    // e.g., this.element and this.options
    // var elements = $('body');
    var elements = this.element;
    // console.log(this.element)
    var loop_done = false;

    $(elements).each(function(n, el) {
      $element = $(this);
      letters = $element.text().split('');

      if ($element.find('a') && $element.find('a').attr('href')) {
        url = $element.find('a').attr('href');
      } else {
        url = false;
      }

      if (url) {
        $element.html('<a target="_blank" href="' + url + '"></a>')
      } else {
        $element.html('')
      }

      for (var i = 0; i < letters.length; i++) {
        if (url) {
          $element.find('a').append('<span class="letter">' + letters[i] + '</span>');
        } else {
          $element.append('<span class="letter">' + letters[i] + '</span>');
        }
      };
    });

    var letterLength = $('.letter').length - 1;
    var top = []
    var left = []
    var origCoords = {}

    $('.letter').each(function(n) {
      offsetTop = $(this).offset().top;
      offsetLeft = $(this).offset().left;

      top.push(offsetTop);
      left.push(offsetLeft);

      $(this).css({
        'top' : offsetTop,
        'left' : offsetLeft
      })
      if (n == letterLength) {
        $('.letter').css({
          'position':'absolute'
        })
      }
    });

    origCoords['left'] = left;
    origCoords['top'] = top;

    return origCoords;
    

  };

  // A really lightweight plugin wrapper around the constructor, 
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
      }
    });
  }

}(jQuery, window));