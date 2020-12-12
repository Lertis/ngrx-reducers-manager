import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { BooksStore } from "../book_store";
import { Author, Book } from "../models/models";


@Component({
  selector: "book-shelf",
  templateUrl: "./book-shelf.component.html",
  // provides   👇  Component-level Service
  providers: [BooksStore]
})
export class BookShelfComponent {
  @Input() index: number;
  name = this.booksStore.name;
  readonly authors$: Observable<Author[]> =
    // reactive way to 👇 read all authors
    // this.booksStore.getAuthors();
    this.booksStore.authors$;

  readonly authorsCount$: Observable<number> =
    // reactive way to 👇 read transformed/derived data
    this.booksStore.authorsCount$;

  readonly books$: Observable<Book[]> = this.booksStore.books$;

  // Injects the specialized ComponentStore
  // that knows how to work with book data  👇
  constructor(private readonly booksStore: BooksStore) {}

  addAuthor(count: number) {
    // adds Author to the local state that is kept
    // within BooksStore 👇 and doesn't call APIs.
    this.booksStore.addAuthor({
      name: generateAuthorName(count, this.index),
      dob: '1985/01/01',
    });
  }

  saveAuthor(author: Author) {
    // saves Author to the backend. This is a way
    // to interact with services that wrap API calls
    // and persist or read data 👇
    this.booksStore.saveAuthor(author);
  }
}

function generateAuthorName(count: number, index: number): string {
	return `Author ${ String.fromCharCode('A'.charCodeAt(0) + count)} ${index}`;
}
