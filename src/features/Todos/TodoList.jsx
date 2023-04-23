import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  selectVisibleTodos,
  todoSelectors,
  loadTodos,
  toggleTodo,
  removeTodo,
} from './todoSlice';

export const TodoList = () => {
  const dispatch = useDispatch();

  const activeFilter = useSelector((state) => state.filter);
  const todos = useSelector(todoSelectors.selectAll);
  const visibleTodos = selectVisibleTodos(todos, activeFilter);

  const { error, loading } = useSelector((state) => state.todos);

  useEffect(() => {
    const promise = dispatch(loadTodos())
      .unwrap()
      .then(() => {
        toast('All todos were fetched');
      })
      .catch((error) => {
        error ? toast(error) : toast('Error...');
      });

    /*     return () => {
      promise.abort();
    }; */

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer />
      <ul>
        {error && <h2>{error}</h2>}
        {loading === 'loading' && <h2>Loading...</h2>}
        {loading === 'idle' &&
          !error &&
          visibleTodos.map((todo) => (
            <li key={todo.id}>
              <input
                type='checkbox'
                checked={todo.completed}
                onChange={() => dispatch(toggleTodo(todo.id))}
              />{' '}
              {todo.title}{' '}
              <button onClick={() => dispatch(removeTodo(todo.id))}>
                delete
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};
