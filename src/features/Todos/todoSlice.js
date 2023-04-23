import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import { resetToDefault } from '../Reset/resetAction';

const todosAdapter = createEntityAdapter({
  selectId: (todo) => todo.id,
});

export const loadTodos = createAsyncThunk(
  '@@todos/load-todos',
  async (_, thunkAPI) => {
    const { rejectWithValue, extra: api } = thunkAPI;
    try {
      return api.loadTodos();
    } catch (error) {
      return rejectWithValue(
        'Failed to fetch all todos at localhost:3001/todos...'
      );
    }
  },
  {
    condition: (_, { getState, extra }) => {
      const { loading } = getState().todos;
      if (loading === 'loading') {
        return false;
      }
    },
  }
);

export const createTodo = createAsyncThunk(
  '@@todos/create-todo',
  async (title, thunkAPI) => {
    const { extra: api } = thunkAPI;
    return api.createTodo(title);
  }
);

export const toggleTodo = createAsyncThunk(
  '@@todos/toggle-todo',
  async (id, thunkAPI) => {
    const { getState, extra: api } = thunkAPI;
    // const todo = getState().todos.entities.find((item) => item.id === id);
    const todo = getState().todos.entities[id];
    return api.toggleTodo(id, { completed: !todo.completed });
  }
);

export const removeTodo = createAsyncThunk(
  '@@todos/remove-todo',
  async (id, thunkAPI) => {
    const { extra: api } = thunkAPI;
    return api.removeTodo(id);
  }
);

const todoSlice = createSlice({
  name: '@@todos',
  initialState: todosAdapter.getInitialState({
    loading: 'idle',
    error: null,
  }),
  /*   initialState: {
    entities: [],
    loading: 'idle',
    error: null,
  }, */
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetToDefault, () => {
        return [];
      })
      /*       .addCase(loadTodos.pending, (state, action) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(loadTodos.rejected, (state, action) => {
        state.loading = 'idle';
        state.error = 'Something went wrong...';
      }) */
      .addCase(loadTodos.fulfilled, (state, action) => {
        const { payload } = action;
        /*     state.loading = 'idle';
        state.error = null; */
        todosAdapter.addMany(state, payload);
        // state.entities = payload;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        const { payload } = action;
        todosAdapter.addOne(state, payload);
        //state.entities.push(payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const { payload } = action;
        todosAdapter.updateOne(state, {
          id: payload.id,
          changes: {
            completed: payload.completed,
          },
        });
        /*    const index = state.entities.findIndex(
          (todo) => todo.id === payload.id
        );
        state.entities[index] = payload; */
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        const { payload } = action;
        todosAdapter.removeOne(state, payload);
        // state.entities = state.entities.filter((todo) => todo.id !== payload);
      })
      .addMatcher(
        (action) => {
          const { type } = action;
          return type.endsWith('/pending');
        },
        (state, action) => {
          state.loading = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => {
          const { type } = action;
          return type.endsWith('/rejected');
        },
        (state, action) => {
          const { error, payload } = action;
          state.loading = 'idle';
          state.error = payload || error.message;
        }
      )
      .addMatcher(
        (action) => {
          const { type } = action;
          return type.endsWith('/fulfilled');
        },
        (state, action) => {
          state.loading = 'idle';
          state.error = null;
        }
      );
  },
});

export const todoReducer = todoSlice.reducer;

export const todoSelectors = todosAdapter.getSelectors((state) => state.todos);

/* export const selectVisibleTodos = (state, filter) => {
  switch (filter) {
    case 'all': {
      return state.todos.entities;
    }
    case 'active': {
      return state.todos.entities.filter((todo) => !todo.completed);
    }
    case 'completed': {
      return state.todos.entities.filter((todo) => todo.completed);
    }
    default: {
      return state.todos;
    }
  }
}; */

export const selectVisibleTodos = (todos = [], filter) => {
  switch (filter) {
    case 'all': {
      return todos;
    }
    case 'active': {
      return todos.filter((todo) => !todo.completed);
    }
    case 'completed': {
      return todos.filter((todo) => todo.completed);
    }
    default: {
      return todos;
    }
  }
};
