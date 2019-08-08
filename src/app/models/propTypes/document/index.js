import {
  any,
  arrayOf,
  bool,
  element,
  objectOf,
  shape,
  string,
} from 'prop-types';
import anyPageData from '../pageData';

const documentPropTypes = {
  assets: arrayOf(string).isRequired,
  assetOrigins: arrayOf(string),
  app: string.isRequired,
  data: shape({
    pageData: anyPageData.isRequired,
  }).isRequired,
  styleTags: arrayOf(element).isRequired,
  helmet: objectOf(any).isRequired,
  isAmp: bool.isRequired,
  dials: objectOf(any).isRequired,
};

export default documentPropTypes;
