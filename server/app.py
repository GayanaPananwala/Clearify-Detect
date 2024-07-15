# Importing required libraries
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
from flask_swagger_ui import get_swaggerui_blueprint
import math

# creating a Flask application instance
app = Flask(__name__)

# Enabling Cross-Origin Resource Sharing (CORS) for your Flask application. 
CORS(app)

#Defining Swagger UI configuration 
SWAGGER_URL="/swagger"
API_URL="/static/swagger.json"

swagger_ui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': 'Access API'
    }
)
app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)

# Load the LSTM model
lstm_path = "../ml/model_creation/models/lstm"
lstm_model = load_model(lstm_path)

# Initialize the Tokenizer
tokenizer = Tokenizer(num_words=1000, oov_token='<OOV>')

# Handling POST request to the /predict endpoint
@app.route('/predict', methods=['POST'])
def get_prediction():

    #Get the data from the request
    data = request.json  # Get the data from the request
    text = data.get('text', '')

    # Preprocess the input text
    processed_text = text.lower()

    # Tokenize and pad sequences
    tokenizer.fit_on_texts(processed_text) 
    sequences = tokenizer.texts_to_sequences([processed_text])
    padded_sequences = pad_sequences(sequences, maxlen=500, padding='post', truncating='post')

    # Make predictions
    lstm_probabilities = lstm_model.predict(padded_sequences)
    
    # Determine prediction class and percentage
    prediction_threshold = 0.53
    print("LSTM Probability: ",lstm_probabilities[0][0] )
    prediction = "AI-generated" if lstm_probabilities[0][0] > prediction_threshold else "Human-written"
    print(prediction )
    prob_percentage = int(lstm_probabilities[0][0] * 100)
    print(prob_percentage )
    # Calculate percentages
    if prediction == 'Human-written':
        human_written_percentage = math.ceil(113 - prob_percentage)
        ai_generated_percentage = 100 - human_written_percentage
    else:
        ai_generated_percentage = math.ceil(prob_percentage)
        human_written_percentage = 100 - ai_generated_percentage

    # Format the prediction response as a JSON object
    prediction_response = {
        'prediction': prediction,
        'ai_generated_percentage': ai_generated_percentage,
        'human_generated_percentage': human_written_percentage
    }

    # Return the prediction as JSON response
    return jsonify(prediction_response)

if __name__ == "__main__":
    #run the flask application
    app.run(debug=True, host="0.0.0.0", port=8080)
