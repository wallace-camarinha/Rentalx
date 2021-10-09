interface ICreateRentalDTO {
  car_id: string;
  user_id: string;
  start_date: Date;
  expected_return_date: Date;
  id?: string;
  end_date?: Date;
  total?: number;
}

export { ICreateRentalDTO };
