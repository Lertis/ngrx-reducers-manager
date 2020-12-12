import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Author, Book } from "../models/models";

function randomDelay() {
	return timer((Math.random() + 2) * 1000);
}

/** Mimics some HTTP calls */
@Injectable({
	providedIn: 'root'
})
export class BooksHttpService {
	authors: Array<Author> = [];
	books: Array<Book> = [];

	getAuthors() {
		return randomDelay().pipe(map(() => [...this.authors]));
	}

	getBooks() {
		return randomDelay().pipe(map(() => [...this.books]));
	}

	saveAuthor(author: Author) {
		this.authors.push(author);
		return randomDelay().pipe(map(() => {
			return author;
		}));
	}

	addBook(book: Book) {
		return randomDelay().pipe(map(() => {
			if (!this.authors.find(a => a.name === book.author)) {
				throw Error(`"${book.title}" author not saved (${book.author})`);
			}
			this.books.push(book);
			return book;
		}));
	}
}
