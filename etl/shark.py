import os
from pdfminer.high_level import extract_text
moon_phase_list =[]
moon_percent_list = []
case_id_list = []
#define Directory where pdf files are located
directory ="shark"
for filename in os.listdir(directory):
    phase = False
    case = False
    #look for pdf file in difined folder
    if filename.endswith(".pdf"):
        print (filename)
        pdffile = os.path.join(directory, filename)
        #get file
        with open(pdffile,'rb') as f:
            text = extract_text(f)
            text_list = []
            text_list = text.splitlines()

            #loop through each text in list to find keywords
            for moon in text_list:
                #set the details to look for to false
                phase = False
                case_found = False
                #look for case id
                if "CASE:" in moon:
                    splitcase = []
                    splitcase = moon.split(" GSAF ")
                    sharkcase = splitcase[1]
                    case_id_list.append(sharkcase)
                    case_found = True
                #look for moonphase 
                elif "MOON PHASE" in moon:
                    #get moonphase
                    splitmoon = []
                    splitmoon = moon.split(",")
                    moonphase_split = splitmoon[0].split(": ")
                    #get moon visibility percent
                    monnum = splitmoon[1].split(" ")
                    moonpercent = monnum[1]
                    #get moon phase name
                    moonphase = moonphase_split[1]
                    moon_phase_list.append(moonphase)
                    moon_percent_list.append(moonpercent)
                    phase = True
                else:
                    continue
                    
    else:
        continue
    #if file have no moonphase append empty string
    if case == False:
        sharkcase = ""
        case_id_list.append(sharkcase)
    if phase == False:
        moonphase = ""
        moon_phase_list.append(moonphase)
        moonpercent = ""
        moon_percent_list.append(moonpercent)
    text = ""
    print(moon_phase_list)

