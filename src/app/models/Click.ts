export class Click {
  browser: string;
  btype: string;
  bversion: string;
  project: string;
  created_at: string;
  desturl: string;
  first_click: string;
  host: string;
  id: string;
  ip: string;
  link_id: string;
  os: string;
  redirect: string;
  referer: string;
  robot: string;
  uri: string;
  uuid: string;
  vuid: string;
  isp: string;
  vpn: string;
  city: string;
  country: string;
  lang: string;
  constructor(
    browser: string,
    btype: string,
    bversion: string,
    project: string,
    created_at: string,
    desturl: string,
    first_click: string,
    host: string,
    id: string,
    ip: string,
    link_id: string,
    os: string,
    redirect: string,
    referer: string,
    robot: string,
    uri: string,
    uuid: string,
    vuid: string,
    isp: string,
    vpn: string,
    city: string,
    country: string,
    lang: string,
  ) {
    this.browser = browser;
    this.btype = btype;
    this.bversion = bversion;
    this.project = project;
    this.created_at = created_at;
    this.desturl = desturl;
    this.first_click = first_click;
    this.host = host;
    this.id = id;
    this.ip = ip;
    this.link_id = link_id;
    this.os = os;
    this.redirect = redirect;
    this.referer = referer;
    this.robot = robot;
    this.uri = uri;
    this.uuid = uuid;
    this.vuid = vuid;
    this.isp = isp;
    this.vpn = vpn;
    this.city = city;
    this.country = country;
    this.lang = lang;
  }
}
