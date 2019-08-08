import React, { useContext } from 'react';
import Brand from '@bbc/psammead-brand';
import { bool } from 'prop-types';
import { ServiceContext } from '../../contexts/ServiceContext';

const BrandContainer = props => {
  const { product, serviceLocalisedName, brandSVG, service } = useContext(
    ServiceContext,
  );
  const svgMaxHeight = 24;
  const svgMinHeight = 16;
  const svgRatio = brandSVG && brandSVG.ratio;
  const minWidth = svgRatio * svgMinHeight;
  const maxWidth = svgRatio * svgMaxHeight;

  return (
    <Brand
      product={product}
      serviceLocalisedName={serviceLocalisedName}
      svgHeight={svgMaxHeight}
      minWidth={minWidth}
      maxWidth={maxWidth}
      svg={brandSVG}
      url={`/${service}`}
      {...props}
    />
  );
};

BrandContainer.propTypes = {
  borderTop: bool,
  borderBottom: bool,
};

BrandContainer.defaultProps = {
  borderTop: false,
  borderBottom: false,
};

export default BrandContainer;
