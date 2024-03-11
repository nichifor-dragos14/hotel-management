export interface PropertyQueryParams {
  location: string;
  startDate: string;
  endDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfRooms: number;
  [key: string]: string | number | boolean;
}
