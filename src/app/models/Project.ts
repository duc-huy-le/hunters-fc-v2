export class Project {
  id: string;
  name: string;
  link_tracking: string;
  uuid: string;
  status: string;
  created_at: Date;
  number_of_clicks: number;
  active: boolean;
  url: string;
  type_id: string;
  RedirectProfiles: any[];
  campaigns: any[] = [];

  constructor(
    id: string,
    name: string,
    link_tracking: string,
    uuid: string,
    status: string,
    created_at: Date,
    number_of_clicks: number,
    active: boolean,
    url: string,
    type_id: string,
    RedirectProfiles: any[],
    campaigns: any[]
  ) {
    this.id = id;
    this.name = name;
    this.link_tracking = link_tracking;
    this.uuid = uuid;
    this.status = status;
    this.created_at = created_at;
    this.number_of_clicks = number_of_clicks;
    this.active = active;
    this.url = url;
    this.type_id = type_id;
    this.RedirectProfiles = RedirectProfiles;
    this.campaigns = campaigns;
  }
}
