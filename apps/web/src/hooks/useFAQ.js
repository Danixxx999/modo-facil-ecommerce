import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export const useFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const records = await pb.collection('faq').getFullList({
          filter: 'active = true',
          sort: 'order',
          $autoCancel: false
        });
        setFaqs(records);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return { faqs, loading, error };
};
