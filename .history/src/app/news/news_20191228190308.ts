export class News {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public featuredImage: string,
    public type: string,
    public url: string,
    public published: Date
  ) {}
}
