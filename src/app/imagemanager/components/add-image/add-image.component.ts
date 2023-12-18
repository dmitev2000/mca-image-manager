import { Album } from './../../models/Album';
import { NewImage } from './../../models/NewImage';
import { Component, OnInit } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/shared/ErrorStateMatcher';
import { FormControl, Validators } from '@angular/forms';
import { ImageService } from '../../image.service';
import { Router } from '@angular/router';
import { FireNotification } from 'src/app/shared/FireNotification';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss'],
})
export class AddImageComponent implements OnInit {
  constructor(private imgService: ImageService, private router: Router) {}

  ngOnInit(): void {
    this.imgService.getAlbums().subscribe({
      next: (data: Album[]) => {
        this.albums = data;
      },
      error: () => {},
      complete: () => {},
    });
  }

  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

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

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();
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
        error: (error) => {
          //console.log(error);
          FireNotification(error.message, 'error');
        },
        complete: () => {
          FireNotification('Your image has been saved', 'success');
          this.router.navigate(['imagemanager', 'images']);
        },
      });
  }
}
