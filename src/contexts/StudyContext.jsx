import { createContext, useContext, useReducer } from 'react';

const StudyContext = createContext();
const StudyDispatchContext = createContext();

const initialState = {
  studies: [],
  recentStudies: [],
  isLoading: false,
  totalCount: 0,
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

    case 'SET_TOTAL_COUNT':
      return {
        ...state,
        totalCount: action.payload,
      };

    default:
      return state;
  }
}

export function StudyProvider({ children }) {
  const [state, dispatch] = useReducer(studyReducer, initialState);

  return (
    <StudyDispatchContext.Provider value={dispatch}>
      <StudyContext.Provider value={{ state, dispatch }}>
        {children}
      </StudyContext.Provider>
    </StudyDispatchContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);

  if (!context) {
    throw new Error('useStudy는 StudyProvider 안에서 사용해야 합니다.');
  }

  return context;
}

export function useStudyDispatch() {
  const dispatch = useContext(StudyDispatchContext);

  if (!dispatch) {
    throw new Error('useStudyDispatch는 StudyProvider 안에서 사용해야 합니다.');
  }

  return dispatch;
}
