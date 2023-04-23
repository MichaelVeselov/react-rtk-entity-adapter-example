const BASE_URL = 'http://localhost:3001/todos';

export const loadTodos = async () => {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  return data;
};

export const createTodo = async (title) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, completed: false }),
  });
  const data = await response.json();
  return data;
};

export const removeTodo = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await response.json();
  return id;
};

export const toggleTodo = async (id, checkbox) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(checkbox),
  });
  const data = await response.json();
  return data;
};
