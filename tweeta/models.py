from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Follow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    user_following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")

    def serialize(self):
        return {
            "user": self.user.username,
            "following": self.user_following.username
        }

    def __str__(self):
        return self.user_following.username

class Post(models.Model):
    # ID, author aka username from User class, content, date posted, number of likes from Like class
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True) 

    def serialize(self):
        return {
            "id": self.id,
            "author": self.author.username,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

class Like(models.Model):
    # Liker, which post aka id of post
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes", null=True)
    liker = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts_liked", null=True)

    def serialize(self):
        return {
            "post": self.post.id,
            "liker": self.liker.username
        }