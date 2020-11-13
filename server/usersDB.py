import sqlite3

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

class usersDB:


    def __init__(self):
        #initialize the class instance
        self.connection = sqlite3.connect("users.db")
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()
    
    def insertUser(self, username, password):
        data = [username, password]
        self.cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", data)
        self.connection.commit()

    def emailExists(self, username):
        data = [username]
        self.cursor.execute("SELECT * FROM users WHERE username = ?", data)
        email = self.cursor.fetchone()
        return email