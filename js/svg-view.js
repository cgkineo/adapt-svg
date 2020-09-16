define([
  'core/js/adapt',
  'core/js/views/componentView',
  'libraries/lottie.min'
], function(Adapt, ComponentView, Lottie) {

  var SvgView = ComponentView.extend({

    preRender: function() {
      _.bindAll(this, 'checkIfOnScreen', 'onFail', 'onReady');
      this.listenTo(Adapt, 'device:resize', this.onResize);
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setUpAnimation();
    },

    setUpAnimation: function() {
      const config = this.model.get('_svg');

      this.animation = Lottie.loadAnimation({
        container: this.$('.svg__widget-aligner')[0],
        renderer: config._renderer,
        loop: config._loop,
        autoplay: config._autoplay,
        path: config._path + '/data.json'
      });
      this.animation.addEventListener('data_ready', this.onReady);
      this.animation.addEventListener('data_failed', this.onFail);
    },

    onFail: function() {
      Adapt.log.error(`adapt-svg: There was a problem loading SVG data for ${this.model.get('_id')}`);
      this.animation.removeEventListener('data_ready', this.onReady);
      this.animation.removeEventListener('data_failed', this.onFail);
    },

    onReady: function() {
      this.animation.removeEventListener('data_ready', this.onReady);
      this.animation.removeEventListener('data_failed', this.onFail);

      this.onResize();
      this.setReadyStatus();
      this.setupInviewCompletion('.component__widget');

      if (this.animation.autoplay) return;

      this.$('.component__widget').on('onscreen.animate', this.checkIfOnScreen);
    },

    onResize: function() {
      const $svg = this.$('svg');
      const $aligner = this.$('.svg__widget-aligner');
      this.dimensions = this.dimensions || {
        height: parseInt($svg.attr('height')),
        width: parseInt($svg.attr('width')),
      };
      const ratio = this.dimensions.height / this.dimensions.width;
      const width = this.$el.width();
      const height = width * ratio;
      const scale = (1 / this.dimensions.width) * width;
      $svg.css({
        width: this.dimensions.width,
        height: this.dimensions.height,
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      });
      $aligner.css({
        height: height
      });
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    },

    checkIfOnScreen: function (event, measurements) {
      if (measurements.percentInviewVertical > 0) {
        this.animation.play();
        return;
      }

      this.animation.stop();
    },

    remove: function() {
      this.animation.stop();

      this.animation.destroy();

      this.$('.component__widget').off('onscreen.animate');

      ComponentView.prototype.remove.apply(this, arguments);
    }

  });

  return SvgView;

});
