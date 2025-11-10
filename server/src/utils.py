from urllib.parse import urljoin


class Util:
    static_path = "static"

    def get_download_path(self, request):
        host = f"{request.url.scheme}://{request.url.netloc}"
        full_host = urljoin(host, self.static_path)

        return full_host
