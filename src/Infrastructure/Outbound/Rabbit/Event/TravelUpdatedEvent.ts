export type TravelUpdatedEvent = {
    travelId: string;
    origin: Location;
    destination: Location;
    passengersId: number[];
  }