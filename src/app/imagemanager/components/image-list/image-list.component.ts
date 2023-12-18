import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../image.service';
import { Image } from 'src/app/imagemanager/models/Image';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
})
export class ImageListComponent implements OnInit {
  constructor(private imageService: ImageService, private router: Router) {}

  fetchedImages: Image[] = [];
  imagesToShow: Image[] = [];
  isLoading = true;

  // * Pagination options
  imagesPerPage = 12;
  pageSizeOptions = [12, 25, 50];
  currentPage = 0;

  // ! error handler
  hasError: boolean = false;
  errorStatus: number | undefined;
  errorMessage: string | undefined;

  ngOnInit(): void {
    this.imageService.getPhotos().subscribe({
      next: (data: Image[]) => {
        this.fetchedImages = data;
        this.imagesToShow = data.slice(0, this.imagesPerPage);
        //console.log(this.fetchedImages);
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.hasError = true;
        this.errorStatus = error.status;
        this.errorMessage = 'Something went wrong...';
        this.isLoading = false;
      },
      complete: () => {
        //console.log('Completed');
      },
    });
  }

  handleClick(id: number) {
    this.router.navigate(['imagemanager', 'details', id]);
  }

  handlePageEvent(event: PageEvent) {
    const from = event.pageIndex * event.pageSize;
    const to = (event.pageIndex + 1) * event.pageSize;
    this.imagesToShow = this.fetchedImages.slice(from, to);
    this.currentPage = event.pageIndex;
    this.imagesPerPage = event.pageSize;
  }
}
