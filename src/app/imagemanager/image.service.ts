import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from './models/Image';
import { NewImage } from './models/NewImage';
import { Observable, catchError, throwError } from 'rxjs';
import { ALBUMS_URL, PHOTOS_URL } from '../shared/URLs';
import { Album } from './models/Album';
import { CustomError, EvaluateErrorMessage } from '../shared/CustomError';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  // TODO: CRUD methods

  // * GET All
  getPhotos(): Observable<Image[]> {
    return this.http
      .get(PHOTOS_URL)
      .pipe(catchError(this.handleError)) as Observable<Image[]>;
  }

  // * GET One
  getPhotoById(id: number): Observable<Image> {
    return this.http
      .get(`${PHOTOS_URL}/${id}`)
      .pipe(catchError(this.handleError)) as Observable<Image>;
  }

  // * GET All Albums
  getAlbums(): Observable<Album[]> {
    return this.http
      .get(ALBUMS_URL)
      .pipe(catchError(this.handleError)) as Observable<Album[]>;
  }

  // * POST
  addPhoto(image: NewImage) {
    return this.http.post(PHOTOS_URL, image).pipe(catchError(this.handleError));
  }

  // ? PUT
  editPhoto(image: Image): Observable<Object> {
    return this.http
      .put(`${PHOTOS_URL}/${image.id}`, image)
      .pipe(catchError(this.handleError));
  }

  // ! DELETE
  deletePhoto(id: number): Observable<Object> {
    return this.http
      .delete(`${PHOTOS_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    var msg;

    if (error.status === 0) {
      //console.error('Client or network error', error);
      msg = 'Client or network error. Check your connection.';
    } else if (error.status >= 500) {
      //console.error('Server side error', error);
      msg = 'Server side error, please try again.';
    } else {
      msg = EvaluateErrorMessage(error.message, error.status);
    }

    return throwError(() => {
      return new CustomError(msg, error.status);
    });
  }
}
