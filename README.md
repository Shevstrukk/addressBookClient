This client application using Angular6 with TypeScript. For development environment we are using Angular CLI.
The Angular application will use Angular Http API for CRUD operation. Angular6 application will be single page application 
that will perform CRUD operation. On the basis of REST web service response HTTP status code, the Angular application will display
messages for success and failure of CRUD operation. In our REST web service application using Spring Boot we will expose two methods 
for read operation, one for fetching data by id and another for fetching all data. In our example we will perform CRUD operation
on addressbook. When we create record, the record id will be automatically generated by database. To fetch and delete record by id,
we will use request parameter to pass record id from client to REST web service application. 

 Technologies Used in Client Application
 
1. Angular 6.1.0
2. TypeScript 2.9.2
3. Node.js 10.16.0
4. Angular CLI 6.2.6
5. Angular Compiler CLI 6.1.0
