export type TravelCompletedEvent = {
  travelId: string;
  driverId?: number;
  organizerId: number;
  passengerList: number[];
};
