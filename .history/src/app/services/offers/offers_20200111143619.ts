
export class Offers {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public availability: string,
    public category: string,
    public duration: string,
    public charges: number,
    public userId: string,
    public qty?: number
  ) {}
}
