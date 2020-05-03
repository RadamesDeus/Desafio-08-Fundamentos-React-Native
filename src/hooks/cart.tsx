import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // TODO LOAD ITEMS FROM ASYNC STORAGE
    // AsyncStorage.removeItem('products');
    async function loadItemStorage(): Promise<void> {
      const productsSorage = await AsyncStorage.getItem('products');
      if (productsSorage) setProducts(JSON.parse(productsSorage));
    }
    loadItemStorage();
  }, []);

  const setStorageCart = useCallback(async () => {
    AsyncStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addToCart = useCallback(
    async product => {
      const newproduct: Product = product;
      newproduct.quantity = 1;
      setProducts([...products, newproduct]);
      setStorageCart();
    },
    [products, setStorageCart],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      setProducts(
        products.map(product => {
          if (product.id === id) product.quantity += 1;
          return product;
        }),
      );
      setStorageCart();
    },
    [products, setStorageCart],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      setProducts(
        products.map(product => {
          if (product.id === id && product.quantity > 1) product.quantity -= 1;
          return product;
        }),
      );
      setStorageCart();
    },
    [products, setStorageCart],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
