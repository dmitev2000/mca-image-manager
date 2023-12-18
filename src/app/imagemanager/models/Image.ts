// export interface Image {
//   albumId: number;
//   id: number;
//   title: string;
//   url: string;
//   thumbnailUrl: string;
// }

export class Image {
  constructor(
    public albumId: number,
    public id: number,
    public title: string,
    public url: string,
    public thumbnailUrl: string
  ) {}
}
