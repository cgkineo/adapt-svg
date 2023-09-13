import Adapt from 'core/js/adapt';
import ComponentView from 'core/js/views/componentView';
import Lottie from 'libraries/lottie.min';
import documentModifications from 'core/js/DOMElementModifications';

export default class SvgView extends ComponentView {

  events() {
    return {
      'click .js-svg-play-pause': 'onPlayPauseClick'
    };
  }

  preRender() {
    this.isPaused = null;
    this.isInteracted = false;
    _.bindAll(this, 'checkIfOnScreen', 'onFail', 'onReady', 'onReducedMotionChange');
    this.update = _.throttle(this.update.bind(this), 17);
    this.isOnScreen = false;
    this.listenTo(Adapt, 'device:resize', this.onResize);
    this.checkIfResetOnRevisit();
  }

  postRender() {
    this.setUpAnimation();
    this.setUpListeners();

    if (this.model.get('_setCompletionOn') !== 'inview') return;
    this.setupInviewCompletion();
  }

  setUpAnimation() {
    const animation = this.model.get('_animation');
    const src = animation._src;
    const loop = animation._loops;
    const isSingleFile = /\.json/.test(src);
    this.animation = Lottie.loadAnimation({
      container: this.$('.svg__widget-aligner')[0],
      renderer: animation._renderer || 'svg',
      loop: loop === -1 ? true : loop, // see https://github.com/airbnb/lottie-web/wiki/loadAnimation-options#loop-default-is-true
      autoplay: false, // we'll use checkIfOnScreen to control when playback starts
      path: isSingleFile ? src : src + '/data.json'
    });
  }

  setUpListeners() {
    this.animation.addEventListener('data_ready', this.onReady);
    this.animation.addEventListener('data_failed', this.onFail);
    this.animation.addEventListener('complete', this.update);
    this.animation.addEventListener('loopComplete', this.update);
    this.animation.addEventListener('enterFrame', this.update);

    this.listenTo(documentModifications, 'changed:html', this.checkVisua11y);
  }

  onFail() {
    this.setCompletionStatus();
    this.$el.addClass('is-svg-fallback');
    Adapt.log.error(`adapt-svg: There was a problem loading SVG data for ${this.model.get('_id')}`);
    this.onReady();
  }

  onReady() {
    this.$el.imageready(() => {
      this.onResize();
      this.setReadyStatus();
      this.$('.component__widget').on('onscreen.animate', this.checkIfOnScreen);
      this.setUpReducedMotion();
      this.update();
    });
  }

  onResize() {
    if (this.model.get('_animation')._renderer !== 'svg') return;
    const $svg = this.$('.svg__widget-aligner svg');
    const $aligner = this.$('.svg__widget-aligner');
    this.dimensions = this.dimensions || {
      height: parseInt($svg.attr('height')),
      width: parseInt($svg.attr('width'))
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
      height
    });
  }

  setUpReducedMotion() {
    if (!this.model.get('_isReducedMotionSupportEnabled')) return;
    if (!window.matchMedia) return;
    this._reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!this?._reducedMotionQuery?.addEventListener) return;
    this._reducedMotionQuery.addEventListener('change', this.onReducedMotionChange);
    this.model.set('_originalAutoplay', this.model.get('_animation')._autoPlay);
    this.onReducedMotionChange();
  }

  onReducedMotionChange() {
    if (!this.animation) return;
    const isReducedMotion = (this.model.get('_isReducedMotionSupportEnabled') && this._reducedMotionQuery && this._reducedMotionQuery.matches);
    const animation = this.model.get('_animation');
    if (isReducedMotion) {
      this.goToEndAndStop();
      return;
    }
    animation._autoPlay = this.model.get('_originalAutoplay');
    this.model.set('_animation', animation);
    const shouldAutoPlay = (!this.shouldCheckIfOnScreen() || this.isOnScreen);
    this.animation[shouldAutoPlay ? 'goToAndPlay' : 'goToAndStop'](this.animation.firstFrame, true);
    this.update();
  }

  shouldCheckIfOnScreen() {
    return (this.model.get('_animation')._onScreenPercentInviewVertical > 0);
  }

  checkIfResetOnRevisit() {
    const isResetOnRevisit = this.model.get('_isResetOnRevisit');
    if (!isResetOnRevisit) return;
    this.model.reset(isResetOnRevisit);
  }

  checkIfOnScreen (event, measurements) {
    if (!this.animation || !this.shouldCheckIfOnScreen()) return;
    const animation = this.model.get('_animation');
    const percentage = animation._onScreenPercentInviewVertical;
    this.isOnScreen = (measurements.percentInviewVertical >= percentage);
    if (this.isOnScreen) {
      if (!animation._autoPlay || this.isInteracted) return;
      this.animation.play();
      this.update();
      return;
    }
    if (animation._offScreenPause) {
      this.animation.pause();
      this.update();
    }
    if (animation._offScreenRewind) {
      this.animation.goToAndStop(this.animation.firstFrame, true);
      this.update();
    }
  }

  onPlayPauseClick(event) {
    this.isInteracted = true;
    event.preventDefault();
    if (!this.animation) return;
    const isPaused = this.animation.isPaused;
    const isFinished = (this.animation.currentFrame === this.animation.totalFrames - 1);
    if (isPaused && isFinished) {
      this.animation.stop();
      this.animation.goToAndPlay(0);
    } else if (isPaused) {
      this.animation.play();
    } else {
      this.animation.pause();
      if (this.model.get('_animation')._onPauseRewind) {
        this.animation.stop();
        this.animation.goToAndStop(0);
      }
    }
    this.update();
  }

  update() {
    if (!this.shouldUpdate) return;
    const $button = this.$('.svg__playpause');
    const isFinished = (this.animation.currentFrame === this.animation.totalFrames - 1);
    this.isPaused = (this.animation.isPaused || isFinished);
    const setCompletionOn = this.model.get('_setCompletionOn');
    switch (setCompletionOn) {
      case 'inview':
        break;
      case 'played':
        !this.isPaused && this.setCompletionStatus();
        break;
      case 'finished':
      default:
        (isFinished || this.animation._completedLoop) && this.setCompletionStatus();
        break;
    }
    this.$el.toggleClass('is-svg-playing', !this.isPaused);
    this.$el.toggleClass('is-svg-paused', this.isPaused);
    $button.attr('aria-label', this.isPaused ? 'Play' : 'Pause');
  }

  shouldUpdate() {
    return (this.isPaused !== this.animation.isPaused);
  }

  goToEndAndStop() {
    const animation = this.model.get('_animation');
    animation._autoPlay = false;
    animation._showPauseControl = false;

    const lastFrame = this.animation.totalFrames - 1;
    this.toggleControls();
    this.animation.goToAndStop(lastFrame, true);
    this.animation.pause();
    this.update();
  }

  checkVisua11y() {
    const htmlClasses = document.documentElement.classList;
    if (!htmlClasses.contains('a11y-no-animations')) return;

    // Stop on last frame
    this.goToEndAndStop();
  }

  toggleControls() {
    const animation = this.model.get('_animation');
    const showPauseControl = animation._showPauseControl;
    this.$('.svg__playpause').toggle(showPauseControl);

    if (showPauseControl) return;

    // Remove click event
    this.undelegateEvents();
  }

  remove() {
    this.animation.stop();
    this.animation.destroy();
    this.$('.component__widget').off('onscreen.animate');
    super.remove();
  }

}
