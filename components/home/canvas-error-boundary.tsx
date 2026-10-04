'use client';

import { Component, type ReactNode } from 'react';
import Image from 'next/image';

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallbackImage?: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0">
          <Image
            src={this.props.fallbackImage ?? '/images/hero/hero-1.jpg'}
            alt="Thatch hut preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export { CanvasErrorBoundary };
