import { API_BASE } from "@/config/api";

export class Media {
  api = API_BASE;

  getGalleries() {
    return this.api.get("/download/media");
  }
}
