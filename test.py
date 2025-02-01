from flask import Flask, request, jsonify
from google.api import client

# Replace 'YOUR_API_KEY' with your actual Gemini API key
API_KEY = 'AIzaSyBFBV8A6W6MEhREA29SYnvUz-NtfuKfR3M'

app = Flask(__name__)

@app.route('/', methods=['POST'])
def process_input():
    try:
        input_data = request.get_json()
        user_input = input_data.get('input')

        if user_input is None:
            return jsonify({'error': 'Missing "input" field'}), 400

        # Construct the Gemini API request
        client_ = client.Client(developerKey=API_KEY)
        request_ = client_.model().generateText(body={
            "prompt": {
                "text": user_input
            },
           "model":"models/chat-bison-001", # Or specify other Gemini models as needed
            "temperature": 0.2 # Adjust temperature as needed
        })
        response = request_.execute()

        # Extract the generated text from the response
        generated_text = response.get('candidates')[0].get('output')

        return jsonify({'output': generated_text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)


