import { Component, OnInit } from '@angular/core';
import {Person} from '../person';
import {FormArray, FormBuilder, FormControl, FormGroup, MaxLengthValidator, Validators} from '@angular/forms';
import {PersonService} from '../person.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  persons: Person[];
  emails = [];
  phones = [];
  personIdToUpdate = null;
  statusCode: number;
  processValidation = false;
  form: FormGroup;
  constructor(private personService: PersonService, private fb: FormBuilder  ) {
  }
  ngOnInit(): void {
    this.form = this.fb.group({
     // firstname: new FormControl('', Validators.required),
     // lastname: new FormControl('', Validators.required),
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      patronymic: new FormControl(''),
     // emails: this.fb.array([this.fb.group({email: new FormControl('', [Validators.required, Validators.email]  )} )]) ,
      emails: this.fb.array([this.fb.group({email: new FormControl('',  )} )]) ,
      position: new FormControl(''),
      appeal: new FormControl(''),
      phones: this.fb.array([this.fb.group({
        line: new  FormControl('' )} )]) ,
      address: this.fb.group({
        state: new FormControl(''),
        city: new FormControl(''),
        street: new FormControl(''),
        home: new FormControl(''),
        number: new FormControl(''),
      }),
      comment: new FormControl('')});
    this.getPerson();
  }
  getPerson(): void {
    this.personService.getPersons()
      .subscribe(
        persons => this.persons = persons,
        errorCode =>  this.statusCode = errorCode);
  }
  getFieldsEmail (input, field) {
    for ( let i = 0; i < input.length ; ++i) {
      this.getEmails.push(this.fb.group({email: (input[i][field])}));
    }
    this.deleteEmail(0);
  }

  getFieldsPhone (input, field) {
    for ( let i = 0; i < input.length ; ++i) {
      this.getPhones.push(this.fb.group({line: (input[i][field])}));
    }
    this.deletePhone(0);
  }
  getFields (input, field) {
    for ( let i = 0; i < input.length ; ++i) {
     // this.emails.push( (input[0][field]));
      return( (input[0][field]));
    }
  }

  getFieldsPhones1 (input, field) {
    for ( let i = 0; i < input.length ; ++i) {
      // this.emails.push( (input[0][field]));
      return( (input[0][field]));
    }
  }
  public get getEmails() {
    return this.form.get('emails') as FormArray;
  }
  addEmail() {
    this.getEmails.push(this.fb.group({email: ''}));
  }
  deleteEmail(index) {
    this.getEmails.removeAt(index);
  }
  public get getPhones() {
    return this.form.get('phones') as FormArray;
  }
  addPhone() {
    this.getPhones.push(this.fb.group({ line: ''}));
  }
  deletePhone(index) {
    this.getPhones.removeAt(index);
  }
  createPerson() {
    this.processValidation = true;
    if (this.form.invalid) {
      return; // Validation failed, exit from method.
    }
    this.preProcessConfigurations();
    const firstname = this.form.get('firstname').value.trim();
    const lastname = this.form.get('lastname').value.trim();
    const patronymic = this.form.get('patronymic').value.trim();
    const phones = this.form.value.phones;
    const emails  = this.form.value.emails;
    const position = this.form.get('position').value.trim();
    const appeal = this.form.get('appeal').value.trim();
    const address = this.form.value.address;
    const comment = this.form.get('comment').value.trim();
    if (this.personIdToUpdate === null) {
      const person = new Person(null, firstname, lastname, patronymic, emails , position, appeal, phones,    //  mobile,
        address, comment );
      console.log(person);
        this.personService.addPerson(person)
        .subscribe(pers => {
          this.persons.push(pers);
          this.getPerson();
          this.backToCreatePerson();
          });
    } else {const person = new Person( this.personIdToUpdate , firstname, lastname,
      patronymic,  emails, position, appeal, phones,  address, comment );
      console.log(person);
      this.personService.updatePerson(person)
        .subscribe(pers => {
            console.log(pers);
            this.getPerson();
            this.backToCreatePerson();
          },
          errorCode => this.statusCode = errorCode);
    }
  }
// Load Person by id to edit
  loadPersonToEdit(person_id: string) {
    this.preProcessConfigurations();
    this.personService.getPersonByID(person_id).subscribe(person => {
        console.log(person);
        this.personIdToUpdate = person.id;
        this.getFieldsEmail( person.emails, 'email');
        this.getFieldsPhone( person.phones, 'line');
        this.form.patchValue({
          // this.form.setValue({ // начальный вариант
          firstname: person.firstName,
          lastname: person.lastName,
          patronymic: person.patronymic,
          position: person.position,
          appeal: person.appeal,
          address: person.address,
          comment: person.comment,
           });
        console.log(this.form);
      },
      errorCode => this.statusCode = errorCode);
  }
// Delete Person
  deletePerson(person: Person): void {
    this.persons = this.persons.filter(h => h !== person);
    this.personService.deletePersonById(person).subscribe(  () => {
        this.getPerson();
        this.backToCreatePerson();
      },
      errorCode => this.statusCode = errorCode);

  }
  preProcessConfigurations() {
    this.statusCode = null;
  }
  backToCreatePerson() {
    this.personIdToUpdate = null;
   // this.form.reset();
    this.ngOnInit();
    this.processValidation = false;
  }
}
