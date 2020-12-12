export interface BooksState {
	books: Book[];
	authors: { [name: string]: Author };
}

export interface Book {
	title: string,
	numPages: number,
	author: string,
}

export enum SaveState {
	UNSAVED = 'unsaved',
	SAVING = 'saving',
	SAVED = 'saved',
}

export interface Author {
	name: string,
	dob: string,
	saveState?: SaveState,
}
