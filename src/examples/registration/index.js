import React, {useState, useEffect} from 'react';

const DefaultRegistration = React.lazy(() => import('./DefaultRegistration'));
const MobileRegistration = React.lazy(() => import('./MobileRegistration'));

const Registration = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {isMobile ? <MobileRegistration /> : <DefaultRegistration />}
    </React.Suspense>
  );
};

export default Registration;
