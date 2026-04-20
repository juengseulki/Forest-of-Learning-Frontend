import { createContext, useContext, useReducer } from 'react';

const UIContext = createContext();

const initialState = {
  keyword: '',
  order: 'latest',
  listPage: 1,
};

function uiReducer(state, action) {
  switch (action.type) {
    case 'SET_KEYWORD':
      return { ...state, keyword: action.payload };

    case 'SET_ORDER':
      return { ...state, order: action.payload };

    case 'SET_PAGE':
      return { ...state, listPage: action.payload };

    case 'INCREMENT_PAGE':
      return { ...state, listPage: state.listPage + 1 };

    case 'RESET_PAGE':
      return { ...state, listPage: 1 };

    default:
      return state;
  }
}

export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  return (
    <UIContext.Provider value={{ state, dispatch }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error('useUI는 UIProvider 안에서 사용해야 합니다.');
  }

  return context;
}
