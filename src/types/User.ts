import ColorHash from "color-hash";

export class User {
  first_name: string = "";
  last_name: string = "";
  email: string = "";
  role: string = "";
  id: string = "";
  has_avatar: boolean = false;
  private colorHash;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
    this.colorHash = new ColorHash({ lightness: 0.7, saturation: 0.8 });
  }

  fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  firstTwoLetters(): string {
    return this.first_name[0].toUpperCase() + this.last_name[0].toUpperCase();
  }

  getHexColor(): string {
    return this.colorHash.hex(this.fullName());
  }
}
