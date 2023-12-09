# import re
# from docx import Document
# from docx.shared import Pt
# from docx.enum.text import WD_ALIGN_PARAGRAPH
# from docx.oxml.ns import nsdecls
# from docx.oxml import parse_xml
# from docx.shared import Inches
# from PIL import Image
# from docx.oxml.ns import qn
# from docx.oxml import OxmlElement
# import io
# from docx2pdf import convert


# import os





# def modify_docx(file_path, output_path, image_path):
#     # Load the document
#     doc = Document(file_path)

#     # Move header and footer content to the top of the body
#     for section in doc.sections:
#         header = section.header
#         footer = section.footer
#         header.is_linked_to_previous = True
#         section.different_first_page_header_footer = False

#         # doc.paragraphs[0].insert_paragraph_before("--------------------------------\n")     
#         # for paragraph in header.paragraphs:
#         #     doc.paragraphs[0].insert_paragraph_before(paragraph.text)
#         # doc.paragraphs[0].insert_paragraph_before("Header:")

#         # doc.paragraphs[0].insert_paragraph_before("--------------------------------\n")
#         # for paragraph in footer.paragraphs:
#         #     doc.paragraphs[0].insert_paragraph_before(paragraph.text)
#         # doc.paragraphs[0].insert_paragraph_before("Footer:")

#         # Clear header and footer
#         for paragraph in header.paragraphs:
#             paragraph.clear()
#         for paragraph in footer.paragraphs:
#             paragraph.clear()
#         print(len(header.paragraphs))
#         print(len(footer.paragraphs))



#         # Clear the existing content of the header
#         # for paragraph in header.paragraphs:
#         #     for run in paragraph.runs:
#         #         run.clear()
#         header_paragraph = header.paragraphs[0]
#         header_paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
#         header_paragraph.paragraph_format.left_indent = Inches(0)
#         header_paragraph.paragraph_format.right_indent = Inches(0)

#         header_paragraph.paragraph_format.space_before = Inches(0)
#         header_paragraph.paragraph_format.space_after = Inches(0)   
        


#         htable = header.add_table(1, 2, width=Inches(7))
#         for row in htable.rows:
#             for cell in row.cells:
#                 for paragraph in cell.paragraphs:
#                     paragraph.paragraph_format.left_indent = Inches(0)



#         # # Set individual column widths
#         htable.columns[0].width = Inches(1)
#         htable.columns[1].width = Inches(4.5)

#         # Left cell (Logo)
#         ht_left = htable.cell(0, 0).paragraphs[0]
#         ht_left.alignment = WD_ALIGN_PARAGRAPH.LEFT
#         logo_run = ht_left.add_run()
#         logo_run.add_picture("JRSS1.png", width=Inches(1))

#         # Right cell (Slogan)
#         ht_right = htable.cell(0, 1).paragraphs[0]
#         # ht_right.alignment =  WD_ALIGN_PARAGRAPH.RIGHT
#         ht_right.alignment = WD_ALIGN_PARAGRAPH.LEFT
#         slogan_run = ht_right.add_run()
#         slogan_run.add_picture("JRSS_FBanner.png", width=Inches(4.5))
#         # header.add_paragraph().add_run().add_picture(image_path, width=Inches(2))

#     # Regex patterns for phone numbers and emails
#     phone_pattern = r'^\s*(?:\+?(\d{1,3}))?[-. ()]*(\d{3})[-. )(]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$'  # Adjust this pattern as needed
#     email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'  # Adjust as needed

#     # Delete phone numbers and emails from the body
#     for paragraph in doc.paragraphs:
#         paragraph.text = re.sub(phone_pattern, '', paragraph.text)
#         paragraph.text = re.sub(email_pattern, '', paragraph.text)

#     # Save the modified document
#     doc.save('modified_' + file_path)


# # Example usage:
# # input_docx_path = 'modified_document.docx'
# # output_docx_path = 'output.docx'
# # header_image_path = 'watermark.png'
# # phone_email_regex = r'\b(?:\d{3}[-\.\s]?)?\d{3}[-\.\s]?\d{4}\b|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'

# # modify_docx(input_docx_path, output_docx_path, header_image_path)

# convert("./uploads/1702071212Ĭ0Ĭdocument.docx", "./uploads/output.pdf")
# # convert("./uploads/1702071212Ĭ0Ĭdocument.docx")
# # pdf_path = docx_to_pdf('./uploads/1702071212Ĭ0Ĭdocument.docx')
# # print(f'PDF saved at {pdf_path}')


import subprocess
import os

def convert_to_pdf(file_path):
    # Define the output PDF file path
    output_file = file_path.replace('.docx', '.pdf')

    # Run the LibreOffice conversion command
    soffice_path = '/Applications/LibreOffice.app/Contents/MacOS/soffice'  # Replace with the actual path to soffice
    command = f'"{soffice_path}" --headless --convert-to pdf --outdir "{os.path.dirname(output_file)}" "{file_path}"'
    subprocess.run(command, shell=True)

    return output_file

# Example usage
docx_file = './uploads/1702071212Ĭ0Ĭdocument.docx'
pdf_file = convert_to_pdf(docx_file)
print(f"Converted to PDF: {pdf_file}")
