from flask import Flask, render_template, request
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os

# Inisialisasi Flask
app = Flask(__name__, static_folder='static')

# Load dataset dengan error handling
try:
    data = pd.read_csv('data/annual-co-emissions.csv')
except FileNotFoundError:
    raise FileNotFoundError("The dataset file 'annual-co-emissions.csv' is missing. Please ensure it is in the correct location.")
except pd.errors.EmptyDataError:
    raise ValueError("The dataset file 'annual-co-emissions.csv' is empty or corrupted. Please check the file contents.")

# Rute untuk halaman utama
@app.route('/')
def home():
    return render_template('index.html')

# Rute untuk kalkulator karbon
@app.route('/calculator')
def calculator():
    return render_template('calculator.html')

# Rute untuk about us
@app.route('/about')
def about():
    return render_template('about.html')

# Rute untuk pencarian
@app.route('/search', methods=['POST'])
def search():
    country = request.form['country']

    # Filter data berdasarkan negara
    filtered_data = data[data['Entity'].str.lower() == country.lower()]

    if filtered_data.empty:
        return render_template('index.html', result=f"No data found for {country}")

    # Ambil 5 tahun terakhir
    last_5_years = filtered_data.sort_values('Year', ascending=False).head(5)

    # Konversi hasil ke format yang bisa ditampilkan
    result = last_5_years[['Year', 'Annual CO₂ emissions']].to_dict(orient='records')
    return render_template('index.html', result=result, country=country)

# Define the plot route
@app.route('/plot/<country>')
def plot(country):
    # Filter data for the requested country
    filtered_data = data[data['Entity'].str.lower() == country.lower()]
    last_5_years = filtered_data.sort_values('Year', ascending=False).head(5)
    
    if last_5_years.empty:
        return f"No data available to plot for {country}"
    
    # Create the plot
    plt.figure(figsize=(10, 6))
    plt.bar(last_5_years['Year'], last_5_years['Annual CO₂ emissions'], color='green')
    plt.xlabel('Tahun')
    plt.ylabel('Jumlah Emisi CO₂  (Ton/CO₂)')
    plt.title(f'Emisi Karbon Negara {country} (5 Tahun Terakhir )')
    plt.grid(axis='y')
    
    # Save the plot to the static folder
    plot_path = f"static/plots/{country.lower()}.png"
    os.makedirs('static/plots', exist_ok=True)
    plt.savefig(plot_path)
    plt.close()
    
    # Render the plot page
    return render_template('plot.html', country=country, plot_path=plot_path)

if __name__ == '__main__':
    app.run(debug=True)