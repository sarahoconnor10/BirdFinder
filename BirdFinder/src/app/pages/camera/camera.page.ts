import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, camera, imagesOutline, radioButtonOn, flashOutline } from 'ionicons/icons';
import { RouterLinkWithHref } from '@angular/router';
import { CameraService } from 'src/app/services/camera.service';
import { LoadingController } from '@ionic/angular';
import { BirdIdentificationService } from 'src/app/services/bird-identification.service';
import { Router } from '@angular/router';

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

  constructor(private cameraService: CameraService,
    private loadingController: LoadingController,
    private birdIdentificationService: BirdIdentificationService,
    private router: Router
  ) { }

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

      if (!imageData) {
        console.warn('No image captured.');
        return;
      }

      const loading = await this.loadingController.create({
        message: 'Identifying bird...',
        spinner: 'crescent',
        backdropDismiss: false
      });
      await loading.present();

      const birdName = await this.birdIdentificationService.identifyBird(imageData);

      await loading.dismiss();

      this.goToResult(birdName, imageData);

    } catch (error) {
      console.error('Error capturing or identifying image:', error);
    }
  }


  async openGallery() {
    try {
      const imageData = await this.cameraService.pickFromGallery();

      if (!imageData) {
        console.warn('No image selected.');
        return;
      }

      const loading = await this.loadingController.create({
        message: 'Identifying bird...',
        spinner: 'crescent',
        backdropDismiss: false
      });
      await loading.present();

      const birdName = await this.birdIdentificationService.identifyBird(imageData);

      await loading.dismiss();

      this.goToResult(birdName, imageData);

    } catch (error) {
      console.error('Error selecting or identifying image:', error);
    }
  }


  toggleFlash() {
    console.log("Flash toggled");
  }

  goToResult(birdName: string, capturedImage: string) {
    this.router.navigate(['/result'], {
      state: {
        birdName,
        capturedImage
      }
    });
  }

}
