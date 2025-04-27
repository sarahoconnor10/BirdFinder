import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { RouterLinkWithHref } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, camera, imagesOutline, radioButtonOn, flashOutline } from 'ionicons/icons';
import { CameraService } from 'src/app/services/camera.service';
import { BirdIdentificationService } from 'src/app/services/bird-identification.service';


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
  imports: [IonicModule, CommonModule, FormsModule, RouterLinkWithHref]
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

      const birdInfo = await this.birdIdentificationService.identifyBird(imageData);

      await loading.dismiss();

      this.goToResult(birdInfo, imageData);

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

      const birdInfo = await this.birdIdentificationService.identifyBird(imageData);

      await loading.dismiss();

      this.goToResult(birdInfo, imageData);

    } catch (error) {
      console.error('Error selecting or identifying image:', error);
    }
  }


  toggleFlash() {
    console.log("Flash toggled");
  }

  goToResult(birdInfo: any, capturedImage: string) {
    this.router.navigate(['/result'], {
      state: {
        birdInfo,
        capturedImage
      }
    });
  }

}
