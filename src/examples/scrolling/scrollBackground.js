import React from 'react';

import Image from 'components/ThisCore/Image.js';
import imgForest from 'assets/images/backGround/img-forest.jpeg';
import imgCamera from 'assets/images/backGround/img-camera.jpeg';
import imgSpaceport from 'assets/images/backGround/img-spaceport.jpeg';

export const ExampleScrollBackground = () => {
  return (
    <section className="">
      <Image src={imgForest} alt="Forest Background" height="50vh" speed={1}>
        <h3 className="image-text">whoa...</h3>
      </Image>

      <Image
        src={imgSpaceport}
        alt="Space Port Background"
        height="75vh"
        speed={0.5}
      >
        <h3 className="image-text">sloooow</h3>
      </Image>

      <Image src={imgCamera} alt="Camera Background" height="50vh" speed={5}>
        <h3>out of bounds!</h3>
      </Image>

      <div className="py-5 bg-light text-dark">
        <div className="py-5">
          <p className="m-0">
            However, an image can be clamped (BUT it&apos;s recommended to only
            use this as a fallback as it looks wonky):
          </p>
        </div>
      </div>

      <Image
        src={imgCamera}
        alt="Camera Background"
        height="50vh"
        speed={5}
        clamp
      >
        <h3>I stop parallaxing when I am out of bounds!</h3>
      </Image>
    </section>
  );
};
