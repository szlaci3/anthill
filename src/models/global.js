export default {
  namespace: 'global',

  state: {
  },

  effects: {
  },

  reducers: {
    setCurrentViewId(state, action) {
      return {
        ...state,
        currentViewId: action.payload.currentViewId,
      };
    },
    setDisplayInsuranceInitializer(state, action) {
      return {
        ...state,
        displayInsuranceInitializer: action.payload,
      };
    },
    setDisplaySalaryInitializer(state, action) {
      return {
        ...state,
        displaySalaryInitializer: action.payload,
      };
    },
    setUploadToken(state, action) {
      return {
        ...state,
        uploadToken: action.payload,
      };
    },
    setForceVisibleAvatarDropdown(state, action) {
      return {
        ...state,
        forceVisibleAvatarDropdown: action.payload,
      };
    },
  },
};
