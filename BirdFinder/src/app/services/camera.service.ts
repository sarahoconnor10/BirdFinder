import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private stream: MediaStream | null = null;

  constructor() { }

  async startCamera(videoElement: HTMLVideoElement): Promise<void> {
    /**
     * Starts camera and connects stream to passed in video element
     */
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

  stopCamera(): void {
    /**
     * Stops stream
     */
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

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

}
