import React from 'react';

type MultiProvidersPropsType = {
  providers: Array<{ provider: React.Provider<any>, value: any }>;
};

const MultiProviders: React.FC<MultiProvidersPropsType> = (props) => {
  const { providers, children } = props;

  if (!(Array.isArray(providers) && providers.length)) {
    return <>{children}</>;
  }

  let previous = <>{children}</>;
  for (let i = providers.length - 1; i >= 0; i -= 1) {
    previous = React.createElement(providers[i].provider, { value: providers[i].value }, previous);
  }

  return previous;
};

export function provide<T>(provider: React.Provider<T>, value: T) {
  return {
    provider,
    value
  };
}

const ExportMultiProviders: {
  provide?: typeof provide
} & typeof MultiProviders = MultiProviders;

ExportMultiProviders.provide = provide;

export default ExportMultiProviders;
