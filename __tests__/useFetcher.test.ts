import { renderHook } from '@testing-library/react-hooks';
import { useFetcher } from '../src/index';

const cacheKey = 'a87a98sd79as';

const p1 = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { senderID: 1, message: 'message 1' },
        { senderID: 2, message: 'message 2' },
      ]);
    }, 1 * 1500);
  });

describe('useCounter tests', () => {
  it('should be defined', () => {
    expect(useFetcher).toBeDefined();
  });

  it('renders the hook correctly and checks types', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetcher(cacheKey, [p1()]),
    );
    expect(result.current.data).toEqual({});
    await waitForNextUpdate();
    expect(result.current.data).toHaveLength(1);
    expect(result.current.isFecthing).toBe(false);
  });
});
