import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Person} from './person';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {MessageService} from './message.service';


@Injectable()
export class PersonService {
  constructor(private http: HttpClient, private messageService: MessageService) {
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  personUrl = 'http://localhost:8080/user/person';
  private log(message: string) {
    this.messageService.add(`PersonService: ${message}`);
  }

  /** DELETE: delete the person from the server */
  deletePersonById (person: Person | number ): Observable<Person> {
    const id = typeof person === 'number' ? person : person.id;
    const url = `${this.personUrl}/?id=${id}`;

    return this.http.delete<Person>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted person id=${id}`)),
      catchError(this.handleError<any>('deletePersonById'))
    );
  }


  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>('http://localhost:8080/user/all-person')
      .pipe(
        tap(_ => this.log('fetched persons')),
        catchError(this.handleError('getPersons', []))
      );
  }

  getPersonByID(person_id: string): Observable<Person> {
    const url = `${this.personUrl}/?id=${person_id}`;
    return this.http.get<Person>(url).pipe(
      tap(_ => this.log(`fetched person id=${person_id}`)),
      catchError(this.handleError<Person>(`getPerson id=${person_id}`))
    );
  }

  addPerson(person: Person): Observable<Person> {
    return this.http.post<Person>('http://localhost:8080/user/person', person, this.httpOptions)
      .pipe(
        tap((pers: Person) => this.log(`added person w/ id=${person.id}`)),
        catchError(this.handleError<Person>('addPersons'))
      );
  }


  updatePerson (person: Person): Observable<any> {
    return this.http.put<Person>(this.personUrl, person, this.httpOptions).pipe(
      tap(_ => this.log(`updated person id=${person.id}`)),
      catchError(this.handleError<any>('updatePerson'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
