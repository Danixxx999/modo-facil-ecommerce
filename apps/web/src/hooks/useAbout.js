import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export const useAbout = () => {
  const [benefits, setBenefits] = useState([]);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [benefitsData, valuesData] = await Promise.all([
          pb.collection('aboutBenefits').getFullList({
            sort: 'order',
            filter: 'active=true',
            $autoCancel: false
          }),
          pb.collection('aboutValues').getFullList({
            sort: 'order',
            filter: 'active=true',
            $autoCancel: false
          })
        ]);

        setBenefits(benefitsData);
        setValues(valuesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching about data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { benefits, values, loading, error };
};
