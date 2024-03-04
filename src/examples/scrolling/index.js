import React from 'react';
import PropTypes from 'prop-types';
import {GlobalScrollProvider} from 'hooks/useGlobalScroll';
import {GlobalMouseMoveProvider} from 'hooks/useGlobalMouseMove';

import {ExampleScrollText} from 'examples/scrolling/scrollText';

function Wrapper({children}) {
  return (
    <GlobalScrollProvider>
      <GlobalMouseMoveProvider>{children}</GlobalMouseMoveProvider>
    </GlobalScrollProvider>
  );
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

const TextScroll = () => {
  return (
    <Wrapper>
      <ExampleScrollText />
    </Wrapper>
  );
};

export default TextScroll;
