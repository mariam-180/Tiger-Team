import useBackgroundRefresh from 'utils/useBackgroundRefresh';
import { useState, useEffect } from 'react';
import { fetchControllers, getControllerByName } from 'utils/controllers';

const useSponsorAdsEnabled = () => {
  const [sponsorAdsEnabled, setSponsorAdsEnabled] = useState(false);
  const [sponsorTexts, setSponsorTexts] = useState([]);

  const loadSponsorAdsStatus = async () => {
    try {
      const controllers = await fetchControllers();
      const sponsorAdsController = getControllerByName(
        controllers,
        'SponsorAdsEnabled',
      );
      const sponsorAdsTextsController = getControllerByName(
        controllers,
        'SponsorAdsTexts',
      );

      if (sponsorAdsController && sponsorAdsController.value === 'true') {
        setSponsorAdsEnabled(true);
        if (sponsorAdsTextsController) {
          setSponsorTexts(sponsorAdsTextsController.value.split(','));
        }
      } else {
        setSponsorAdsEnabled(false);
      }
    } catch (error) {
      console.error('Error fetching SponsorAdsEnabled controller:', error);
    }
  };
  useEffect(() => {
    loadSponsorAdsStatus();
  }, []);
  useBackgroundRefresh(loadSponsorAdsStatus);

  return { sponsorAdsEnabled, sponsorTexts };
};

export default useSponsorAdsEnabled;
