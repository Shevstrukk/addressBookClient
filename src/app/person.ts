

export class Person {
  constructor (public id: string,
               public firstName: string,
               public  lastName: string,
               public patronymic: string,
               public  emails: [string],
               public position: string,
               public appeal: string,
                public phones: [string],
               public address: {state: string, city: string, street: string, home: number,  number: number, },
               public comment: string
  ) {}
}
