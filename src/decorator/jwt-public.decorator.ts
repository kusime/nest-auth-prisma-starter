import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'IS_PUBLIC_KEY';
export const Public = (...args: string[]) => SetMetadata(IS_PUBLIC_KEY, args);
