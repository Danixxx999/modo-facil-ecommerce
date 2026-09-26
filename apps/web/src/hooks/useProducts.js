import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let filter = 'active = true';

        if (filters.category) {
          filter += ` && category = "${filters.category}"`;
        }

        if (filters.featured) {
          filter += ' && featured = true';
        }

        if (filters.search) {
          filter += ` && (name ~ "${filters.search}" || description ~ "${filters.search}")`;
        }

        const records = await pb.collection('products').getFullList({
          filter,
          sort: '-created',
          expand: 'category,recommendedCombo',
          $autoCancel: false
        });

        setProducts(records);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.category, filters.featured, filters.search]);

  return { products, loading, error };
};

export const useProduct = (slug) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const records = await pb.collection('products').getFullList({
          filter: `slug = "${slug}"`,
          expand: 'category,recommendedCombo',
          $autoCancel: false
        });

        if (records.length > 0) {
          setProduct(records[0]);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  return { product, loading, error };
};
