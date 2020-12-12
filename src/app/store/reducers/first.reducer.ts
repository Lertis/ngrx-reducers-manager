import { Action, createReducer, on } from "@ngrx/store";
import { increment,decrement, reset } from "../actions/first.actions";

export interface IAppState {
	count: ICounterState;
}

export interface ICounterState {
	counter: number;
}

export const INITIAL_STATE: ICounterState= {
	counter: 0
};

export const reducer = createReducer(
	INITIAL_STATE,
	on(increment, state => ({ ...state, counter: state.counter + 1 })),
	on(decrement, state => ({ ...state, counter: state.counter - 1 })),
	on(reset, state => ({ ...state, counter: 0 }))
);

export function counterReducer(state: ICounterState | undefined, action: Action) {
	return reducer(state, action);
}
