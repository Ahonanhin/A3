from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy


# Create the Flask app
app = Flask(__name__)

#set SQL Alchemy Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

# Configure the app
#Flask-server Routes

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/learn')
def learn():
    return render_template("learn.html")

@app.route('/play')
def play():
    return render_template("play.html")

@app.route('/user')
def user():
    return render_template("login.html")

@app.route('/video')
def video():
    return render_template("home.html")

# Run the app    
if __name__ == '__main__':
    app.run(debug=True) 