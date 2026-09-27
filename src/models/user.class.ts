export class User {
  firstName: string;
  lastName: string;
  birthDate: number;
  address: string;
  zipCode: number;
  city: string;

  constructor(obj?: any) {
    this.firstName = obj ? obj.firstName : ''; // if else Abfrage (kurz)
    this.lastName = obj ? obj.lastName : '';
    this.birthDate = obj ? obj.birthDate : 0;
    this.address = obj ? obj.address : '';
    this.zipCode = obj ? obj.zipCode : 0;
    this.city = obj ? obj.city : '';
  }
}