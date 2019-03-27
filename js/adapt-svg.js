define([
  'core/js/adapt',
  './svg-model',
  './svg-view'
], function(Adapt, SvgModel, SvgView) {

  return Adapt.register('svg', {
    model: SvgModel,
    view: SvgView
  });

});
