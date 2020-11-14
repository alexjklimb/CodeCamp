from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
from usersDB import usersDB
from passlib.hash import bcrypt
import json

db = usersDB()

class MyHTTPRequestHandler(BaseHTTPRequestHandler):

    def handleNotAuthenticated(self):
        self.send_response(401)
        self.endheaders()
        self.wfile.write(bytes("Not Authenticated", "utf-8"))

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
        user_name = parsed_body['username'][0]
        user_password = bcrypt.hash(parsed_body['password'][0])
        db.insertUser(user_name, user_password) 

        # send a response to the client
        self.send_response(201)
        self.end_headers()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        BaseHTTPRequestHandler.end_headers(self)

    def handleCreateSession(self):
        length = self.headers["Content-Length"]
        body = self.rfile.read(int(length)).decode("utf-8")
        parsed_body = parse_qs(body)

        input_username = parsed_body['userName'][0]
        input_password = parsed_body['Password'][0]

        user = db.usernameExists(input_username)
        print(user)
        if user != None:
            if bcrypt.verify(input_password, user["password"]):
                # self.sessionData["userId"] = user["id"]
                self.send_response(201, user["username"])
                self.end_headers()
            else:
                self.handleNotAuthenticated
    
        else:
            self.handleNotAuthenticated



    def do_POST(self):

        if self.path == "/users":
            self.handleCreateUser()

        if self.path == "/sessions":
            self.handleCreateSession()

        



def run():
    listen = ("127.0.0.1", 8080)
    server = HTTPServer(listen, MyHTTPRequestHandler)

    print("Server is ready! Listening...")
    server.serve_forever()
    #Nothing past this will be exectuted

run()