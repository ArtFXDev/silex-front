export class User {
  first_name: string = "";
  last_name: string = "";
  email: string = "";
  id: string = "";
  has_avatar: boolean = false;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  firstTwoLetters(): string {
    return this.first_name[0].toUpperCase() + this.last_name[0].toUpperCase();
  }
}
