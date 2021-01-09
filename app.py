from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

# import sqlalchemy
from flask_sqlalchemy import SQLAlchemy as sqlalchemy
from config import username, password
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, MetaData, Table


engine = create_engine(f'postgresql://{username}:{password}@35.201.10.242:5432/postgres')

Base = automap_base()
Base.prepare(engine, reflect=True)

Pdf = Base.classes.pdf_scrape
Attacks = Base.classes.shark_attacks



# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api")
def api():
    session = Session(engine)

    results = session.query(Attacks.case_number, Pdf.moonphase, Attacks.year, Attacks.country, Attacks.type, Attacks.species, Attacks.fatal, Attacks.sex).\
    filter(Pdf.case_number == Attacks.case_number).all()

    case_number = [result[0] for result in results]
    moonphase = [result[1] for result in results]
    year = [result[2] for result in results]
    country = [result[3] for result in results]
    attack_type = [result[4] for result in results]
    species = [result[5] for result in results]
    fatal = [result[6] for result in results]
    sex = [result[7] for result in results]

    attack_data = [{
        "case_number": case_number,
        "year": year,
        "country": country,
        "type": attack_type,
        "species": species,
        "fatal": fatal,
        "sex": sex,   
        "moonphase": moonphase
    }]

    return jsonify(attack_data)


if __name__ == "__main__":
    app.run(debug=True)
