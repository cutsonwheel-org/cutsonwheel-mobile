export interface Service {
  type: string;
  duration: string;
  cost: number;
}
export class Services {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public description: string,
    public image: string,
    public services: Service
  ) {}
}
