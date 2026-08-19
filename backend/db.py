import os
import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row

load_dotenv() #stores .env key-value pairs into os environment variables

DATABASE_URL = os.getenv("DATABASE_URL") #gets the environment variable "DATABASE_URL" from os

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

def get_connection():
    return psycopg.connect(DATABASE_URL, row_factory=dict_row) #creates connection object instance with atribute row_factory set to dict_row (makes response into dictionary rather than a tuple)