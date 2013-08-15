(function($, factory) {




	'use strict';




	window.lazy = function(config) {
		return factory(config);
	};




})(window.jQuery, function(config) {




	'use strict';




	/**
	 * Lazy
	 *
	 * A little helper to assist in the delayed loading of non-essential components.
	 */
	function Lazy(config) {

		var _this = this;
		$.extend(_this.config, config);
		this.$el = $(_this.config.el);

		$(window).on('load resize', function() {
			_this.setWindowHeight();
		});

		$(window).on('load scroll resize', function() {
			_this.load(_this.visible());
		});

	}




	/**
	 * Config
	 */
	Lazy.prototype.config = {
		el: '.js-lazy'
	};




	/**
	 * State
	 */
	Lazy.prototype.state = {
		windowHeight: 0
	};




	/**
	 * Set Window Height
	 */
	Lazy.prototype.setWindowHeight = function() {
		this.state.windowHeight = $(window).height();
	};




	/**
	 * Visible
	 *
	 * Returns an array of all components in view.
	 */
	Lazy.prototype.visible = function() {

		var
			_this = this,
			visible = [];

		this.$el.each(function() {
			
			var
				$this = $(this),
				top,
				scrollTop;

			if($this.data('loaded')) {
				return true;
			}

			top = $this.offset().top,
			scrollTop = $(window).scrollTop();

			if(scrollTop + _this.state.windowHeight >= top) {
				visible.push($(this));
			}

		});

		return visible;

	};




	/**
	 * Load
	 *
	 * Actually loads and appends the components. If an array of elements
	 * is passed, the array will be itirated and this function recalled
	 * for each.
	 */
	Lazy.prototype.load = function($el) {

		var _this = this;

		// Array passed
		if(Object.prototype.toString.call($el) === '[object Array]') {
			return (function($el) {
				for(var i = 0; i < $el.length; i ++) {
					_this.load($el[i]);
				}
			})($el);
		}

		// Single element passed
		return (function($el) {
			$el.load('/fragments/' + $el.data('src'), function() {
				$el.addClass('loaded');
			});
			$el.data('loaded', true);
		})($el);

	}




	return new Lazy(config);




});