import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { productService } from '../services/productService';
import { useToastContext } from './ToastContext';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    availability: 'all',
    sortBy: 'featured'
  });
  const toast = useToastContext();
  const requestIdRef = useRef(0);

  const fetchProducts = useCallback(async (customFilters = filters) => {
    const currentRequestId = ++requestIdRef.current;
    try {
      setLoading(true);
      const data = await productService.getAll(customFilters);
      if (currentRequestId === requestIdRef.current) {
        setProducts(data);
        setInitialLoaded(true);
      }
    } catch (err) {
      if (currentRequestId === requestIdRef.current) {
        console.error('Failed to fetch products:', err);
        toast.error('Failed to load products');
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      availability: 'all',
      sortBy: 'featured'
    });
  };

  const addProduct = async (productData) => {
    try {
      const created = await productService.create(productData);
      setProducts((prev) => [created, ...prev]);
      toast.success(`"${created.name}" has been listed successfully!`);
      return created;
    } catch (err) {
      toast.error(err.message || 'Failed to add product');
      throw err;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const updated = await productService.update(id, updates);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast.success(`Listing for "${updated.name}" updated!`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id, name) => {
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success(`"${name || 'Product'}" has been removed.`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
      throw err;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        initialLoaded,
        filters,
        updateFilters,
        resetFilters,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
