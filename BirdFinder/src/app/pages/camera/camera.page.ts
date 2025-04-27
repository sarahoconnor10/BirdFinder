/**
* Camera Page Component
* 
* This page provides bird identification functionality through two methods:
* 1. Taking a photo with the device camera
* 2. Selecting an image from the device gallery
* 
* The captured image is analyzed using AI to identify the bird species
* and then the user is directed to the results page.
*/

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { RouterLinkWithHref } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, camera, imagesOutline, radioButtonOn, flashOutline, ellipseOutline } from 'ionicons/icons';
import { CameraService } from 'src/app/services/camera.service';
import { BirdIdentificationService } from 'src/app/services/bird-identification.service';

addIcons({
  "close-outline": closeOutline,
  "camera": camera,
  "images-outline": imagesOutline,
  "radio-button-on": radioButtonOn,
  "flash-outline": flashOutline,
  "ellipse-outline": ellipseOutline
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

  /**
  * Constructor for CameraPage
  * 
  * @param cameraService Service to access device camera capabilities
  * @param loadingController Ionic loading controller for loading indicators
  * @param birdIdentificationService Service for bird species identification
  * @param router Angular Router for navigation
  */
  constructor(
    private cameraService: CameraService,
    private loadingController: LoadingController,
    private birdIdentificationService: BirdIdentificationService,
    private router: Router
  ) { }

  ngOnInit() { }

  /**
  * Angular lifecycle hook that runs after the view has been initialized
  * Starts the camera once the video element is available 
  */
  ngAfterViewInit() {
    this.startCamera();
  }

  /**
  * Angular lifecycle hook that runs when component is about to be destroyed
  * Ensures camera resources are properly released
  */
  ngOnDestroy() {
    this.cameraService.stopCamera();
  }

  /**
  * Initializes the device camera and connects it to the video element
  */
  startCamera() {
    this.cameraService.startCamera(this.videoElement.nativeElement);
  }

  /**
  * Captures an image from the camera and processes it for bird identification
  */
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

  /**
    * Opens the device gallery to select an image for bird identification
    */
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

  /**
  * Toggles the camera flash (placeholder for future implementation)
  */
  toggleFlash() {
    console.log("Flash toggled");
  }

  /**
  * Navigates to the result page with bird identification information
  * 
  * @param birdInfo The identified bird information from the AI service
  * @param capturedImage The image data that was processed
  */
  goToResult(birdInfo: any, capturedImage: string) {
    this.router.navigate(['/result'], {
      state: {
        birdInfo,
        capturedImage
      }
    });
  }

}
