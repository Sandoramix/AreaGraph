from flask import Flask, abort
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
postparse.add_argument("name", type=str, help="'name' parameter not found/valid", required=True)
postparse.add_argument("age", type=int, help="'age' argument not found/valid", required=True)




class StationData(Resource):
    def get(self):
        args = getparse.parse_args()
        name = args['name']
        self.name_exists(name)
        return names[name], 201



    def post(self):
        args = postparse.parse_args()
        age=int(args['age'])

        if age <0:
            abort(400,"Invalid age input [need to be int8]")
        names[args['name']] = {
            "age":age
        }
        return {
            "message": "User added",
            "newPerson": {
                args['name']:names[args['name']]
            },
        },200

    def name_exists(self,name):
        if name not in names:
            abort(400,f'user `{name}` not found')




api.add_resource(StationData, "/user")


if __name__ == "__main__":
    app.run(debug=True, port=8080)
