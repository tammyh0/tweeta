from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http.response import Http404, JsonResponse
from django.shortcuts import render
from django.urls import reverse
import json
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers

from .models import User, Follow, Post, Like


def index(request):
    return render(request, "tweeta/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "tweeta/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "tweeta/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "tweeta/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "tweeta/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "tweeta/register.html")

# Get all posts including their number of likes 
def all_posts(request):
    
    # Get posts
    start = int(request.GET.get("start"))
    end = int(request.GET.get("end"))

    data = []
    isLast = False
    likes = []

    # Try querying for post data
    try:
        posts = Post.objects.all()
        posts = list(reversed(posts))
        total = len(posts)

        if end < total:
            for i in range(start, end):
                data.append(posts[i])
        else:
            for i in range(start, total):
                data.append(posts[i])
            isLast = True
        
    except Post.DoesNotExist:
        return JsonResponse({"error": "Posts not found"}, status=404)

    # Query for post likes data
    try: 
        for post in data:
            id = post.id
            count = len(Like.objects.filter(post=id))
            likes.append({
                "id": id,
                "count": count
            })
    except Like.DoesNotExist:
        return JsonResponse({"error": "Likes not found"}, status=404)

    return JsonResponse({
        "posts": [post.serialize() for post in data],
        "isLast": isLast,
        "likes": likes
    })

# Get a list of followers and following
def profile(request, username):
    
    # Query for user
    user = User.objects.get(username=username)

    # Query for followers
    try:
        following = Follow.objects.filter(user=user)
    except Follow.DoesNotExist:
        return JsonResponse({"error": "Following list not found"}, status=404)

    try:
        followers = Follow.objects.filter(user_following=user)
    except Follow.DoesNotExist:
        return JsonResponse({"error": "Follower list not found"}, status=404)

    return JsonResponse({
        "following": [user.serialize() for user in following],
        "followers": [user.serialize() for user in followers]
    })

def user_posts(request, username):

    # Get user
    user = User.objects.get(username=username)

    # Get posts
    start = int(request.GET.get("start"))
    end = int(request.GET.get("end"))

    data = []
    isLast = False
    likes = []

    # Try querying for post data
    try:
        posts = Post.objects.filter(author=user)
        posts = list(reversed(posts))
        total = len(posts)

        if end < total:
            for i in range(start, end):
                data.append(posts[i])
        else:
            for i in range(start, total):
                data.append(posts[i])
            isLast = True
        
    except Post.DoesNotExist:
        return JsonResponse({"error": "Posts not found"}, status=404)

    # Query for post likes data
    try: 
        for post in data:
            id = post.id
            count = len(Like.objects.filter(post=id))
            likes.append({
                "id": id,
                "count": count
            })
    except Like.DoesNotExist:
        return JsonResponse({"error": "Likes not found"}, status=404)

    return JsonResponse({
        "posts": [post.serialize() for post in data],
        "isLast": isLast,
        "likes": likes
    })



