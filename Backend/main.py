from dotenv import load_dotenv
from flask import Flask, request, jsonify, globals
from flask_cors import CORS, cross_origin
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings, HuggingFaceInstructEmbeddings
from langchain.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI
import codecs
import cv2
import pytesseract
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files (x86)\\Tesseract-OCR\\tesseract.exe'

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
coversational_chain = None


# creating the chunks from the raw text
def get_chunks_text(raw_text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,  # 1000 characters
        chunk_overlap=200,  # if the chunk size in middle of a paragraph then it will look back about 200 characters to get the previous paragraph
        length_function=len
    )

    chunks = text_splitter.split_text(raw_text)
    return chunks


# defining the vecotr store
# creating the embeddings
# passing the vector store
def get_vector_store(text_chunks):
    embeddings = OpenAIEmbeddings()
    # embeddings = HuggingFaceInstructEmbeddings(
    # model_name='hku-nlp/instructor-xl')
    vectorStore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorStore


# creating the conversational chain
def get_conversational_chain(vectore_store):
    llm = ChatOpenAI()
    memory = ConversationBufferMemory(
        memory_key='chat_history', return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        memory=memory,
        retriever=vectore_store.as_retriever()
    )

    return conversation_chain


def image_to_textCaption(url):
    image = Image.open(url).convert('RGB')
    modelName = 'Salesforce/blip-image-captioning-large'
    device = 'cpu'
    processor = BlipProcessor.from_pretrained(modelName)
    model = BlipForConditionalGeneration.from_pretrained(modelName).to(device)

    inputs = processor(image, return_tensors='pt').to(device)
    output = model.generate(**inputs, max_new_tokens=20)

    caption = processor.decode(output[0], skip_special_tokens=True)

    return caption


@app.route('/load-files', methods=['POST'])
def load_files():
    data = request.files.getlist('file')
    whole_text = ''
    # for grammer checking and the meaning catching
    # my_language_tool = language_tool_python.LanguageTool('en-US')
    for file in data:
        pdf_reader = PdfReader(file)
        for page in pdf_reader.pages:
            text = page.extract_text()
            images = page.images
            whole_text += text
            if (len(images) > 0):
                for image in images:
                    extension = image.name.split('.')[-1]
                    imageName = "Image.{extension}".format(extension=extension)
                    with open(imageName, 'wb') as f:
                        f.write(image.data)
                    imgCV = cv2.imread(filename=imageName)
                    imgText = pytesseract.image_to_string(image=imgCV)

                    if (imgText):
                        whole_text += "image description -> {imageName} has the meaning of {imgText}\n".format(
                            imageName=imageName, imgText=imgText)
                    else:
                        caption = image_to_textCaption(imageName)
                        whole_text += "image caption -> {caption} and this image do not contain any word. this is just the caption of things that it contains.".format(
                            caption=caption)

    # array containing the chunks of the text
    text_chunks = get_chunks_text(whole_text)

    # creating the vector store
    vector_store = get_vector_store(text_chunks)
    global coversational_chain
    coversational_chain = get_conversational_chain(vectore_store=vector_store)

    if coversational_chain:
        userdata = {
            'loaded': True,
            'data': 'successfully loaded the files',
            'error': False,
        }
        return jsonify(userdata), 200
    else:
        returnData = {
            'loaded': True,
            'data': 'Error while loading the files',
            'error': True
        }

        return jsonify(returnData), 404


# processing the user queries that are taken as the user input
@app.route('/user-query', methods=['POST'])
def process_query():
    # converting the byte to string using codecs
    query = codecs.decode(request.get_data(), 'utf-8')

    global coversational_chain
    if (coversational_chain):
        response = coversational_chain({'question': query})
        chat_history = response['chat_history']
        response_chat = []
        for i, msg in enumerate(chat_history):
            if (i % 2 == 0):
                response_chat.append({'role': 'user', 'content': msg.content})
            else:
                response_chat.append(
                    {'role': 'assistant', 'content': msg.content})

        chain_response = {
            'data': response_chat,
            'error': False
        }
        return jsonify(chain_response), 200
    else:
        chain_response = {
            'data': None,
            'error': True
        }
        return jsonify(chain_response), 404


if (__name__ == '__main__'):
    load_dotenv()
    app.run(debug=True)
