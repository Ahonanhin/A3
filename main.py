from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
import json
import random
from datetime import datetime
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user


#intitialize SQL database
# db = SQLAlchemy(app)


# Load the data
with open('static/data/countries.json', 'r',encoding='utf-8') as data_countries:
    data = json.load(data_countries)


# print(countries["countries"]['country'][0]['countryName'])

# Create the Flask app
app = Flask(__name__)

app.secret_key = 'secret key'

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

@app.route('/quizz')
def quizz():
    return render_template("quizz.html")

@app.route('/country_info')
def country_info():
    query = request.args.get('query').lower()
    for country in data['countries']['country']:
        if query == country['countryName'].lower():
            return jsonify(country)
    return jsonify({"error": "No results found"})


@app.route('/quiz', methods=['GET', 'POST'])
def quiz():
    if request.method == 'POST':
        selected_continent = request.json['selectedContinent']
        questions = generate_questions(selected_continent)
        session['questions'] = questions
        return jsonify(questions)
    return render_template('quizz.html')


def generate_questions(continent):
    countries = [country for country in data['countries']['country'] if country['continentName'] == continent]
    random_countries = random.sample(countries, 10)
    questions = []
    for country in random_countries:
        question_type = random.choice(['capital', 'currencyCode'])
        if question_type == 'capital':
            question = f"What is the capital of {country['countryName']}?"
            correct_answer = country['capital']
        else:
            question = f"What is the currency of {country['countryName']}?"
            correct_answer = country['currencyCode']
        incorrect_answers = random.sample([c[question_type] for c in countries if c != country], 3)
        options = incorrect_answers + [correct_answer]
        random.shuffle(options)
        questions.append({'question': question, 'options': options, 'correctAnswer': correct_answer})
    return questions


# Run the app    
if __name__ == '__main__':
    app.run(debug=True) 