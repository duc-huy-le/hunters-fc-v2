export class Campaign {
  id: string;
  name: string;
  project_id: string;
  project_name: string;
  script: string;
  status: string;
  currency_code: string;
  number_of_clicks: number;
  number_of_clicks_real: number;
  adsCost: number;
  systemCost: number;
  uuid: string;
  created_at: Date;

  constructor(
    id: string,
    name: string,
    project_id: string,
    project_name: string,
    script: string,
    status: string,
    currency_code: string,
    number_of_clicks: number,
    number_of_clicks_real: number,
    adsCost: number,
    systemCost: number,
    uuid: string,
    created_at: Date
  ) {
    this.id = id;
    this.name = name;
    this.project_id = project_id;
    this.project_name = project_name;
    this.script = script;
    this.status = status;
    this.currency_code = currency_code;
    this.number_of_clicks = number_of_clicks;
    this.adsCost = adsCost;
    this.systemCost = systemCost;
    this.number_of_clicks_real = number_of_clicks_real;
    this.uuid = uuid;
    this.created_at = created_at;
  }
}
