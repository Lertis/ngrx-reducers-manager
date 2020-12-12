import { Injectable } from "@angular/core";
import { ReducerManager, Store, createSelector, createAction, props, createReducer, on } from "@ngrx/store";
import { createEffect, ofType, Actions, EffectSources } from "@ngrx/effects";
import { tap, concatMap } from "rxjs/operators";
import { BooksHttpService } from "./services/api";
import { Author, BooksState, SaveState } from "./models/models";
import { ComponentStore } from "./component_store";

const addAuthor = createAction("Add Author", props<{ author: Author }>());
const saveAuthor = createAction("Save Author", props<{ author: Author }>());
const savingAuthor = createAction("Saving Author", props<{ author: Author }>());
const saveAuthorSuccess = createAction(
	"Saving Author Success",
	props<{ author: Author }>()
);

@Injectable()
export class BooksStore extends ComponentStore<BooksState> {
	constructor(
		private readonly api: BooksHttpService,
		store: Store,
		reducers: ReducerManager,
		effects: EffectSources,
		actions$: Actions
	) {
		super(
			store,
			reducers,
			effects,
			actions$,
			createReducer(
				{
					books: [
						{ title: "Book A", numPages: 1, author: "Author A" },
						{ title: "Book B", numPages: 2, author: "Author B" }
					],
					authors: {}
				},

				on(addAuthor, (state, { author }) => ({
					...state,
					authors: {
						...state.authors,
						[author.name]: { ...author, saveState: SaveState.UNSAVED }
					}
				})),
				on(savingAuthor, (state, { author }) => ({
					...state,
					authors: {
						...state.authors,
						[author.name]: { ...author, saveState: SaveState.SAVING }
					}
				})),
				on(saveAuthorSuccess, (state, { author }) => ({
					...state,
					authors: {
						...state.authors,
						[author.name]: { ...author, saveState: SaveState.SAVED }
					}
				}))
			)
		);
	}

	// Adds/replaces author in the local state only.
	// This is a PUBLIC reducer
	readonly addAuthor = (author: Author) => this.dispatch(addAuthor({ author }));
	readonly savingAuthor = (author: Author) =>
		this.dispatch(savingAuthor({ author }));
	readonly saveAuthorSuccess = (author: Author) =>
		this.dispatch(saveAuthorSuccess({ author }));
	readonly saveAuthor = (author: Author) =>
		this.dispatch(saveAuthor({ author }));

	// Effect example
	saveAuthor$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(saveAuthor),
				this.forThisComponent(),
				tap(({ author }) => this.savingAuthor(author)),
				concatMap(({ author }) => this.api.saveAuthor(author)),
				tap(author => this.saveAuthorSuccess(author))
			),
		{ dispatch: false }
	);

	// Example selectors

	readonly getAuthors = createSelector(
		this.componentStateSelector,
		state => Object.values(state.authors) as Author[])

	readonly getAuthorsCount = createSelector(
		this.getAuthors,
		authors => authors && authors.length
	);

	readonly getBooks = createSelector(
		this.componentStateSelector,
		state => state && state.books
	);

	readonly authors$ = this.select(this.getAuthors);
	readonly authorsCount$ = this.select(this.getAuthorsCount);
	readonly books$ = this.select(this.getBooks);
}
