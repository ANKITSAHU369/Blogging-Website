export const loadState = (stateName) => {
    try {
      const serializedState = localStorage.getItem(stateName);
      if (serializedState === null) {
        return {};
      }
      return JSON.parse(serializedState);
    } catch (e) {
      return {};
    }
  };
  
  export const saveState = (stateName, state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(stateName, serializedState);
    } catch (e) {}
  };