'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { RfqSheet } from '@/components/rfq/rfq-sheet';

interface RfqState {
  open: boolean;
  productName: string;
  sku: string;
  defaultQuantity?: number;
}

interface RfqContextValue {
  openRfq: (options?: {
    productName?: string;
    sku?: string;
    quantity?: number;
  }) => void;
  closeRfq: () => void;
}

const RfqContext = createContext<RfqContextValue | null>(null);

export function RfqProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RfqState>({
    open: false,
    productName: '',
    sku: ''
  });

  const openRfq = useCallback(
    (options?: { productName?: string; sku?: string; quantity?: number }) => {
      setState({
        open: true,
        productName: options?.productName ?? '',
        sku: options?.sku ?? '',
        defaultQuantity: options?.quantity
      });
    },
    []
  );

  const closeRfq = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  const value = useMemo(() => ({ openRfq, closeRfq }), [openRfq, closeRfq]);

  return (
    <RfqContext.Provider value={value}>
      {children}
      <RfqSheet
        open={state.open}
        onOpenChange={(open) => !open && closeRfq()}
        productName={state.productName}
        sku={state.sku}
        defaultQuantity={state.defaultQuantity}
      />
    </RfqContext.Provider>
  );
}

export function useRfq() {
  const ctx = useContext(RfqContext);
  if (!ctx) {
    throw new Error('useRfq must be used within RfqProvider');
  }
  return ctx;
}
