'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Touch = (function () {
	function Touch(opts) {
		_classCallCheck(this, Touch);

		this._touchType = opts.type ? opts.type : 'horz';
		this._opts = opts;

		for (var i = 0; i < opts.el.length; i++) {
			this.addListeners.apply(this, [opts.el[i]]);
		}
	}

	_createClass(Touch, [{
		key: 'addListeners',
		value: function addListeners() {

			var _el = arguments[0];
			_el.addEventListener('touchstart', this);
			_el.addEventListener('touchmove', this);
			_el.addEventListener('touchend', this);

			if (this._opts.mouseDrag) {
				_el.addEventListener('mousedown', this);
				_el.addEventListener('mousemove', this);
				_el.addEventListener('mouseup', this);
			}
		}
	}, {
		key: 'removeListener',
		value: function removeListener() {

			var _el = arguments[0];
			var _type = arguments[1];
			_el.removeEventListener(_type, this);
		}
	}, {
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

			if (this._opts.mouseDrag) {
				switch (e.type) {
					case 'mousedown':
						this.handleTouchStart.apply(this, [e]);
						break;
					case 'mousemove':
						this.handleTouchMove.apply(this, [e]);
						break;
					case 'mouseup':
						this.handleTouchEnd.apply(this, [e]);
						break;
				}
			}
		}
	}, {
		key: 'handleTouchStart',
		value: function handleTouchStart(e) {

			if (!this._opts.mouseDrag && e.touches.length !== 1) return;

			this._touching = true;
			this._touchStartTime = new Date();

			switch (this._touchType) {
				case 'horz':
					if (e.type == 'mousedown') {
						this._touchScreenX = e.screenX;
					} else {
						this._touchScreenX = e.touches[0].screenX;
					}
					break;
				case 'vert':
					if (e.type == 'mousedown') {
						this._touchScreenY = e.screenY;
					} else {
						this._touchScreenY = e.touches[0].screenY;
					}
					break;
			}

			if (typeof this._opts.onStart == 'function') this._opts.onStart.apply(this, [e]);
			e.preventDefault();
		}
	}, {
		key: 'handleTouchMove',
		value: function handleTouchMove(e) {

			if (!this._touching) return;

			var _delta;
			if (this._touchType == 'horz') {
				var _screenX = e.type == 'mousemove' ? e.screenX : e.changedTouches[0].screenX;
				_delta = _screenX - this._touchScreenX;
				e.start = this._touchScreenX;
				e.cur = _screenX;
			} else if (this._touchType == 'vert') {
				var _screenY = e.type == 'mousemove' ? e.screenY : e.changedTouches[0].screenY;
				_delta = _screenY - this._touchScreenY;
				e.start = this._touchScreenY;
				e.cur = _screenY;
			}

			e.delta = _delta;
			if (typeof this._opts.onMove == 'function') this._opts.onMove.apply(this, [e]);
			e.preventDefault();
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

				var _screenX = e.type == 'mouseup' ? e.screenX : e.changedTouches[0].screenX;

				deltaX = Math.abs(_screenX - this._touchScreenX);
				velocity = 0.8 * (1000 * deltaX / (1 + elapsedTime));
				startPos = this._touchScreenX;
				endPos = _screenX;
			} else if (this._touchType == 'vert') {

				var _screenY = e.type == 'mouseup' ? e.screenY : e.changedTouches[0].screenY;

				deltaY = Math.abs(_screenY - this._touchScreenY);
				velocity = 0.8 * (1000 * deltaY / (1 + elapsedTime));
				startPos = this._touchScreenY;
				endPos = _screenY;
			}

			e.velocity = velocity;
			e.start = startPos;
			e.end = endPos;

			if (typeof this._opts.onEnd == 'function') this._opts.onEnd.apply(this, [e]);
			e.preventDefault();
		}
	}, {
		key: 'on',
		value: function on(type, handler) {
			if (type == 'start') this._opts.onStart = handler;
			if (type == 'end') this._opts.onEnd = handler;
			if (type == 'move') this._opts.onMove = handler;
		}
	}, {
		key: 'off',
		value: function off(type, handler) {

			for (var i = 0; i < this._opts.el.length; i++) {
				if (type == 'start' && this._opts.onStart == handler) {
					this.removeListener.apply(this, [this._opts.el[i], 'touchstart']);
				} else if (type == 'end' && this._opts.onEnd == handler) {
					this.removeListener.apply(this, [this._opts.el[i], 'touchend']);
				} else if (type == 'move' && this._opts.onMove == handler) {
					this.removeListener.apply(this, [this._opts.el[i], 'touchmove']);
				}
			}
		}
	}]);

	return Touch;
})();
//# sourceMappingURL=app.js.map
