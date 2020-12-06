from peewee import *;
import datetime;

DATABASE = SqliteDatabase('sessions.sqlite');

class Session(Model):
    room_name = CharField();
    playlist = [
        {
            "username": TextField(),
            "video": {
                "kind": TextField(),
                "etag": TextField(),
                "id": {
                    "kind": TextField(),
                    "videoId": TextField()
                },
                "snippet": {
                    "publishedAt": TextField(),
                    "channelId": TextField(),
                    "title": TextField(),
                    "description": TextField(),
                    "thumbnails": {
                        "default": {
                            "url": TextField(),
                            "width": IntegerField(),
                            "height": IntegerField()
                        },
                        "medium": {
                            "url": TextField(),
                            "width": IntegerField(),
                            "height": IntegerField()
                        },
                        "high": {
                            "url": TextField(),
                            "width": IntegerField(),
                            "height": IntegerField()
                        }
                    },
                    "channelTitle": TextField(),
                    "liveBroadcastContent": TextField(),
                    "publishTime": TextField()
                }
            }
        }
    ];
    created_at = DateTimeField(default = datetime.datetime.now);
    created_at2 = DateTimeField(default = 0);

    class Meta:
        database = DATABASE;
    
def initialize():
    DATABASE.connect();
    DATABASE.create_tables([Session], safe = True);
    print("SQLITE Tables created");
    DATABASE.close();
