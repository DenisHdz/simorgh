import { oneOfType } from 'prop-types';
import { frontPageDataPropTypes } from '../frontPage';
import { articleDataPropTypes } from '../article';

export default oneOfType([articleDataPropTypes, frontPageDataPropTypes]);
