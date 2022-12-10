import { ExposeOptions, Transform } from 'class-transformer';
export const ExposeId = (options?: ExposeOptions) => {
  return (target: object, propertyKey: string) => {
    Transform((p) => p.obj[p.key].toString())(target, propertyKey);
  };
};