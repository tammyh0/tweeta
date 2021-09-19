from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("all", views.all_posts, name="all"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("all/<str:username>", views.user_posts, name="user_posts"),
    path("following/<str:username>", views.following, name="following"),
    path("like/<str:username>", views.like, name="like"),
    path("edit", views.edit, name="edit"),
    path("update_like/<str:username>", views.edit_like, name="edit_like"),
    path("follow/<str:username>", views.follow, name="follow"),
    path("post", views.post, name="post")
]
