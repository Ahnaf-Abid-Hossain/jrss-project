from flask import Flask, request, jsonify
import os
from flask_cors import CORS  # Import CORS
import re
from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import nsdecls
from docx.oxml import parse_xml
from docx.shared import Inches
from PIL import Image
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import io


app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def modify_docx(file_path):
    # Load the document
    doc = Document(file_path)

    # Move header and footer content to the top of the body
    for section in doc.sections:
        header = section.header
        footer = section.footer
        header.is_linked_to_previous = True
        section.different_first_page_header_footer = False

        # move everything from header and footer to body
        # doc.paragraphs[0].insert_paragraph_before("--------------------------------\n")     
        # for paragraph in header.paragraphs:
        #     doc.paragraphs[0].insert_paragraph_before(paragraph.text)
        # doc.paragraphs[0].insert_paragraph_before("Header:")

        # doc.paragraphs[0].insert_paragraph_before("--------------------------------\n")
        # for paragraph in footer.paragraphs:
        #     doc.paragraphs[0].insert_paragraph_before(paragraph.text)
        # doc.paragraphs[0].insert_paragraph_before("Footer:")

        # Clear header and footer
        for paragraph in header.paragraphs:
            paragraph.clear()
        for paragraph in footer.paragraphs:
            paragraph.clear()
        print(len(header.paragraphs))
        print(len(footer.paragraphs))



        # Clear the existing content of the header
        # for paragraph in header.paragraphs:
        #     for run in paragraph.runs:
        #         run.clear()
        header_paragraph = header.paragraphs[0]
        header_paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
        header_paragraph.paragraph_format.left_indent = Inches(0)
        header_paragraph.paragraph_format.right_indent = Inches(0)

        header_paragraph.paragraph_format.space_before = Inches(0)
        header_paragraph.paragraph_format.space_after = Inches(0)   
        


        htable = header.add_table(1, 2, width=Inches(7))
        for row in htable.rows:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    paragraph.paragraph_format.left_indent = Inches(0)



        # # Set individual column widths
        htable.columns[0].width = Inches(1)
        htable.columns[1].width = Inches(4.5)

        # Left cell (Logo)
        ht_left = htable.cell(0, 0).paragraphs[0]
        ht_left.alignment = WD_ALIGN_PARAGRAPH.LEFT
        logo_run = ht_left.add_run()
        logo_run.add_picture("JRSS1.png", width=Inches(1))

        # Right cell (Slogan)
        ht_right = htable.cell(0, 1).paragraphs[0]
        # ht_right.alignment =  WD_ALIGN_PARAGRAPH.RIGHT
        ht_right.alignment = WD_ALIGN_PARAGRAPH.LEFT
        slogan_run = ht_right.add_run()
        slogan_run.add_picture("JRSS_FBanner.png", width=Inches(4.5))
        # header.add_paragraph().add_run().add_picture(image_path, width=Inches(2))

    # Regex patterns for phone numbers and emails
    phone_pattern = r'^\s*(?:\+?(\d{1,3}))?[-. ()]*(\d{3})[-. )(]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$'  # Adjust this pattern as needed
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'  # Adjust as needed

    # Delete phone numbers and emails from the body
    for paragraph in doc.paragraphs:
        paragraph.text = re.sub(phone_pattern, '', paragraph.text)
        paragraph.text = re.sub(email_pattern, '', paragraph.text)

    # Save the modified document
    doc.save('./uploads/modified_document.docx')


@app.route('/upload', methods=['POST'])
def upload_file():
    print("start")

    if len(request.files) == 0:
        return jsonify({'error': 'No selected file'})
    

    fileNames = []

    for reqFiles in request.files:
        file = request.files[reqFiles]
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)
        fileNames.append(filename)
        
    
    
    print("after upload")
    for name in fileNames:
        modify_docx(name)
        print("modified")

    return jsonify({'message': 'File uploaded successfully'})


if __name__ == '__main__':
    app.run(debug=True)
    
    