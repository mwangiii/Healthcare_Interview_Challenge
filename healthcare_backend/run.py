# -*- coding: utf-8 -*-
"""This is the main entry point for the application."""
from app import create_app 


app, db, api = create_app()

if __name__ == "__main__":
    app.run(debug=True)
