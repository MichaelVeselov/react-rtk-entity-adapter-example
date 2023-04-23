import { useDispatch } from 'react-redux';

import { resetToDefault } from './resetAction';

export const ResetApp = () => {
  const dispatch = useDispatch();

  return <button onClick={() => dispatch(resetToDefault())}>Reset</button>;
};
