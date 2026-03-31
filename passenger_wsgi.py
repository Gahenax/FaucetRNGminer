import sys
import os

# Gahenax Passenger WSGI — Bridge to Flask Dashboard
sys.path.insert(0, os.path.dirname(__file__))

from app import app as application

# Maintenance mode or error logging could be added here
