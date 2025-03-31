from flask import Flask
from flask_restx import Api

app = Flask(__name__)
api = Api(app, title="Healthcare API", description="API for managing healthcare appointments")

if __name__ == "__main__":
    app.run(debug=True)
