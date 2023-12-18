import { Album } from './../../models/Album';
import { NewImage } from './../../models/NewImage';
import { Component, OnInit } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/shared/ErrorStateMatcher';
import { FormControl, Validators } from '@angular/forms';
import { ImageService } from '../../image.service';
import { Router } from '@angular/router';
import { FireNotification } from 'src/app/shared/FireNotification';
import { CustomError } from 'src/app/shared/CustomError';
import { HttpErrorResponse } from '@angular/common/http';

const enum Status {
  'OK' = 'OK',
  'Fetch' = 'Fetching albums...',
  'Saving' = 'Processing... (saving image)',
  'Idle' = -1,
}

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss'],
})
export class AddImageComponent implements OnInit {
  constructor(private imgService: ImageService, private router: Router) {}

  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  isLoading = true;
  processing = false;
  error: CustomError | null = null;
  status: Status = Status.Fetch;

  albums: Album[] = [];

  titleFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
  ]);

  albumFormControl = new FormControl('', [Validators.required]);

  urlFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.reg),
  ]);

  thumbUrlFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.reg),
  ]);

  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
    this.fetchAlbums();
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    this.processing = true;
    this.disableFormFields();
    this.status = Status.Saving;

    this.imgService
      .addPhoto(
        new NewImage(
          +this.albumFormControl.value,
          this.titleFormControl.value,
          this.urlFormControl.value,
          this.thumbUrlFormControl.value
        )
      )
      .subscribe({
        next: (resp) => {
          console.log(resp);
        },
        error: (error: HttpErrorResponse) => {
          //console.log(error);
          FireNotification(error.message, 'error');
          this.error = new CustomError(error.message, error.status);
          this.status = Status.Idle;
          this.processing = false;
          this.enableFormFields();
        },
        complete: () => {
          this.status = Status.OK;
          FireNotification('Your image has been saved', 'success');
          this.router.navigate(['imagemanager', 'images']);
        },
      });
  }

  enableFormFields() {
    this.albumFormControl.enable();
    this.titleFormControl.enable();
    this.urlFormControl.enable();
    this.thumbUrlFormControl.enable();
  }

  disableFormFields() {
    this.albumFormControl.disable();
    this.titleFormControl.disable();
    this.urlFormControl.disable();
    this.thumbUrlFormControl.disable();
  }

  fetchAlbums() {
    this.status = Status.Fetch;
    this.isLoading = true;
    this.error = null;
    this.imgService.getAlbums().subscribe({
      next: (data: Album[]) => {
        this.albums = data;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.status = Status.Idle;
        this.error = new CustomError(error.message, error.status);
        this.disableFormFields();
      },
      complete: () => {
        this.isLoading = false;
        this.status = Status.OK;
        this.enableFormFields();
      },
    });
  }

  retry() {
    this.fetchAlbums();
  }
}
