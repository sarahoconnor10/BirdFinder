import { Injectable } from '@angular/core';
import { Storage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  async uploadImage(base64Data: string): Promise<string> {
    try {
      console.log('Starting image upload to Firebase...');
      const fileName = `birds/${uuidv4()}.jpg`;
      const imageRef = ref(this.storage, fileName);

      await uploadString(imageRef, base64Data, 'data_url');
      console.log('Image uploaded successfully, getting download URL...');

      const downloadURL = await getDownloadURL(imageRef);
      console.log('Got download URL:', downloadURL);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading image to Firebase:', error);
      throw error;
    }
  }
}
