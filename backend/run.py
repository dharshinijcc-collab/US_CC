import sys
import os

# Add the parent directory to the path to allow importing the 'backend' package
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend import app, socketio

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
