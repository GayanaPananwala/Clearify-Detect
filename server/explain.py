#Importing required libraries
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
from lime.lime_text import LimeTextExplainer
import numpy as np

# creating a Flask application instance
app = Flask(__name__)

# Enabling Cross-Origin Resource Sharing (CORS) for your Flask application. 
CORS(app)

# Load the LSTM model
lstm_path = "../ml/model_creation/models/lstm"
lstm_model = load_model(lstm_path)

# Initialize the Tokenizer
tokenizer = Tokenizer(num_words=1000, oov_token='<OOV>')

########Using LIME to explain the model decisions########

# This function is for preprocessing text 
def preprocess_text(text):
    processed_text = text
    tokenizer.fit_on_texts(processed_text)
    sequences = tokenizer.texts_to_sequences(processed_text)
    padded_sequences = pad_sequences(sequences, maxlen=500, padding='post', truncating='post')
    return padded_sequences

# Function to predict using LSTM model
def predict(text):
    returnable = []
    padded_sequences = preprocess_text(text)
    prediction_value = lstm_model.predict(padded_sequences)
    for i in prediction_value:
        temp = i[0]
        returnable.append(np.array([1-temp, temp]))
    return np.array(returnable)


# Handling POST request to the /explain endpoint
@app.route('/explain', methods=['POST'])
def explain_prediction_route():
    data = request.json
    text = data.get('text', '')

    # Preprocess the input text
    processed_text = text.lower().split()

    # Create LimeTextExplainer instance
    explainer = LimeTextExplainer(class_names=['Human-written', 'AI-generated'])

    # Explain prediction
    explanation = explainer.explain_instance(text, predict, labels=(0, 1), num_features=len(processed_text))

    # Extract explanation information
    explanation_data = {
        'class_names': list(map(str, explanation.class_names)),
        'predicted_probability': list(map(float, explanation.predict_proba)),
        'local_exp': {str(class_name): {str(idx): float(weight) for idx, weight in exp} for class_name, exp in explanation.local_exp.items()},
        'intercept': list(map(float, explanation.intercept))
    }

    # Tokenize the text
    tokens = text.lower().split()

    # Extract local_exp from explanation_data and align with tokens
    local_exp = explanation_data.get('local_exp', {})
    aligned_local_exp = {}
    for class_name, class_exp in local_exp.items():
        aligned_exp = {}
        for word_idx, word in enumerate(tokens):
            word_key = str(word_idx)
            if word_key in class_exp:
                aligned_exp[str(word_idx)] = class_exp[word_key]
        aligned_local_exp[class_name] = aligned_exp

    # Creating a dictionary to store highlighted tokens with their colors
    highlighted_text_dict = {}
    
    # Highlight words based on their importance
    for class_index, class_exp in explanation_data["local_exp"].items():
        for word_idx, weight in class_exp.items():
            word = tokens[int(word_idx)]
            if weight > 0:
                # Determine the color based on the class index
                color = 'green' if class_index == '0' else 'red'
                highlighted_text_dict[word] = color
    
    # Convert the dictionary to a list of dictionaries for JSON serialization
    highlighted_text = [{'word': word, 'color': color} for word, color in highlighted_text_dict.items()]
    
    return jsonify({'explanation_data': explanation_data, 'highlighted_text': highlighted_text})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)