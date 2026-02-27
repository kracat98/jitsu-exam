import { isEqual } from "lodash";
import { useCallback, useRef, useSyncExternalStore } from "react";

type State = {};

type Selector<T, R> = (state: T) => R;

type Listener = () => void;

type Store<T> = {
  getState: () => T;
  setState: (fn: (state: T) => T) => void;
  subscribe: (listener: Listener) => () => void;
  resetState: () => void;
};

export const createStore = <T extends State>(initialState: T): Store<T> => {
  let state = initialState;
  const listeners = new Set<Listener>();

  const getState = () => state;

  const setState = (fn: (state: T) => T) => {
    state = fn(state);
    listeners.forEach((listener) => listener());
  };

  const resetState = () => {
    state = initialState;
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe, resetState };
};

export const useStore = <T extends State, R>(
  store: Store<T>,
  selector: Selector<T, R>,
) => {
  const previousSelectionRef = useRef<R>(selector(store.getState()));

  const selectorFn = useCallback(() => {
    const currentSelection = selector(store.getState());

    // Only update the reference if the selected state has actually changed
    if (!isEqual(previousSelectionRef.current, currentSelection)) {
      previousSelectionRef.current = currentSelection;
    }

    return previousSelectionRef.current;
  }, [store, selector]);

  return useSyncExternalStore(store.subscribe, selectorFn, selectorFn);
};
