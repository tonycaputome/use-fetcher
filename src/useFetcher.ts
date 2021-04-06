import { useEffect, useRef, useReducer } from 'react';

type Action = {
  type: string;
  payload?: any;
};

type State = {
  status: string;
  error: {} | null;
  data: {} | null;
};

type Response = {
  data?: any;
};

const STATUS = {
  IDLE: 'idle',
  FETCHING: 'fetching',
  FETCHED: 'fetched',
  ERROR: 'error',
};

const initialState: State = {
  status: STATUS.IDLE,
  error: null,
  data: {},
};

/**
 * @name useFetcher
 *
 *
 * @description
 *
 * @example
 *
 *
 */
const useFetcher = (key: string, promises: Promise<any>[]) => {
  let cancelRequest = false;

  const cache = useRef({});

  const [state, dispatch] = useReducer(
    (currentState: State = initialState, action: Action): State => {
      switch (action.type) {
        case STATUS.FETCHING:
          return { ...currentState, status: STATUS.FETCHING };
        case STATUS.FETCHED:
          return {
            ...currentState,
            status: STATUS.FETCHED,
            data: action.payload,
          };
        case STATUS.ERROR:
          return {
            ...currentState,
            status: STATUS.ERROR,
            error: action.payload,
          };
        default:
          return state;
      }
    },
    initialState,
  );

  const fetchData = async () => {
    if (cache.current[key]) {
      const data = cache.current[key];
      dispatch({ type: STATUS.FETCHED, payload: data });
    } else {
      dispatch({ type: STATUS.FETCHING });
      try {
        const queries = await Promise.all(promises);
        const resolved = queries.map((r: Response) => (r.data ? r.data : r));
        cache.current[key] = resolved;
        if (cancelRequest) return;
        dispatch({ type: STATUS.FETCHED, payload: resolved });
      } catch (error) {
        if (cancelRequest) return;
        dispatch({ type: STATUS.ERROR, payload: error.message });
      }
    }
  };

  useEffect(() => {
    if (!promises || promises.length === 0) return;

    fetchData();

    return () => {
      cancelRequest = true;
    };
  }, []);

  const { status, error, data } = state;

  return {
    isFecthing: status === STATUS.FETCHING,
    status,
    error,
    data,
    cache,
  };
};

export default useFetcher;
