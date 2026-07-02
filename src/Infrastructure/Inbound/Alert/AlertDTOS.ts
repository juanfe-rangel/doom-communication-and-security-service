import { Location } from 'src/Domain/Model/Location';

export class AlertButtonDTO {
  constructor(
    public travelId: string,
    public location: Location,
    public contact?: string,
  ) {}
}

export class PanicButtonResponse {
  constructor(
    public content: string,
    public location: Location,
    public travelId: string,
    public userId: number,
    public contact?: string,
  ) {}
}
