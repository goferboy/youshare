from peewee import *;
import datetime;

DATABASE = SqliteDatabase('sessions.sqlite');

class Session(Model):
    created_at = DateTimeField(default = datetime.datetime.now);

    class Meta:
        database = DATABASE;
    
def initialize():
    DATABASE.connect();
    DATABASE.create_tables([Session], safe = True);
    print("SQLITE Tables created");
    DATABASE.close();
