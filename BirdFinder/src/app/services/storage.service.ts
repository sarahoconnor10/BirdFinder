/**
* Storage Service
* 
* This service provides functionality to upload images to Firebase Storage.
* It handles converting base64 image data, uploading it, and retrieving 
* the public download URL.
*/

import { Injectable } from '@angular/core';
import { Storage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
  * Constructor for StorageService
  * 
  * @param storage Firebase Storage instance for handling file uploads
  */
  constructor(private storage: Storage) { }

  /**
  * Uploads a base64-encoded image to Firebase Storage
  * and retrieves the public download URL
  * 
  * @param base64Data The base64-encoded image data
  * @returns Promise that resolves to the download URL of the uploaded image
  */
  async uploadImage(base64Data: string): Promise<string> {
    try {
      const fileName = `birds/${uuidv4()}.jpg`;
      const imageRef = ref(this.storage, fileName);

      await uploadString(imageRef, base64Data, 'data_url');

      const downloadURL = await getDownloadURL(imageRef);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading image to Firebase:', error);
      throw error;
    }
  }
}
