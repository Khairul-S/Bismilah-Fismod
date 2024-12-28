from flask import Flask, request, render_template
import pandas as pd

# Load dataset with error handling
try:
    data = pd.read_csv('data/annual-co-emissions.csv')
except FileNotFoundError:
    raise FileNotFoundError("The dataset file 'annual-co-emissions.csv' is missing. Please ensure it is in the correct location.")
except pd.errors.EmptyDataError:
    raise ValueError("The dataset file 'annual-co-emissions.csv' is empty or corrupted. Please check the file contents.")

# Ensure 'Year' column is numeric
data['Year'] = pd.to_numeric(data['Year'], errors='coerce')

# Create a Flask app
app = Flask(__name__)

# Define the homepage route
@app.route('/')
def home():
    return render_template('index.html')

# Define the search route
@app.route('/search', methods=['POST'])
def search():
    try:
        country = request.form['country']
        
        # Filter data for the requested country
        filtered_data = data[data['Entity'].str.lower() == country.lower()]
        
        if filtered_data.empty:
            return render_template('index.html', result=f"No data found for {country}")
        
        # Get the last 5 years of data
        last_5_years = filtered_data.dropna(subset=['Year']).sort_values('Year', ascending=False).head(5)
        
        if last_5_years.empty:
            return render_template('index.html', result=f"No data available for the last 5 years for {country}")
        
        # Convert the result to a list of dictionaries for display
        result = last_5_years[['Year', 'Annual CO₂ emissions']].to_dict(orient='records')
        return render_template('index.html', result=result, country=country)
    
    except Exception as e:
        # Log error for debugging
        print(f"Error: {e}")
        return render_template('index.html', result="An error occurred. Please try again.")

if __name__ == '__main__':
    app.run(debug=True)
    
@app.route('/calculator')
def calculator():
    return render_template('calculator.html')  # Pastikan file ini ada di folder templates

@app.route('/about')
def about():
    return render_template('about.html')  # Pastikan file ini ada di folder templates
