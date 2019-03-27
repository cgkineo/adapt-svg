define([
  'core/js/adapt',
  'core/js/views/componentView',
  'libraries/bodymovin'
], function(Adapt, ComponentView, BodyMovin) {

  var SvgView = ComponentView.extend({

    initialize: function() {
      _.bindAll(this, "onScreenCallback");

      ComponentView.prototype.initialize.apply(this, arguments);
    },

    preRender: function() {
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setUpAnimation();

      window.anim = this.animation;

      this.animation.addEventListener("data_ready", this.onReady.bind(this));
    },

    setUpAnimation: function() {
      var config = this.model.get('_svg');

      this.animation = BodyMovin.loadAnimation({
        container: this.$('.component-widget')[0],
        renderer: 'svg',
        loop: config._loop,
        autoplay: config._autoplay,
        path: config._path,
        assetsPath: 'course/en/svgs/assets'
      });
    },

    onReady: function() {
      this.setReadyStatus();

      // Bind 'inview' once the images are ready.
      this.$('.component-widget').on('inview', this.inview.bind(this));
      this.setOnScreen(true);
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    },

    inview: function(event, visible, visiblePartX, visiblePartY) {
      if (visible) {
        if (visiblePartY === 'top') {
          this._isVisibleTop = true;
        } else if (visiblePartY === 'bottom') {
          this._isVisibleBottom = true;
        } else {
          this._isVisibleTop = true;
          this._isVisibleBottom = true;
        }

        if (this._isVisibleTop && this._isVisibleBottom) {
          this.$('.component-widget').off('inview');
          this.setCompletionStatus();
        }
      }
    },

    setOnScreen: function(bool) {
      // If i'm already in the right state, return
      if (bool === this._isListening) return;

      if (bool) {
        // If i'm not in the right state and I should be on
        this.$('.component-widget').on('onscreen', this.onScreenCallback);
        this._isListening = true;
        return;
      }

      // If i'm not in the right state and should be off
      this.$('.component-widget').off('onscreen', this.onScreenCallback);
      this._isListening = false;
    },

    onScreenCallback: function(event, measurement) {
      var isTopJustOffScreen = (measurement.percentFromTop < 150 && measurement.percentFromTop > 50);
      var isBottomJustOffScreen = (measurement.percentFromBottom < 150 && measurement.percentFromBottom > 50);

      if (measurement.onscreen === true || isTopJustOffScreen || isBottomJustOffScreen) {
        // Element is now visible in the viewport
        // Turn on animations
        this.setAnimate(true);
        return;
      } else {
        // Element has gone out of viewport
        // Turn off animations
        this.setAnimate(false);
      }
    },

     // Start / stop animation
    setAnimate: function(bool) {
      if (bool === this._isAnimating) return;

      if (bool) {
        this.animation.play();
        this._isAnimating = true;
        return;
      }

      this.animation.stop();
      this._isAnimating = false;
    },

    remove: function() {
      this.animation.destroy();

      // Remove any 'inview' listener attached.
      this.$('.component-widget').off('inview');

      this.setOnScreen(false);
      this.setAnimate(false);

      ComponentView.prototype.remove.apply(this, arguments);
    }

  });

  return SvgView;

});
