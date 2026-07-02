import { Location } from 'src/Domain/Model/Location';

export type TravelUpdatedEvent = {
  travelId: string;
  origin: Location;
  destination: Location;
  passengersId: number[];
};
