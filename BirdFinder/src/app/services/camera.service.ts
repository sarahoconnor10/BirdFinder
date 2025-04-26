import { Injectable } from '@angular/core';

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

  async captureImage(videoElement: HTMLVideoElement): Promise<string> {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas context not available');
    }

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg');
    return imageData;
  }

}
