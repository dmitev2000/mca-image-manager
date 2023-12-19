import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MaterialModule } from '../shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ImagemanagerAppComponent } from './imagemanager-app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { WeclomeComponent } from './components/welcome/welcome.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ImageListComponent } from './components/image-list/image-list.component';
import { AddImageComponent } from './components/add-image/add-image.component';
import { EditImageComponent } from './components/edit-image/edit-image.component';
import { ImageDetailsComponent } from './components/image-details/image-details.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './components/loading/loading.component';
import { DisplayErrorComponent } from './components/display-error/display-error.component';
import { StatusComponent } from './components/status/status.component';

const prefix = 'Image Manager - ';

const routes: Routes = [
  {
    path: '',
    component: ImagemanagerAppComponent,
    children: [
      {
        path: 'welcome',
        component: WeclomeComponent,
        title: `${prefix}Welcome`,
      },
      {
        path: 'images',
        component: ImageListComponent,
        title: `${prefix}Browse Images`,
      },
      {
        path: 'details/:id',
        component: ImageDetailsComponent,
        title: `${prefix}Image Details`,
      },
      {
        path: 'add',
        component: AddImageComponent,
        title: `${prefix}Add image`,
      },
      {
        path: 'edit/:id',
        component: EditImageComponent,
        title: `${prefix}Edit Image`,
      },
      { path: '**', redirectTo: 'welcome' },
    ],
  },
];

@NgModule({
  declarations: [
    ImagemanagerAppComponent,
    ToolbarComponent,
    WeclomeComponent,
    SidenavComponent,
    ImageListComponent,
    AddImageComponent,
    ImageDetailsComponent,
    EditImageComponent,
    LoadingComponent,
    DisplayErrorComponent,
    StatusComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    HttpClientModule,
  ],
})
export class ImagemanagerModule {}
