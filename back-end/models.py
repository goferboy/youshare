from peewee import *;
from playhouse.sqlite_ext import JSONField;
import datetime;

DATABASE = SqliteDatabase('sessions.sqlite');

class Session(Model):
    room_name = CharField(unique = True);
    playlist = JSONField(null= True);
    created_at = DateTimeField(default = datetime.datetime.now);

    class Meta:
        database = DATABASE;
    
def initialize():
    DATABASE.connect();
    DATABASE.create_tables([Session], safe = True);
    print("SQLITE Tables created");
    DATABASE.close();
