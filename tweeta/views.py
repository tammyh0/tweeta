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

def following(request, username):

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
        # posts = Post.objects.filter(author=user)
        # posts = list(reversed(posts))
        # total = len(posts)

        posts = []
        users_following = Follow.objects.filter(user=user)
        for user_following in users_following:
            user_following = User.objects.get(username=user_following)
            user_following_posts = Post.objects.filter(author=user_following)
            for post in user_following_posts:
                posts.append(post)
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

def like(request, username):

    # Get user
    user = User.objects.get(username=username)

    # Get post
    post_id = str(request.GET.get("post"))
    post = Post.objects.get(id=post_id)

    # Return whether the user has liked the post
    if request.method == "GET":

        try:
            like = Like.objects.filter(post=post, liker=user)
            if len(like) > 0:
                return JsonResponse({"isLiked": True})
            else:
                return JsonResponse({"isLiked": False})
        except Like.DoesNotExist:
                return JsonResponse({"error": "Likes not found"})

@csrf_exempt     
def edit(request):

    # Get post id
    id = int(request.GET.get("post"))

    # Get contents
    data = json.loads(request.body)
    body = data.get("body", "")

    # Edit post contents
    post = Post.objects.get(id=id)
    post.body = body
    post.save()
    
    return JsonResponse({"message": "Post edited successfully"})

@csrf_exempt   
def edit_like(request, username):

    # Get post id and action type
    id = int(request.GET.get("post"))
    action = str(request.GET.get("action"))

    # Get post and user
    post = Post.objects.get(id=id)
    user = User.objects.get(username=username)

    if action == "like":
        like = Like(post=post, liker=user)
        like.save()
        return JsonResponse({"message": "Success with like"})
    elif action == "unlike":
        like = Like.objects.get(post=post, liker=user)
        like.delete()
        return JsonResponse({"message": "Success with unlike"})

@csrf_exempt  
def follow(request, username):

    # Get current logged in user
    current = User.objects.get(username=request.user.username)

    # Profile's user
    profile = User.objects.get(username=username)

    if request.method == "GET":
        try:
            follow = Follow.objects.filter(user=current, user_following=profile)
            if len(follow) > 0:
                return JsonResponse({"isFollowing": True})
            else:
                return JsonResponse({"isFollowing": False})
        except Follow.DoesNotExist:
                return JsonResponse({"error": "Follows not found"})

    action = str(request.GET.get("action"))
    if action == "follow":
        follow = Follow(user=current, user_following=profile)
        follow.save()
        return JsonResponse({"message": "Success with follow"})
    else:
        follow = Follow.objects.get(user=current, user_following=profile)
        follow.delete()
        return JsonResponse({"message": "Success with unfollow"})

@csrf_exempt
def post(request):

    # Submitting a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    # Get contents
    data = json.loads(request.body)

    author = data.get("author", "")
    author = User.objects.get(username=author)
    body = data.get("body", "")

    post = Post(author=author, body=body)
    post.save()

    return JsonResponse({"message": "Post created successfully"})