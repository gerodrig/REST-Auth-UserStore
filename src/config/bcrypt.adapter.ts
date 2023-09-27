import { genSaltSync, compareSync, hashSync } from 'bcryptjs';

export const bcryptAdapter = {
  
  hash: (password: string): string => hashSync(password, genSaltSync()),

  compare: (password: string, hash: string): boolean =>
    compareSync(password, hash),
};
