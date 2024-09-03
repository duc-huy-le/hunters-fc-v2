export class Ref {
  id: string;
  name: string;
  url: string;
  source_id: string;
  uuid: string;
  status: string;
  created_at: Date;

  constructor(
    id: string,
    name: string,
    url: string,
    source_id: string,
    uuid: string,
    status: string,
    created_at: Date
  ) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.source_id = source_id;
    this.uuid = uuid;
    this.status = status;
    this.created_at = created_at;
  }
}
