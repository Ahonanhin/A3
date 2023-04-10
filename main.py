from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
import json
import random
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import re
import datetime
from datetime import datetime
from sqlalchemy import desc, asc, func



# Create the Flask app
app = Flask(__name__)

app.secret_key = 'secret key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'


db = SQLAlchemy(app)



def is_valid_input(username, email, password):
    # Username: no special characters, no profanity
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False, "Username must only contain letters, numbers, and underscores."

    # Add a list of profanities to check against the username
    profanities = ['badword1', 'badword2', 'badword3']
    if any(profanity in username.lower() for profanity in profanities):
        return False, "Username must not contain profanity."

    # Email: must have a @ and a .
    if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
        return False, "Email must be a valid format."

    # Password: at least 8 characters, at least 1 number
    if not re.match(r'^(?=.*\d).{8,}$', password):
        return False, "Password must be at least 8 characters long and contain at least 1 number."

    return True, "Valid input"


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

# db.create_all()

# Load the data
with open('static/data/countries.json', 'r',encoding='utf-8') as data_countries:
    data = json.load(data_countries)


# print(countries["countries"]['country'][0]['countryName'])


#User Authentication
@app.route('/register', methods=['POST'])
def register():
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']

    is_valid, message = is_valid_input(username, email, password)
    if not is_valid:
        return jsonify({"error": message}), 400

    data = request.get_json()
    if User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Username or email already exists"}), 400

    new_user = User(username=data['username'], email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    session['user_id'] = new_user.id

    return jsonify({"message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['username']).first()

    if user and user.check_password(data['password']):
        session['user_id'] = user.id
        return jsonify({"message": "Logged in successfully"}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/user_info', methods=['GET'])
def user_info():
    user = User.query.get(session.get('user_id'))
    if user:
        return jsonify({"username": user.username, "email": user.email})
    else:
        return jsonify({"error": "User not found"}), 404

@app.route('/delete_user', methods=['POST'])
def delete_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in."}), 400

    # Assuming you have a User model defined
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        session.pop('user_id', None)
        return jsonify({"success": "User deleted successfully."})
    else:
        return jsonify({"error": "User not found."}), 404

@app.route('/check_login', methods=['GET'])
def check_login():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        return jsonify({"is_logged_in": True, "username": user.username, "email": user.email})
    else:
        return jsonify({"is_logged_in": False})
    
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


#quiz handler
class QuizResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_taken = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    score = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)

    user = db.relationship('User', backref=db.backref('quiz_results', lazy=True))


@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not logged in"}), 401

    quiz_data = request.json
    date_taken = datetime.utcnow()  # Update this line
    score = quiz_data['score']
    total_questions = quiz_data['total_questions']

    # Save the quiz results to the database
    quiz_result = QuizResult(user_id=user_id, date_taken=date_taken, score=score, total_questions=total_questions)
    db.session.add(quiz_result)
    db.session.commit()

    return jsonify({"success": True})


@app.route('/past_quizzes')
def past_quizzes():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in."}), 400

    sort_by = request.args.get('sort_by', 'date_taken')
    sort_order = request.args.get('sort_order', 'asc')
    score_filter = request.args.get('score_filter', None, type=int)
    date_filter = request.args.get('date_filter', None, type=str)

    order_by = {
        'asc': asc,
        'desc': desc
    }

    query = QuizResult.query.filter_by(user_id=user_id)

    if score_filter is not None:
        query = query.filter(QuizResult.score == score_filter)

    if date_filter is not None:
        query = query.filter(func.DATE(QuizResult.date_taken) == date_filter)

    query = query.order_by(order_by[sort_order](getattr(QuizResult, sort_by)))

    past_quizzes = query.all()
    return jsonify([{
        'id': quiz.id,
        'date_taken': quiz.date_taken.strftime('%Y-%m-%d'),
        'score': quiz.score,
        'total_questions': quiz.total_questions
    } for quiz in past_quizzes])

# Run the app    
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)