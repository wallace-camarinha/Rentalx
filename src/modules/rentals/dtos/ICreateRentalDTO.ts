interface ICreateRentalDTO {
  car_id: string;
  user_id: string;
  start_date: Date;
  expected_return_date: Date;
}

export { ICreateRentalDTO };
