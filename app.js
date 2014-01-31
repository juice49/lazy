(function($, factory) {




	'use strict';




	window.Lazy = function(config) {
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

		return {

			go: function() {

				_this.$el = $(_this.config.el);
				_this.state.elLength = _this.$el.length;

				$(window).on('load resize', function() {
					_this.setWindowHeight();
				});

				$(window).on('load scroll resize', function() {
					_this.load(_this.visible());
				});

				return this;

			},

			on: function(event, callback) {
				_this.on(event, callback);
				return this;
			},

			defineLoader: function(name, fn) {
				_this.defineLoader.call(_this, name, fn);
				return this;
			}

		};

	}




	/**
	 * Config
	 */
	Lazy.prototype.config = {
		el: '.js-lazy',
		threshold: 0,
		url: ''
	};




	/**
	 * State
	 */
	Lazy.prototype.state = {

		// Window Height
		windowHeight: 0,

		// El Length: Number of lazy elements
		elLength: 0,

		// Load Count: Number of lazy elements that have loaded
		loadCount: 0

	};




	/**
	 * Events
	 */
	Lazy.prototype.events = {

		// Load: A single fragment loaded
		load: [],

		// AllLoad: All of the fragments loaded
		allLoad: []

	};




	/**
	 * On
	 */
	Lazy.prototype.on = function(event, callback) {
		if(event in this.events && typeof callback === 'function') {
			this.events[event].push(callback);
		}
	};




	/**
	 * Emit
	 */
	Lazy.prototype.emit = function(event, data) {
		for(var i = 0; i < this.events[event].length; i ++) {
			this.events[event][i].call(this, data);
		}
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

			if(scrollTop + _this.state.windowHeight >= top - _this.config.threshold) {
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
		if($el instanceof Array) {
			return (function($el) {
				for(var i = 0; i < $el.length; i ++) {
					_this.load($el[i]);
				}
			})($el);
		}

		// Single element passed
		return (function($el) {

			var loaderName = $el.data('loader');			
			var loader = _this.loaders[loaderName];

			// Check if the specified loader exists
			if(typeof loader !== 'function') {
				loaded();
				return console.error('`' + loaderName + '` loader not installed');
			}

			loader.call(_this, $el, _this.config.url + $el.data('src'), loaded);

			// After content load
			function loaded() {

				$el.data('loaded', true).addClass('loaded');
				_this.state.loadCount ++;
				_this.emit('load');

				if(_this.state.loadCount === _this.state.elLength) {
					_this.emit('allLoad');
				}

			}

		})($el);

	}




	/**
	 * Loaders
	 *
	 * Functions that provide loaders for different types of lazy loading.
	 */
	Lazy.prototype.loaders = {

		background: function($el, src, callback) {

			$el.css({ backgroundImage: 'url(' + src + ')' });

			$('<img>').attr('src', src).on('load', function() {
				$(this).remove();
				if(callback) return callback();
			});

		}

	};




	/**
	 * Define Loader
	 */
	Lazy.prototype.defineLoader = function(name, fn) {
		this.loaders[name] = fn;
	};




	return new Lazy(config);




});