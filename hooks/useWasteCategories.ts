import { useState, useEffect } from 'react';
import { getWasteCategories } from '@/lib/database';
import type { WasteCategory } from '@/types/database';

export function useWasteCategories() {
  const [categories, setCategories] = useState<WasteCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getWasteCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching waste categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryByName = (name: string) => {
    return categories.find(cat => cat.name === name);
  };

  const getCategoriesByType = (type: WasteCategory['category_type']) => {
    return categories.filter(cat => cat.category_type === type);
  };

  return {
    categories,
    loading,
    getCategoryByName,
    getCategoriesByType,
    refetch: fetchCategories,
  };
}