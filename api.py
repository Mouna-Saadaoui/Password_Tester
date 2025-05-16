from flask import Flask, request, jsonify
from flask_cors import CORS

# Import functions directly
from rule_engine import evaluate_password
from feedback_generator import generate_feedback, generate_strong_password
from hashing import store_password_result

app = Flask(__name__)
CORS(app)

@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.json
    password = data.get('password')

    if not password:
        return jsonify({"error": "Password is required"}), 400

    evaluation = evaluate_password(password)
    feedback = generate_feedback(evaluation)

    strength = feedback["strength"]
    suggestion = ""
    suggestion_shown = False

    if strength in ["Very Weak", "Weak", "Moderate"]:
        suggestion = generate_strong_password()
        suggestion_shown = True
    elif strength in ["Strong", "Very Strong"]:
        if data.get("want_suggestion", False):  # optional flag from frontend
            suggestion = generate_strong_password()
            suggestion_shown = True

    evaluation["suggestion_shown"] = suggestion_shown
    store_password_result(evaluation)

    return jsonify({
        "evaluation": evaluation,
        "feedback": feedback,
        "suggestion": suggestion if suggestion_shown else None
    })

if __name__ == '__main__':
    app.run(debug=True)
