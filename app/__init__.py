from flask import Flask, render_template
from . import api
from . import live


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "dev"

    live.socketio.init_app(app)

    @app.route("/")
    def index():
        return render_template("index.html")

    app.register_blueprint(api.bp)

    return app
