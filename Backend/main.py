
from backend import app,api,HomePage

api.add_resource(HomePage, '/')


if __name__ == "__main__":
    app.run()

