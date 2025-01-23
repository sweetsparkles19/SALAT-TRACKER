from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# Route untuk menyajikan halaman utama
@app.route('/')
def index():
    return render_template('index.html')

# Route API untuk mendapatkan waktu salat
@app.route('/api/prayer-times', methods=['GET'])
def get_prayer_times():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    location = request.args.get('location')
    API_URL = "https://api.aladhan.com/v1/timings"

    try:
        if lat and lon:
            # Jika lat/lon diberikan, gunakan koordinat
            response = requests.get(f"{API_URL}?latitude={lat}&longitude={lon}&method=2")
        elif location:
            # Jika lokasi manual diberikan, gunakan pencarian berdasarkan alamat
            response = requests.get(
                "https://api.aladhan.com/v1/timingsByAddress",
                params={"address": location, "method": 2}
            )
        else:
            return jsonify({"error": "Lokasi tidak disediakan"}), 400

        response.raise_for_status()  # Periksa apakah request berhasil
        data = response.json()
        return jsonify(data['data'])
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Gagal mengambil jadwal salat"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
