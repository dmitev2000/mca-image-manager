// export interface NewImage {
//   title: string;
//   url: string;
//   thumbnailUrl: string;
//   albumId: number;
// }

export class NewImage {
  constructor(
    public albumId: number,
    public title: string,
    public url: string,
    public thumbnailUrl: string
  ) {}
}
