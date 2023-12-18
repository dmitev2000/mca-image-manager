import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Image } from 'src/app/imagemanager/models/Image';
import { ImageService } from '../../image.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.scss'],
})
export class ImageDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private imgService: ImageService,
    private router: Router
  ) {}

  image: Image;
  isLoading = true;

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        const { id } = params;
        //console.log(id);
        this.imgService.getPhotoById(id).subscribe({
          next: (data) => {
            this.image = <Image>data;
            this.isLoading = false;
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: () => {},
      complete: () => {},
    });
  }

  deleteImage() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3F51B5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.imgService.deletePhoto(this.image.id).subscribe({
          next: (resp) => {
            console.log(resp);
            Swal.fire({
              title: 'Deleted!',
              text: 'The image has been deleted.',
              icon: 'success',
            });
          },
          error: (error: Error) => {
            //console.log(error);
            Swal.fire({
              title: 'Error!',
              text: error.message,
              icon: 'error',
            });
          },
          complete: () => {
            this.router.navigate(['imagemanager', 'images']);
          },
        });
      }
    });
  }

  editImage() {
    this.router.navigate(['imagemanager', 'edit', this.image.id]);
  }
}
