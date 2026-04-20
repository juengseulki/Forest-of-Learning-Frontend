import { createContext, useContext, useReducer } from 'react';

const StudyContext = createContext();

const initialState = {
  studies: [],
  recentStudies: [],
  isLoading: false,
};

function studyReducer(state, action) {
  switch (action.type) {
    case 'SET_STUDIES':
      return {
        ...state,
        studies: action.payload,
      };

    case 'SET_RECENT':
      return {
        ...state,
        recentStudies: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

export function StudyProvider({ children }) {
  const [state, dispatch] = useReducer(studyReducer, initialState);

  return (
    <StudyContext.Provider value={{ state, dispatch }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);

  if (!context) {
    throw new Error('useStudy는 StudyProvider 안에서 사용해야 합니다.');
  }

  return context;
}
