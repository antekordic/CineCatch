import {Inject, Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {DOCUMENT} from "@angular/common";
import {STORAGE_KEY_PREFIX} from "../tokens/storage-key-prefix.token";

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService extends StorageService {
  public constructor(
    @Inject(DOCUMENT) document: Document,
    @Inject(STORAGE_KEY_PREFIX) prefix: string
  ) {
    // Default view can't be null since this app always runs in browser mode.
    super(document.defaultView!.localStorage, prefix);
  }
}
