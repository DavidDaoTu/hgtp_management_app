import shutil
import pandas as pd
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from googleapiclient.http import MediaFileUpload
import io
from googleapiclient.errors import HttpError
from datetime import datetime, timedelta
import os

os.system("bash /home/hgtp_admin/mongodb-backup/run.sh")

scope = ['https://www.googleapis.com/auth/drive']
service_account_json_key = 'my_key_name.json'
credentials = service_account.Credentials.from_service_account_file(
                              filename=service_account_json_key,
                              scopes=scope)
service = build('drive', 'v3', credentials=credentials)
# Call the Drive v3 API


# get current datetime
current_datetime = datetime.now()
date_string = current_datetime.strftime("-%d-%m-%Y-%H(hour):%M(min)")

parent_id= "1RL5nVtP96hQ-wQPbKAH3B5JuYpNxZ_sV"
workpath = "/home/hgtp_admin/mongodb-backup/backup/"
backupfilename = "mongodb_dump.gz"

# zip folder to file
shutil.make_archive(backupfilename,'zip',workpath)

#upload file inside the folder
file_metadata = {'name': backupfilename + date_string + '.zip', 'parents': [parent_id]}
media = MediaFileUpload( backupfilename + ".zip")
file = service.files().create(body=file_metadata, media_body=media).execute()
