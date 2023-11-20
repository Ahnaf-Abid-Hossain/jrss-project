from flask import Flask,abort,render_template,request,redirect,url_for
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER 

@app.route('/')
def hello_world():
    return render_template("index.html")

@app.route('/success', methods = ['POST'])   
def success():   
    if request.method == 'POST':   
        f = request.files['file'] 
        f.save(f.filename)   
        return render_template("success.html", name = f.filename)   

def hello(name = None):
    return render_template('hello.html',name=name)
    
# @app.route('/upload', methods=['POST'])
# def upload():
#   if not _upload_dir:
#     raise ValueError('Uploads are disabled.')

#   uploaded_file = flask.request.files['file']
#   print uploaded_file
#   media.add_for_upload(uploaded_file, _upload_dir)
#   return flask.redirect(flask.url_for('_main'))


@app.route('/upload', methods=['POST']) 
def upload(): 
    if request.method == 'POST': 
  
        # Get the list of files from webpage 
        files = request.files.getlist("file") 
        uploaded_file_names = []
        # Iterate for each file in the files List, and Save them 
        for file in files: 
            file.save(file.filename) 
            uploaded_file_names.append(file.filename)
            
        response_html = "<h1>Files Uploaded Successfully!</h1><ul>"

        for file_name in uploaded_file_names:
            response_html += f"<li>{file_name}</li>"

        response_html += "</ul>"

        return response_html
  
  


if __name__ == '__main__':
    app.run()
    
    
    
