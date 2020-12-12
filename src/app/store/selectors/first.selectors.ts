import { createSelector } from "@ngrx/store";
import { IAppState, ICounterState } from "../reducers/first.reducer";

export const countFeature = (state: IAppState) => state.count;

export const selectCounter = createSelector(countFeature, (state: ICounterState) => state.counter);
