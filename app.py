from flask import Flask, jsonify, request, render_template
import mysql.connector
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()

# Connect to MySQL
def get_db_connection():
    connection = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)
    return connection


# Home route
@app.route("/")
def home():
    return render_template("index.html")


# Get all locations
@app.route("/locations", methods=["GET"])
def get_locations():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM locations ORDER BY name")
    locations = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(locations)


# Get routes between two locations
@app.route("/routes", methods=["GET"])
def get_routes():

    source_id = request.args.get("from")
    destination_id = request.args.get("to")

    if not source_id or not destination_id:
        return jsonify({
            "error": "Both source and destination are required."
        }), 400

    if source_id == destination_id:
        return jsonify({
            "error": "Source and destination cannot be the same."
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            r.id,
            s.name AS source,
            d.name AS destination,
            r.transport_mode,
            r.fare,
            r.estimated_time
        FROM routes r
        JOIN locations s ON r.source_id = s.id
        JOIN locations d ON r.destination_id = d.id
        WHERE (r.source_id = %s AND r.destination_id = %s)
           OR (r.source_id = %s AND r.destination_id = %s)
        ORDER BY r.fare ASC
    """

    cursor.execute(
        query,
        (source_id, destination_id, destination_id, source_id)
    )

    routes = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(routes)


if __name__ == "__main__":
    app.run(debug=True)
