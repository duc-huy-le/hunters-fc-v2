export class Offer {
  id: string;
  name: string;
  campaign_id: number;
  project_name: string;
  homepage_url: string;
  project_description: string;
  min_budgets: number;
  min_days: number;
  note: string;
  cpc: number;
  constructor(
    id: string,
    name: string,
    campaign_id: number,
    project_name: string,
    homepage_url: string,
    project_description: string,
    min_budgets: number,
    min_days: number,
    note: string,
    cpc: number
  ) {
    this.id = id;
    this.name = name;
    this.campaign_id = campaign_id;
    this.project_name = project_name;
    this.homepage_url = homepage_url;
    this.project_description = project_description;
    this.min_budgets = min_budgets;
    this.min_days = min_days;
    this.note = note;
    this.cpc = cpc;
  }
}
