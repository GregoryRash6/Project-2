# Import Dependencies
import os
import pandas as pd
import numpy as np
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from config import password

# Create Instance of Flask App
app = Flask(__name__)

# Create Connection Engine
engine = create_engine(f"postgresql://postgres:{password}@localhost:5432/spotify_db")

# Automap Base
Base = automap_base()

# Reflect Tables
Base.prepare(engine, reflect=True)

# Save References to Table
Spotify = Base.classes.spotify

# Create Session
session = Session(engine)


# Create Home Route
@app.route("/")
# Define Index Function
def index():
    """Returns Homepage"""

    # Render Template
    return render_template("index.html")


# Create Dates Route
@app.route("/dates")

# Define Dates Function
def dates():
    """Returns List of Dates for Dropdown"""

    # Selection Information
    sel = [
        Spotify.date
    ]

    # Perform SQL Query
    spotify_date = session.query(*sel)\
    .order_by(Spotify.date.asc())\
    .distinct()\
    .all()
    

    # Return Jsonified List
    return jsonify(list(spotify_date))


# Create Data Route
@app.route("/data/<date>")

# Define Data Function
def data(date):
    """Returns Callable Data"""
    
    # Selection Information
    sel = [
        Spotify.position,
        Spotify.track_name,
        Spotify.artist,
        Spotify.streams,
        Spotify.region,
    ]

    # Perform SQL Query
    spotify_data = session.query(*sel)\
    .filter(Spotify.date == date)\
    .filter(Spotify.region == "us")\
    .filter(Spotify.position == 1)\
    .all()

    # Create a Dictionary Entry for each Row
    data_dict = {}
    for datum in spotify_data:
        data_dict["position"] = datum[0]
        data_dict["track_name"] = datum[1]
        data_dict["artist"] = datum[2]
        data_dict["streams"] = datum[3]
        data_dict["region"] = datum[4]

    # Returns Jsonified Dictionary
    return jsonify(data_dict)


# Create Streams Route
@app.route("/bar/<track>/<date>")

# Define Streams Function
def streams(date, track):
    """Returns Data Needed for Bar Chart"""
    
    # Selection Information
    sel = [
        Spotify.streams, 
        Spotify.region
    ]

    # Perform SQL Query
    spotify_streams = session.query(*sel)\
    .filter(Spotify.track_name == track)\
    .filter(Spotify.date == date)\
    .order_by(Spotify.date.asc())\
    .all()

    # Returns Jsonified List
    return jsonify(list(spotify_streams))


# Create Gauge Route
@app.route("/gauge/<track>")

# Define Gauge Function
def gauge(track):
    """Returns Data Needed for Gauge Chart"""
    
    # Selection Information
    sel = [
        Spotify.track_name,
        Spotify.date,
        Spotify.position,
        Spotify.artist,
        Spotify.streams
    ]

    # Perform SQL Query
    line_info = session.query(*sel)\
    .filter(Spotify.region == "us")\
    .filter(Spotify.position == 1)\
    .filter(Spotify.track_name == track)\
    .order_by(Spotify.date.asc())\
    .all()

    # Return Jsonified List
    return jsonify(list(line_info))


# Create Yearly Streams Route
@app.route("/line/<track>")

# Define Yearly Streams Function
def yearlyStreams(track):
    """Returns Data Needed for Line Graph"""
    
    # Selection Information
    sel = [
        Spotify.track_name,
        Spotify.date,
        Spotify.position,
        Spotify.artist,
        Spotify.streams
    ]

    # Perform SQL Query
    line_info = session.query(*sel)\
    .filter(Spotify.region == "us")\
    .filter(Spotify.track_name == track)\
    .order_by(Spotify.date.asc())\
    .all()

    # Return Jsonified List
    return jsonify(list(line_info))


if __name__ == "__main__":
    app.run(debug=True)