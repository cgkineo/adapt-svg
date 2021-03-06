import Adapt from 'core/js/adapt';
import SvgModel from './svg-model';
import SvgView from './svg-view';

export default Adapt.register('svg', {
  model: SvgModel,
  view: SvgView
});
