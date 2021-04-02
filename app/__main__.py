import argparse
from . import live
from . import create_app


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--debug", action="store_true")
    args = parser.parse_args()
    app = create_app()
    live.socketio.run(app, debug=args.debug)
