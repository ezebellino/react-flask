// src/front/store.js

export const initialStore = () => ({
  message: null,
  todos: [],
  error: null,
  loading: false    // ← añadimos loading
});

export default function storeReducer(store, action = {}) {
  switch (action.type) {

    case 'SET_LOADING':
      return {
        ...store,
        loading: action.payload   // true o false
      };

    case 'SET_MESSAGE':
      return {
        ...store,
        message: action.payload
      };

    case 'SET_ERROR':
      return {
        ...store,
        error: action.payload
      };

    case 'CLEAR_ERROR':
      return {
        ...store,
        error: null
      };

    case 'SET_TODOS':
      return {
        ...store,
        todos: action.payload,
        error: null,
        loading: false           // detenemos loading
      };

    case 'ADD_TODO':
      return {
        ...store,
        todos: [...store.todos, action.payload],
        error: null,
        loading: false
      };

    case 'UPDATE_TODO':
      return {
        ...store,
        todos: store.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
        error: null,
        loading: false
      };

    case 'REMOVE_TODO':
      return {
        ...store,
        todos: store.todos.filter(todo => todo.id !== action.payload),
        error: null,
        loading: false
      };

    case 'RESET_STORE':      // útil al hacer logout
      return initialStore();

    default:
      throw Error('Unknown action: ' + action.type);
  }
}
