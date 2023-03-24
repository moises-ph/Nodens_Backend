from dotenv import load_dotenv
load_dotenv()
import os

MONGOURI = os.getenv("MONGODB_URI")
SECRET = os.getenv("SECRET")