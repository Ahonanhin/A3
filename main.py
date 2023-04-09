from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import json

# Load the data
with open('static/data/countries.json', 'r') as data_countries:
    countries = json.load(data_countries)


# print(countries["countries"]['country'][0]['countryName'])

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


@app.route('/country_info')
def country_info():
    query = request.args.get('query').lower()
    for country in countries['countries']['country']:
        if query == country['countryName'].lower():
            return jsonify(country)
    return jsonify({"error": "No results found"})

# Run the app    
if __name__ == '__main__':
    app.run(debug=True) 