import { Injectable } from '@angular/core';
import { getStorage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = getStorage();

  constructor() { }

  async uploadImage(base64Data: string): Promise<string> {
    const fileName = `birds/${uuidv4()}.jpg`;
    const imageRef = ref(this.storage, fileName);

    await uploadString(imageRef, base64Data, 'data_url');

    const downloadURL = await getDownloadURL(imageRef);

    return downloadURL;
  }
}
