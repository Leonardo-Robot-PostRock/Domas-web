import { useState, useEffect } from 'react';

import { datetimeFormatted, currentDatetime } from 'utils/Datetime';

const useGradientOfTheDay = () => {
  const [gradientOfTheDay, setGradientOfTheDay] = useState<string>('null');

  useEffect(() => {
    const fetchGradientOfTheDay = async () => {
      try {
        const gradients: string[] = [
          `#418CB7,#FBDA61`,
          `#059E92,#32b49d,#51caa7,#70e0af,#8FF6B7 `,
          `#0A2A88,#59CDE9`,
          `#0093E9, #80D0C7`,
          `#C34F82, #2D294A`,
          `#418CB7,#FF8570`,
          `#4766f4,#b6f3c9`,
        ];

        const gradientIdx = parseInt(datetimeFormatted(currentDatetime(), 'd'));
        setGradientOfTheDay(gradients[gradientIdx]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGradientOfTheDay();
  }, []);

  return { gradientOfTheDay };
};

export default useGradientOfTheDay;
