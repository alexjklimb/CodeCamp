from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
from planetsDB import planetsDB
from passlib.hash import bcrypt
import json

db = planetsDB()

class MyHTTPRequestHandler(BaseHTTPRequestHandler):

    