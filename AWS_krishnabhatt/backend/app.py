from flask import Flask, jsonify, request

app = Flask(__name__)

# simple in-memory store (kept simple for the deployment demo)
SUBMISSIONS = []


@app.route("/")
def home():
    return jsonify(message="Flask backend is running", status="ok")


@app.route("/api")
def api():
    return jsonify(
        service="flask-backend",
        message="Hello from the Flask backend!",
        total_submissions=len(SUBMISSIONS),
    )


@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    message = data.get("message", "").strip()
    if not name or not message:
        return jsonify(success=False, error="Name and message are required"), 400
    SUBMISSIONS.append({"name": name, "message": message})
    return jsonify(success=True, saved={"name": name, "message": message},
                   total=len(SUBMISSIONS))


@app.route("/submissions")
def submissions():
    return jsonify(SUBMISSIONS)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
