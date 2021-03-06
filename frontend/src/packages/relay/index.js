// @flow

import {
  commitMutation as _commitMutation,
  // $FlowFixMe: this is actually correct
  commitLocalUpdate as _commitLocalUpdate,
} from 'react-relay';

import Environment from './src/Environment';

// TODO use here the actual Flow types instead of (broken) flow-typed definitions

const commitMutation = (
  mutation: string,
  options: Object, // TODO: MutationConfig<T>
) => {
  const {onCompleted, onError, ...rest} = options;
  return _commitMutation(Environment, {
    mutation,
    ...rest,
    onCompleted: (response /* , errors */) => {
      if (onCompleted) {
        onCompleted(response);
      }
    },
    onError: err => {
      if (onError) {
        onError(err);
      }
    },
  });
};

const commitLocalUpdate = (
  callback: Object => void, // TODO: (store: Store) => void
) => {
  _commitLocalUpdate(Environment, callback);
};

export {commitMutation, commitLocalUpdate};
export {createFragmentContainer, createPaginationContainer, graphql} from 'react-relay';
export {default as QueryRenderer} from './src/QueryRenderer';
