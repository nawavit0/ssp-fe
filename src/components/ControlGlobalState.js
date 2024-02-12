import React from 'react';
import { StoreProvider } from '../reactReducers/store';
import reducers from '../reactReducers/reducers';
import initialState from '../reactReducers/store/initialState';

const ControlGlobalState = props => {
  return (
    <StoreProvider initialState={initialState} reducer={reducers}>
      {props.children}
    </StoreProvider>
  );
};

export default ControlGlobalState;
