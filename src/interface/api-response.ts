import { JwtResponse } from './jwt-response';

export interface ApiResponse {
  auth?: JwtResponse;
  info: {
    statusCode: number;
    message?: string;
    error?: any;
  };
  isSuccess: boolean;
}
