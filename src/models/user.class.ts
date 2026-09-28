export class User {
  id?: string;
  firstName: string;
  lastName: string;
  birthDate: number;
  address: string;
  zipCode: number;
  city: string;
  email: string;

  constructor(obj?: any) {
    this.id = obj?.id;
    this.firstName = obj ? obj.firstName : ''; // if else Abfrage (kurz)
    this.lastName = obj ? obj.lastName : '';
    this.birthDate = obj ? obj.birthDate : '';
    this.email = obj ? obj.email : '';
    this.address = obj ? obj.address : '';
    this.zipCode = obj ? obj.zipCode : '';
    this.city = obj ? obj.city : '';
  }

  public toJSON() {
    const { id, ...userData } = this;
    return userData;
  }
}