export class User {
  email: string;
  name: string;
  balance: string;
  wallet: string;
  status: string;
  uuid: string;
  aff_id: string;
  role: string;
  created_at: string;
  constructor(
    email: string,
    name: string,
    balance: string,
    wallet: string,
    status: string,
    uuid: string,
    aff_id: string,
    role: string,
    created_at: string
  ) {
    this.email = email;
    this.name = name;
    this.balance = balance;
    this.wallet = wallet;
    this.status = status;
    this.uuid = uuid;
    this.aff_id = aff_id;
    this.role = role;
    this.created_at = created_at;
  }
}
