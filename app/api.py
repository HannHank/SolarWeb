from flask import Blueprint, jsonify
from .live import socketio
from flask_socketio import emit
from flask import request
bp = Blueprint(__name__, "api", url_prefix="/api")

global laptop 
laptop = {}
@bp.route("/data", methods=["GET"])
def data():
    Name = request.args.get('Name')
    State = request.args.get('state')
    print(Name)
    laptop.update( {Name : State} )
    

    socketio.emit("stateMessage", { "name": Name,"state": State}, broadcast=True)
    return "OK"

@bp.route("/Remove", methods=["GET"])
def Remove():
    Name = request.args.get('Name')
    print(Name)
   
    

    socketio.emit("Remove", { "name": Name}, broadcast=True)
    return "OK"
