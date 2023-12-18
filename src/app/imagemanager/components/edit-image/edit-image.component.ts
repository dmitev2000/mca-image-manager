import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { ImageService } from '../../image.service';
import { Image } from '../../models/Image';
import { Album } from '../../models/Album';
import { forkJoin, switchMap } from 'rxjs';
import { MyErrorStateMatcher } from 'src/app/shared/ErrorStateMatcher';
import { FireNotification } from 'src/app/shared/FireNotification';
import { CustomError } from 'src/app/shared/CustomError';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss'],
})
export class EditImageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private imgService: ImageService
  ) {}

  image: Image;
  albums: Album[] = [];

  isLoading: boolean = true;
  processing: boolean = false;
  error: CustomError | null = null;

  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  // * FORM CONTROLS
  idFormControl = new FormControl({ value: '', disabled: true });

  titleFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(10),
  ]);

  urlFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.reg),
  ]);

  thumbUrlFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.reg),
  ]);

  albumFormControl = new FormControl(0, [Validators.required]);

  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.error = null;

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          const { id } = params;
          return forkJoin({
            albums: this.imgService.getAlbums(),
            photo: this.imgService.getPhotoById(id),
          });
        })
      )
      .subscribe({
        next: ({ albums, photo }) => {
          this.albums = albums;
          this.image = photo;

          this.idFormControl.setValue(this.image.id.toString());
          this.titleFormControl.setValue(this.image.title);
          this.urlFormControl.setValue(this.image.url);
          this.thumbUrlFormControl.setValue(this.image.thumbnailUrl);
          this.albumFormControl.setValue(this.image.albumId);

          this.isLoading = false;
        },
        error: (error) => {
          // TODO: Handle errors appropriately.
          console.error(error);
          this.isLoading = false;
          this.error = new CustomError(error.message, error.status);
        },
        complete: () => {},
      });
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.processing = true;
    this.disableFormFields();
    this.imgService
      .editPhoto(
        new Image(
          +this.albumFormControl.value,
          +this.idFormControl.value,
          this.titleFormControl.value,
          this.urlFormControl.value,
          this.thumbUrlFormControl.value
        )
      )
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          FireNotification(error.message, 'error');
          this.processing = false;
          this.enableFormFields();
        },
        complete: () => {
          FireNotification('Your changes have been saved.', 'success');
          this.processing = false;
          this.enableFormFields();
        },
      });
  }

  retry() {
    this.fetchData();
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
}
