ngOnInit(): void {
    this.imgService.getAlbums().subscribe({
      next: (data: Album[]) => {
        this.albums = data;
      },
      error: (error) => {
        console.log(error);
        // TODO: Create a UI to provide info about the errors to the client.
        this.isLoading = false;
        this.error = '...';
      },
      complete: () => {
        this.route.params.subscribe({
          next: (params) => {
            const { id } = params;
            this.imgService.getPhotoById(id).subscribe({
              next: (data: Image) => {
                this.image = data;
                console.log(data);
              },
              error: (error) => {
                console.log(error);
              },
              complete: () => {
                this.idFormControl.setValue(this.image.id.toString());
                this.titleFormControl.setValue(this.image.title);
                this.urlFormControl.setValue(this.image.url);
                this.thumbUrlFormControl.setValue(this.image.thumbnailUrl);
                this.albumFormControl.setValue(this.image.albumId);
                this.isLoading = false;
              },
            });
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
    });
  }

