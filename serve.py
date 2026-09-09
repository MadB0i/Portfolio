import http.server, os, socketserver

PORT = int(os.environ.get("PORT", 3000))
# Serve the production build when present, else the dev root.
DIRECTORY = "dist" if os.path.isdir("dist") else "."


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)


with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving {DIRECTORY} on http://localhost:{PORT}")
    httpd.serve_forever()
