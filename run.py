import http.server

print('Server running at http://localhost:8080/')
server = http.server.HTTPServer(('localhost', 8080), http.server.SimpleHTTPRequestHandler)
try:
    server.serve_forever()
except KeyboardInterrupt:
    server.shutdown()
    server.server_close()
    print('\nServer stopped.')