import React from 'react';

import Image from 'components/ThisCore/Image';
import {FillerSection} from 'components/ThisCore/FillerSection';
import imgForest from 'assets/images/backGround/img-forest.jpeg';
import imgCamera from 'assets/images/backGround/img-camera.jpeg';

export const ExampleScrollBackgroundRev = () => {
  return (
    <section className="">
      <div className="container py-5">
        <div className="py-5">
          <p className="constrain mb-3">
            These transformations are exactly the same as the scroll background
            effect, but... reversed.
          </p>
          <p className="constrain mb-3">
            This effect makes the background image appear to travel{' '}
            <strong>faster</strong> than the foreground content.
          </p>
        </div>
      </div>

      <Image src={imgCamera} alt="Camera Background" height="50vh" speed={-1}>
        <h3 className="image-text">reversed</h3>
      </Image>

      <FillerSection fillAmount={50} />

      <Image src={imgForest} alt="Forest Background" height="75vh" speed={-0.5}>
        <h3>somewhat slow, reversed</h3>
      </Image>

      <FillerSection />
    </section>
  );
};
