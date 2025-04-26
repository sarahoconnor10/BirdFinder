import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, camera, imagesOutline, radioButtonOn, flashOutline } from 'ionicons/icons';
import { RouterLinkWithHref } from '@angular/router';
import { CameraService } from 'src/app/services/camera.service';

addIcons({
  "close-outline": closeOutline,
  "camera": camera,
  "images-outline": imagesOutline,
  "radio-button-on": radioButtonOn,
  "flash-outline": flashOutline
})

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButton, IonBackButton, IonIcon, RouterLinkWithHref]
})
export class CameraPage implements OnInit {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;

  constructor(private cameraService: CameraService) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.startCamera();
  }

  ngOnDestroy() {
    this.cameraService.stopCamera();
  }

  startCamera() {
    this.cameraService.startCamera(this.videoElement.nativeElement);
  }

  async captureImage() {
    try {
      const imageData = await this.cameraService.captureImage();
      console.log('Captured Image:', imageData);
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  }


  openGallery() {
    console.log("Gallery opened");

  }

  toggleFlash() {
    console.log("Flash toggled");
  }

}
