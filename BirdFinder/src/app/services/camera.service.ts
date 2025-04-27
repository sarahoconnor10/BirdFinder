/**
* Camera Service
* 
* This service provides functionality to interact with the device's camera
* and photo gallery. It allows starting and stopping the live camera feed,
* capturing images directly from the camera, and selecting images from the gallery.
*/

import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private stream: MediaStream | null = null;

  constructor() { }

  /**
  * Starts the device's camera and streams the video to a given HTMLVideoElement
  * 
  * @param videoElement The HTML video element to display the camera feed
  * @returns Promise that resolves when the camera stream is successfully started
  */
  async startCamera(videoElement: HTMLVideoElement): Promise<void> {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        videoElement.srcObject = this.stream;
      } catch (error) {
        console.error("Error accessing camera: ", error);
        throw error;
      }
    } else {
      console.error("Camera not supported.");
      throw new Error("Camera not supported.");
    }
  }

  /**
  * Stops the active camera stream if running
  */
  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  /**
  * Captures an image directly from the device's camera
  * 
  * @returns Promise that resolves to the captured image as a Data URL string
  */
  async captureImage(): Promise<string> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    if (!image.dataUrl) {
      throw new Error('No image data available');
    }
    return image.dataUrl;
  }

  /**
  * Selects an image from the device's photo gallery
  * 
  * @returns Promise that resolves to the selected image as a Data URL string
  */
  async pickFromGallery(): Promise<string> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });

    if (!image.dataUrl) {
      throw new Error('No image data available');
    }
    return image.dataUrl;
  }
}
