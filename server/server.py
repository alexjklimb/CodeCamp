from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
from planetsDB import planetsDB
from passlib.hash import bcrypt
import json

db = planetsDB()

class MyHTTPRequestHandler(BaseHTTPRequestHandler):

    def handleCreateUser(self):
        print("the HEADERS are:", self.headers)

        #1. read the request body
        length = self.headers["Content-Length"]
        body = self.rfile.read(int(length)).decode("utf-8")
        print("the BODY:", body)

        # #2. parse the body into usable data
        parsed_body = parse_qs(body)
        print("parsed BODY:", parsed_body)

        # #3. append the new data to our data
        user_firstName = parsed_body['firstName'][0]
        user_lastName = parsed_body['lastName'][0]
        user_email = parsed_body['email'][0]
        user_password = bcrypt.hash(parsed_body['password'][0])
        db.insertUser(user_firstName, user_lastName, user_email, user_password)

        # #send a response to the client
        self.send_response(201)
        self.end_headers()


    def do_POST(self):

        if self.path == "/users":
            self.handleCreateUser





def run():
    listen = ("127.0.0.1", 8080)
    server = HTTPServer(listen, MyHTTPRequestHandler)

    print("Server is ready! Listening...")
    server.serve_forever()
    #Nothing past this will be exectuted

run()