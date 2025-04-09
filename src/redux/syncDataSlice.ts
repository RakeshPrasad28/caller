import { Action } from '@reduxjs/toolkit';

export interface SyncDataState {
  syncLogs: { time: string; data: any[] }[];
}

export const ADD_SYNC_DATA = 'ADD_SYNC_DATA';

export interface SyncDataAction extends Action {
  type: typeof ADD_SYNC_DATA;
  payload: {
    syncTime: string;
    data: any[];
  };
}

const initialState: SyncDataState = {
  syncLogs: [],
};

export const addSyncData = (syncTime: string, data: any[]): SyncDataAction => {
  return {
    type: ADD_SYNC_DATA,
    payload: { syncTime, data },
  };
};

const syncDataReducer = (
  state = initialState,
  action: SyncDataAction
): SyncDataState => {
  switch (action.type) {
    case ADD_SYNC_DATA:
      return {
        ...state,
        syncLogs: [
          ...state.syncLogs,
          { time: action.payload.syncTime, data: action.payload.data },
        ],
      };
    default:
      return state;
  }
};

export default syncDataReducer;
