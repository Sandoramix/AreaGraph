from flask import Flask, request, make_response
from flask_restful import Api, Resource, reqparse

app = Flask(__name__)
api = Api(app)

names = {
    "sasha": {
        "age": 18
    },
    "rick": {
        "age": 20
    }
}

getparse = reqparse.RequestParser()
getparse.add_argument(
    "name", type=str, help="'name' parameter not found", required=True)


postparse = reqparse.RequestParser()
postparse.add_argument(
    "name", type=str, help="'name' parameter not found/valid", required=True)
postparse.add_argument("age", type=int, help="'age' argument not found/valid", required=True)


class StationData(Resource):
    def get(self):
        args = getparse.parse_args()
        name = args['name']
        if name in names:
            return names[name], 201
        return {
            "message": "No user found",
        }, 404


    def post(self):
        args = postparse.parse_args()
        names[args['name']] = {
            "age":args['age']
        }
        return {
            "message": "User added",
            "newPerson": {
                args['name']:names[args['name']]
            },
        },200




api.add_resource(StationData, "/user")


if __name__ == "__main__":
    app.run(debug=True, port=8080)
