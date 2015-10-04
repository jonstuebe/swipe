'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Touch = (function () {
	function Touch(opts) {
		_classCallCheck(this, Touch);

		if (opts.el.length == 1) {
			if (typeof jQuery !== 'undefined' && opts.el instanceof jQuery) {
				this._isjQuery = true;
				this.$el = opts.el[0];
			} else {
				this.$el = opts.el[0];
			}
		}

		this._touchType = opts.el.type ? opts.el.type : 'horz';

		this.$el.addEventListener('touchstart', this);
		this.$el.addEventListener('touchmove', this);
		this.$el.addEventListener('touchend', this);

		this.opts = opts;
	}

	_createClass(Touch, [{
		key: 'handleEvent',
		value: function handleEvent(e) {
			switch (e.type) {
				case 'touchstart':
					this.handleTouchStart.apply(this, [e]);
					break;
				case 'touchmove':
					this.handleTouchMove.apply(this, [e]);
					break;
				case 'touchend':
					this.handleTouchEnd.apply(this, [e]);
					break;
			}
		}
	}, {
		key: 'handleTouchStart',
		value: function handleTouchStart(e) {
			if (e.touches.length !== 1) return;

			this._touching = true;
			this._touchStartTime = new Date();

			switch (this._touchType) {
				case 'horz':
					this._touchScreenX = e.touches[0].screenX;
					break;
				case 'vert':
					this._touchScreenY = e.touches[0].screenY;
					break;
			}

			if (typeof this.opts.onStart == 'function') this.opts.onStart.apply(this.$el, [e]);
		}
	}, {
		key: 'handleTouchMove',
		value: function handleTouchMove(e) {

			if (!this._touching) return;
			if (typeof this.opts.onMove == 'function') this.opts.onMove.apply(this.$el, [e]);
		}
	}, {
		key: 'handleTouchEnd',
		value: function handleTouchEnd(e) {

			if (!this._touching) return;

			this._touching = false;
			this._touchEndTime = new Date();

			var elapsedTime = this._touchEndTime - this._touchStartTime;
			var deltaX, deltaY, velocity, startPos, endPos;

			if (this._touchType == 'horz') {

				deltaX = Math.abs(e.changedTouches[0].screenX - this._touchScreenX);
				velocity = 0.8 * (1000 * deltaX / (1 + elapsedTime));
				startPos = this._touchScreenX;
				endPos = e.changedTouches[0].screenX;
			} else if (this._touchType == 'vert') {

				deltaY = Math.abs(e.changedTouches[0].screenY - this._touchScreenY);
				velocity = 0.8 * (1000 * deltaY / (1 + elapsedTime));
				startPos = this._touchScreenY;
				endPos = e.changedTouches[0].screenY;
			}

			e.velocity = velocity;
			e['start'] = startPos;
			e['end'] = endPos;

			if (typeof this.opts.onEnd == 'function') this.opts.onEnd.apply(this.$el, [e]);
		}
	}, {
		key: 'on',
		value: function on(type, handler) {
			if (type == 'start') this.opts.onStart = handler;
			if (type == 'end') this.opts.onEnd = handler;
			if (type == 'move') this.opts.onMove = handler;
		}
	}, {
		key: 'off',
		value: function off(type, handler) {
			if (type == 'start' && this.opts.onStart == handler) this.$el.removeEventListener('touchstart', this);
			if (type == 'end' && this.opts.onEnd == handler) this.$el.removeEventListener('touchend', this);
			if (type == 'move' && this.opts.onMove == handler) this.$el.removeEventListener('touchmove', this);
		}
	}]);

	return Touch;
})();

(function ($) {
	// What does the touch plugin do?
	var originalOn = $.fn.on;
	$.fn.on = function () {

		var ret;
		if (arguments.length > 1 && arguments[0].substr(0, 6) == 'touch.') {
			ret = $.fn.touch.on.apply(this, arguments);
		} else {
			ret = originalOn.apply(this, arguments);
		}
		return ret;
	};

	/*var originalOff = $.fn.off;
 $.fn.off = function(){
 	var ret = originalOff.apply(this, arguments);
 	console.log(ret);
 	if(arguments.length > 1 && arguments[0].substr(arguments[0].length - 6, arguments[0].length) == '.touch')
 	{
 		this.trigger({
 			type: 'removeListener.touch',
 			args: arguments[1]
 		});
 
 	}
 	return ret;
 }*/

	$.fn.touch = function (options) {

		if (!this.length) {
			return this;
		}

		var opts = $.extend(true, {}, $.fn.touch.defaults, options);

		this.each(function () {
			var $this = $(this);

			/*if(opts.onEnd == null)
   {
   	opts.onEnd = function(e){
   		$this.trigger({
   			type: 'end.touch',
   			velocity: e.velocity,
   			start: e.start,
   			end: e.end,
   			touches: e.changedTouches
   		});
   	}
   }
    if(opts.onStart == null)
   {
   	opts.onStart = function(e){
   		$this.trigger({
   			type: 'start.touch',
   			touches: e.touches
   		});
   	}
   }
    if(opts.onMove == null)
   {
   	opts.onMove = function(e){
   		$this.trigger({
   			type: 'move.touch',
   			touches: e.changedTouches
   		});
   	}
   }*/

			var touch = new Touch({
				el: $this,
				type: opts.type,
				onEnd: opts.onEnd,
				onStart: opts.onStart,
				onMove: opts.onMove
			});

			/*$this.on('removeListener.touch', function(e){
   	if(e.args[0] == 'end.touch')
   	{
   		touch.off('end', opts.onEnd);
   		opts.onEnd = null;
   	}
   });*/
		});

		return this;
	};

	$.fn.touch.on = function () {
		console.log(this, arguments);
	};

	// default options
	$.fn.touch.defaults = {
		type: 'horz',
		onEnd: null,
		onStart: null,
		onMove: null
	};
})(jQuery);
//# sourceMappingURL=app.js.map
