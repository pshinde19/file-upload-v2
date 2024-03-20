import os
import time
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# Set the upload folder
UPLOAD_FOLDER = 'media'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('upload.html')

@app.route('/upload', methods=['POST','GET'])
def upload():
        folder_path = 'PDF'
        try :
            if request.method == 'POST':
                print(request.files)
                files = request.files.getlist('files')
                print('files',files)
                for file in files:
                    file_path=os.path.join(folder_path,file.filename)
                    print(file_path)        
                    file.save(file_path)
                return jsonify(status='success') 
        except Exception as e:
                   return jsonify(status='error')

@app.route('/additionalupload', methods=['POST','GET'])
def upload2():
        try :
            folder_path = 'Additional'
            if request.method == 'POST':
                print(request.files)
                files = request.files.getlist('files')
                key=request.form['name']
                filename=request.form['name']+'.xlsx'
                print(filename)
                key={}
                for file in files:
                    file_path=os.path.join(folder_path,filename)
                    file.save(file_path)
                    key["time"]=time.ctime(os.path.getmtime(folder_path+'/'+filename))
                    key["folder_path"]=f"{folder_path}/{filename}"
                    key["id"]=filename
                    return jsonify(status='success',masterdata=key)
        except Exception as e:
                   return jsonify(status='error')     

@app.route('/getfilenames', methods=['POST','GET'])
def getfilenames():
    folder_path = 'Additional'  
    if not os.path.exists(folder_path):
        return 'Folder does not exist', 404
    filenames = os.listdir(folder_path)
    print(filenames)
    masterdata={
         "c4mbdata.xlsx":{},
         "Revenuereport.xlsx":{}
    }
    fnames=["c4mbdata.xlsx","Revenuereport.xlsx"]   
    if(len(filenames)>0):
        for i in filenames:
         if i in fnames:
              masterdata[i]["time"]=time.ctime(os.path.getmtime(folder_path+'/'+i))
              masterdata[i]["folder_path"]=f"{folder_path}/{i}"
    else:
      masterdata={}    
    return jsonify(masterdata)

if __name__ == '__main__':
    app.run(debug=True)
