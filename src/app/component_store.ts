import { pipe } from "rxjs";
import { Directive, OnDestroy } from "@angular/core";
import { MemoizedSelector, ReducerManager, ActionReducer, createFeatureSelector, Store, Action, ActionCreator } from "@ngrx/store";
import { EffectSources, Actions, OnIdentifyEffects, OnRunEffects, ofType } from "@ngrx/effects";
import { takeUntil, filter } from "rxjs/operators";

let COMPONENT_ID = 1;

@Directive()
export abstract class ComponentStore<T>
	implements OnDestroy, OnIdentifyEffects, OnRunEffects {
	name = "";
	componentStateSelector: MemoizedSelector<any, any>;

	initActionType = '';
	destroyedActionType = '';
	setValueActionType = '';

	constructor(
		readonly store: Store,
		private readonly reducers: ReducerManager,
		private readonly effects: EffectSources,
		readonly actions$: Actions,
		reducer: ActionReducer<any, any>,
		id = "" // the possibility to add your own id, for example the entity id
	) {
		this.name = `${this.constructor.name}__${id || COMPONENT_ID++}`;
		this.initActionType = `[${this.name}] Init`;
		this.destroyedActionType = `[${this.name}] Destroyed`;
		this.setValueActionType = `[${this.name}] Set Value`;

		this.reducers.addReducer(this.name, (state, action) => {
			// let global actions pass through, invoke the component reducer
			if (!action.__meta) {
				return reducer(state, action);
			}

			// filter out local actions for this component
			if (!this.isComponentAction(action)) {
				return state;
			}

			// update state
			if (action === this.setValueActionType) {
				return action.value;
			}

			// local action, invoke the component reducer
			return reducer(state, action);
		});

		this.componentStateSelector = createFeatureSelector(this.name);

		setTimeout(() => {
			this.dispatch({ type: this.initActionType });
			this.effects.addEffects(this);
		})
	}


	select<R>(mapFn: (state: object) => R) {
		return this.store.select(mapFn)
	}

	isComponentAction({ __meta }) {
		return __meta.component === this.name
	}

	forThisComponent() {
		return filter(
			(action) => !(action as any).__meta || this.isComponentAction(action as any)
		);
	}

	localOfType(action: ActionCreator | string) {
		return pipe(
			ofType(action),
			this.forThisComponent()
		)
	}

	dispatch(action: Action) {
		this.store.dispatch(this.createLocalAction(action));
	}

	createLocalAction(action: Action) {
		(action as any).__meta = { component: this.name };
		return action;
	}

	ngOnDestroy() {
		this.reducers.removeReducer(this.name);
		this.dispatch({ type: this.destroyedActionType });
	}

	ngrxOnIdentifyEffects() {
		return this.name;
	}

	ngrxOnRunEffects(resolvedEffects$) {
		return resolvedEffects$.pipe(
			takeUntil(
				this.actions$.pipe(
					this.localOfType(this.destroyedActionType),
				)
			)
		);
	}
}
