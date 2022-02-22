import * as React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const { Suspense } = React;

export function lazyLoadComponent(Component: React.LazyExoticComponent<any>) {
  return (props:unknown) => (
      <Suspense
        fallback={
          <ProgressSpinner 
            style={{
              width: '50px', 
              height: '50px'
            }} 
            strokeWidth="8" 
            fill="var(--surface-ground)" 
            animationDuration=".5s"
          />
        }
      >
        <Component {...props} />
      </Suspense>
  );
}
