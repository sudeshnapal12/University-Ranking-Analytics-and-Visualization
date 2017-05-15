import json
from bson import json_util
from flask import Flask
from flask import render_template
from pymongo import MongoClient
import pandas

# MONGODB_HOST = 'localhost'
# MONGODB_PORT = 27017
# DBS_NAME = 'timesData_db'
# TIMES_DATA_2011_COLLECTION = 'timesData_2011'
# TIMES_DATA_2012_COLLECTION = 'timesData_2012'
# TIMES_DATA_2013_COLLECTION = 'timesData_2013'
# TIMES_DATA_2014_COLLECTION = 'timesData_2014'
# TIMES_DATA_2015_COLLECTION = 'timesData_2015'
# TIMES_DATA_2016_COLLECTION = 'timesData_2016'
#
# DATA_FIELDS = {'univ_id': True, 'world_rank': True, 'university_name': True, 'country': True, 'teaching':True,
#                'international': True, 'research':True,'citations':True,'income':True,'total_score':True,
#                'num_students':True,'student_staff_ratio':True,'international_students':True,
#                '_id': False}
#
# connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
# data_collection_2011 = connection[DBS_NAME][TIMES_DATA_2011_COLLECTION]
# data_collection_2012 = connection[DBS_NAME][TIMES_DATA_2012_COLLECTION]
# data_collection_2013 = connection[DBS_NAME][TIMES_DATA_2013_COLLECTION]
# data_collection_2014 = connection[DBS_NAME][TIMES_DATA_2014_COLLECTION]
# data_collection_2015 = connection[DBS_NAME][TIMES_DATA_2015_COLLECTION]
# data_collection_2016 = connection[DBS_NAME][TIMES_DATA_2016_COLLECTION]
#
# data_projects_2011 = data_collection_2011.find(projection=DATA_FIELDS)
# data_projects_2012 = data_collection_2012.find(projection=DATA_FIELDS)
# data_projects_2013 = data_collection_2013.find(projection=DATA_FIELDS)
# data_projects_2014 = data_collection_2014.find(projection=DATA_FIELDS)
# data_projects_2015 = data_collection_2015.find(projection=DATA_FIELDS)
# data_projects_2016 = data_collection_2016.find(projection=DATA_FIELDS)

# for project in data_projects:
#     print(project)

app = Flask(__name__)
global g_timesData_2011, g_timesData_2012, g_timesData_2013, g_timesData_2014, g_timesData_2015, g_timesData_2016, g_radar_2011,g_radar_2012,g_radar_2013,g_radar_2014,g_radar_2015,g_radar_2016;

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/timesData_2011")
def timesData_2011():
    return g_timesData_2011.to_csv();

@app.route("/timesData_2012")
def timesData_2012():
    return g_timesData_2012.to_csv();

@app.route("/timesData_2013")
def timesData_2013():
    return g_timesData_2013.to_csv();

@app.route("/timesData_2014")
def timesData_2014():
    return g_timesData_2014.to_csv();

@app.route("/timesData_2015")
def timesData_2015():
    return g_timesData_2015.to_csv();

@app.route("/timesData_2016")
def timesData_2016():
    return g_timesData_2016.to_csv();

@app.route('/<filename>')
def serve_static(filename):
    return app.send_static_file(str(filename))

@app.route("/radar_2011")
def radar_2011():
    return g_radar_2011.to_csv();

@app.route("/radar_2012")
def radar_2012():
    return g_radar_2012.to_csv();

@app.route("/radar_2013")
def radar_2013():
    return g_radar_2013.to_csv();

@app.route("/radar_2014")
def radar_2014():
    return g_radar_2014.to_csv();

@app.route("/radar_2015")
def radar_2015():
    return g_radar_2015.to_csv();

@app.route("/radar_2016")
def radar_2016():
    return g_radar_2016.to_csv();

# @app.route("/timesData_db/timesData_2011")
# def times_data_2011():
#     json_times_data = []
#     for data in data_projects_2011:
#         json_times_data.append(data)
#     json_times_data = json.dumps(json_times_data, default=json_util.default)
#     connection.close()
#     print json_times_data
#     return json_times_data
#
# @app.route("/timesData_db/timesData_2012")
# def times_data_2012():
#     json_times_data = []
#     for data in data_projects_2012:
#         json_times_data.append(data)
#     json_times_data = json.dumps(json_times_data, default=json_util.default)
#     connection.close()
#     return json_times_data
#
# @app.route("/timesData_db/timesData_2013")
# def times_data_2013():
#     json_times_data = []
#     for data in data_projects_2013:
#         json_times_data.append(data)
#     json_times_data = json.dumps(json_times_data, default=json_util.default)
#     connection.close()
#     return json_times_data
#
# @app.route("/timesData_db/timesData_2014")
# def times_data_2014():
#     json_times_data = []
#     for data in data_projects_2014:
#         json_times_data.append(data)
#     json_times_data = json.dumps(json_times_data, default=json_util.default)
#     connection.close()
#     return json_times_data
#
# @app.route("/timesData_db/timesData_2015")
# def times_data_2015():
#     json_times_data = []
#     for data in data_projects_2015:
#         json_times_data.append(data)
#     json_times_data = json.dumps(json_times_data, default=json_util.default)
#     connection.close()
#     return json_times_data
#
# @app.route("/timesData_db/timesData_2016")
# def times_data_2016():
#     json_times_data = []
#     for data in data_projects_2016:
#         json_times_data.append(data)
#     json_times_data = json.dumps(json_times_data, default=json_util.default)
#     connection.close()
#     return json_times_data

if __name__ == "__main__":
    global g_timesData_2011, g_timesData_2012, g_timesData_2013, g_timesData_2014, g_timesData_2015, g_timesData_2016, g_radar_2011,g_radar_2012,g_radar_2013,g_radar_2014,g_radar_2015,g_radar_2016;
    g_timesData_2011 = pandas.read_csv('timesData_2011.csv');
    g_timesData_2012 = pandas.read_csv('timesData_2012.csv');
    g_timesData_2013 = pandas.read_csv('timesData_2013.csv');
    g_timesData_2014 = pandas.read_csv('timesData_2014.csv');
    g_timesData_2015 = pandas.read_csv('timesData_2015.csv');
    g_timesData_2016 = pandas.read_csv('timesData_2016.csv');
    g_radar_2011 = pandas.read_csv('radar_2011.csv');
    g_radar_2012 = pandas.read_csv('radar_2012.csv');
    g_radar_2013 = pandas.read_csv('radar_2013.csv');
    g_radar_2014 = pandas.read_csv('radar_2014.csv');
    g_radar_2015 = pandas.read_csv('radar_2015.csv');
    g_radar_2016 = pandas.read_csv('radar_2016.csv');

    # with open('world-topo.json') as data_file:
    #     g_world_topo = json.load(data_file)
    # print(g_world_topo);

    app.run('localhost', '5050')