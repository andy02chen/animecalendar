import pytest
from main import guest_filter_user_anime_for_stats, filter_scoring_data, filter_genre_data, filter_preference_data, filter_viewing_data, filter_studio_data

# !!!! GUEST FUNCTION !!!!!!

# Empty data
def test_filter_empty():
    result = guest_filter_user_anime_for_stats({'data':[]})
    assert len(result) == 0
    assert result == {}

# valid data
test_data_basic = {
    "data": [
        {
            "node": {
                "id": 1,
                "title": "Anime 1",
                "end_date": "2021-01-01",
                "mean": 8.5,
                "rank": 10,
                "rating": "PG-13",
                "source": "Manga",
                "start_season": {"year": 2021},
                "genres": [{"name": "Action"}, {"name": "Adventure"}],
                "main_picture": {"medium": "url_to_image_1"},
                "studios": [{"id": 101, "name": "Studio A"}]
            }
        },
        {
            "node": {
                "id": 2,
                "title": "Anime 2",
                "end_date": "2020-01-01",
                "mean": 7.2,
                "rank": 50,
                "rating": "R",
                "source": "Light Novel",
                "start_season": {"year": 2020},
                "genres": [{"name": "Drama"}, {"name": "Romance"}],
                "main_picture": {"medium": "url_to_image_2"},
                "studios": [{"id": 102, "name": "Studio B"}]
            }
        },
    ]
}

def test_basic():
    result = guest_filter_user_anime_for_stats(test_data_basic)
    assert result == {
    "top_10_genres_count": [
        {"genre": "Action", "count": 1},
        {"genre": "Adventure", "count": 1},
        {"genre": "Drama", "count": 1},
        {"genre": "Romance", "count": 1}
    ],
    "popular_ratings": [
        {"name": "PG-13", "value": 1},
        {"name": "R", "value": 1}
    ],
    "sources": [
        {"source": "Light Novel", "count": 1},
        {"source": "Manga", "count": 1}
    ],
    "top_10_studios_count": [
        {"studio_name": "Studio A", "count": 1},
        {"studio_name": "Studio B", "count": 1}
    ],
    "season_anime": [
        {"start_year": 2020, "count": 1},
        {"start_year": 2021, "count": 1}
    ]
}

# missing fields
test_data_missing_fields = {
    "data": [
        {
            "node": {
                "id": 3,
                "title": "Anime 3",
                "end_date": "2022-01-01",
                "mean": 9.0,
                # Missing rank, rating, and genres
                "source": "Original",
                "start_season": {"year": 2022},
                "main_picture": {"medium": "url_to_image_3"},
                "studios": [{"id": 103, "name": "Studio C"}]
            }
        },
        {
            "node": {
                "id": 4,
                "title": "Anime 4",
                "end_date": "2023-01-01",
                "mean": 6.0,
                "rank": 100,
                # Missing rating
                "source": "Webtoon",
                # Missing start_season
                "genres": [{"name": "Horror"}],
                "main_picture": {"medium": "url_to_image_4"},
                "studios": [{"id": 104, "name": "Studio D"}]
            }
        }
    ]
}
def test_missing_field():
    res = guest_filter_user_anime_for_stats(test_data_missing_fields)
    assert res == {}

# same genre, rating, or, source
test_data_same_attributes = {
    "data": [
        {
            "node": {
                "id": 7,
                "title": "Anime 7",
                "end_date": "2022-06-01",
                "mean": 8.0,
                "rank": 40,
                "rating": "R",
                "source": "Manga",
                "start_season": {"year": 2022},
                "genres": [{"name": "Action"}],
                "main_picture": {"medium": "url_to_image_7"},
                "studios": [{"id": 107, "name": "Studio G"}]
            }
        },
        {
            "node": {
                "id": 8,
                "title": "Anime 8",
                "end_date": "2021-07-01",
                "mean": 7.5,
                "rank": 60,
                "rating": "R",
                "source": "Manga",
                "start_season": {"year": 2021},
                "genres": [{"name": "Action"}],
                "main_picture": {"medium": "url_to_image_8"},
                "studios": [{"id": 107, "name": "Studio G"}]
            }
        }
    ]
}
def test_same_fields():
    res = guest_filter_user_anime_for_stats(test_data_same_attributes)
    assert res == {
        "top_10_genres_count": [
            {"genre": "Action", "count": 2}
        ],
        "popular_ratings": [
            {"name": "R", "value": 2}
        ],
        "sources": [
            {"source": "Manga", "count": 2}
        ],
        "top_10_studios_count": [
            {"studio_name": "Studio G", "count": 2}
        ],
        "season_anime": [
            {"start_year": 2021, "count": 1},
            {"start_year": 2022, "count": 1}
        ]
    }

# genre splitting
test_data_edge_genre = {
    "data": [
        {
            "node": {
                "id": 9,
                "title": "Anime 9",
                "end_date": "2020-08-01",
                "mean": 9.2,
                "rank": 5,
                "rating": "PG",
                "source": "Manga",
                "start_season": {"year": 2020},
                "genres": [],  # No genres
                "main_picture": {"medium": "url_to_image_9"},
                "studios": [{"id": 108, "name": "Studio H"}]
            }
        },
        {
            "node": {
                "id": 10,
                "title": "Anime 10",
                "end_date": "2019-12-01",
                "mean": 6.8,
                "rank": 200,
                "rating": "G",
                "source": "Game",
                "start_season": {"year": 2019},
                "genres": [{"name": ""}],  # Empty string genre
                "main_picture": {"medium": "url_to_image_10"},
                "studios": [{"id": 109, "name": "Studio I"}]
            }
        }
    ]
}
def test_genre_split():
    res = guest_filter_user_anime_for_stats(test_data_edge_genre)
    assert res == {
    "top_10_genres_count": [
            {
                'count': 2,
                'genre': '',
                },
        ],
        "popular_ratings": [
            {"name": "G", "value": 1},
            {"name": "PG", "value": 1}
        ],
        "sources": [
            {"source": "Game", "count": 1},
            {"source": "Manga", "count": 1}
        ],
        "top_10_studios_count": [
            {"studio_name": "Studio H", "count": 1},
            {"studio_name": "Studio I", "count": 1}
        ],
        "season_anime": [
            {"start_year": 2019, "count": 1},
            {"start_year": 2020, "count": 1}
        ]
    }

# !!!!!!!!!!!!!!! FILTER SCORING DATA

# basic
data_score_basic = {
    'data': [
        {
            'node': {
                'id': 1,
                'title': 'Anime A',
                'main_picture': {'medium': 'https://example.com/image_a.jpg'},
                'mean': 8.5,
                'start_season': {'year': 2021},
                'end_date': '2022-01-01',
                'my_list_status': {
                    'status': 'completed',
                    'score': 9,
                    'finish_date': '2023-06-15'
                }
            }
        },
        {
            'node': {
                'id': 2,
                'title': 'Anime B',
                'main_picture': {'medium': 'https://example.com/image_b.jpg'},
                'mean': 7.2,
                'start_season': {'year': 2020},
                'end_date': '2021-01-01',
                'my_list_status': {
                    'status': 'completed',
                    'score': 8,
                    'finish_date': '2023-08-20'
                }
            }
        }
    ]
}

def test_score_basic():
    res = filter_scoring_data(data_score_basic)
    assert res == {
        'you_vs_mal': {'your_score': 8.5, 'mal_score': 7.85},
        'very_good_ratings': 100.0,
        'lowest_rated': [
            {
                'image': 'https://example.com/image_b.jpg',
                'title': 'Anime B',
                'your_score': 8,
            },
            ],
        'average_rating_last_year': 0,
        'top_20_anime' :[
            {
                'title': 'Anime A',
                'your_score': 9,
                'mal_score': 8.5,
                'image': 'https://example.com/image_a.jpg',
            },
            {
                'title': 'Anime B',
                'your_score': 8,
                'mal_score': 7.2,
                'image': 'https://example.com/image_b.jpg',
            },
        ]
    }

# not compelted
data_no_complete = {
    'data': [
        {
            'node': {
                'id': 3,
                'title': 'Anime C',
                'main_picture': {'medium': 'https://example.com/image_c.jpg'},
                'mean': 7.0,
                'start_season': {'year': 2020},
                'end_date': '2021-01-01',
                'my_list_status': {
                    'status': 'watching',
                    'score': 0,
                    'finish_date': None
                }
            }
        }
    ]
}

def test_no_completed_scores():
    res = filter_scoring_data(data_no_complete)
    assert res == {}

#below 8
data_below_8 = {
    'data': [
        {
            'node': {
                'id': 4,
                'title': 'Anime D',
                'main_picture': {'medium': 'https://example.com/image_d.jpg'},
                'mean': 6.5,
                'start_season': {'year': 2021},
                'end_date': '2022-01-01',
                'my_list_status': {
                    'status': 'completed',
                    'score': 6,
                    'finish_date': '2023-05-01'
                }
            }
        },
        {
            'node': {
                'id': 5,
                'title': 'Anime E',
                'main_picture': {'medium': 'https://example.com/image_e.jpg'},
                'mean': 7.5,
                'start_season': {'year': 2020},
                'end_date': '2021-01-01',
                'my_list_status': {
                    'status': 'completed',
                    'score': 7,
                    'finish_date': '2022-10-20'
                }
            }
        }
    ]
}


def test_scores_less_eight():
    res = filter_scoring_data(data_below_8)
    assert res == {
        'you_vs_mal': {'your_score': 6.5, 'mal_score': 7.0},
        'very_good_ratings': 0.0,
        'lowest_rated': [
            {'title': 'Anime D', 'image': 'https://example.com/image_d.jpg', 'your_score': 6}
        ],
        'average_rating_last_year': 0,
        'top_20_anime' :[
            {
                'title': 'Anime E',
                'your_score': 7,
                'mal_score': 7.5,
                'image': 'https://example.com/image_e.jpg',
            },
            {
                'title': 'Anime D',
                'your_score': 6,
                'mal_score': 6.5,
                'image': 'https://example.com/image_d.jpg',
            },
        ]
    }

# last year
data_last_year = {
    'data': [
        {
            'node': {
                'id': 6,
                'title': 'Anime F',
                'main_picture': {'medium': 'https://example.com/image_f.jpg'},
                'mean': 9.0,
                'start_season': {'year': 2022},
                'end_date': '2023-01-01',
                'my_list_status': {
                    'status': 'completed',
                    'score': 10,
                    'finish_date': '2024-11-01'
                }
            }
        }
    ]
}


def test_last_year_scores():
    res = filter_scoring_data(data_last_year)
    assert res == {
        'you_vs_mal': {'your_score': 10.0, 'mal_score': 9.0},
        'very_good_ratings': 100.0,
        'lowest_rated': [{
            'image': 'https://example.com/image_f.jpg',
            'title': 'Anime F',
            'your_score': 10,
        },],
        'average_rating_last_year': 10.0,
        'top_20_anime' :[
            {
                'title': 'Anime F',
                'your_score': 10,
                'mal_score': 9.0,
                'image': 'https://example.com/image_f.jpg',
            },
        ]
    }

# missing finish date
data_no_finish = {
    'data': [
        {
            'node': {
                'id': 7,
                'title': 'Anime G',
                'main_picture': {'medium': 'https://example.com/image_g.jpg'},
                'mean': 6.8,
                'start_season': {'year': 2020},
                'end_date': '2021-01-01',
                'my_list_status': {
                    'status': 'completed',
                    'score': 6,
                    'finish_date': None
                }
            }
        }
    ]
}

def test_no_finish_date():
    res = filter_scoring_data(data_no_finish)
    assert res == {
        'average_rating_last_year': 0,
        'lowest_rated': [
            {
                'image': 'https://example.com/image_g.jpg',
                'title': 'Anime G',
                'your_score': 6,
            },
        ],
        'very_good_ratings': 0.0,
        'you_vs_mal': {
            'mal_score': 6.8,
            'your_score': 6.0,
        },
        'top_20_anime' :[
            {
                'title': 'Anime G',
                'your_score': 6,
                'mal_score': 6.8,
                'image': 'https://example.com/image_g.jpg',
            },
        ]
    }


# !!!!!!!!!!!!!!! FILTER GENRE DATA
# basic
genre_test_1 = {
    "data": [
        {
            "node": {
                "id": 1,
                "title": "Anime A",
                "main_picture": {"medium": "url_to_image_a"},
                "my_list_status": {
                    "status": "completed",
                    "score": 8,
                    "finish_date": "2025-01-15",
                },
                "genres": [{"name": "Action"}, {"name": "Adventure"}],
            }
        },
        {
            "node": {
                "id": 2,
                "title": "Anime B",
                "main_picture": {"medium": "url_to_image_b"},
                "my_list_status": {
                    "status": "completed",
                    "score": 9,
                    "finish_date": "2025-12-25",
                },
                "genres": [{"name": "Drama"}, {"name": "Romance"}],
            }
        },
        {
            "node": {
                "id": 3,
                "title": "Anime C",
                "main_picture": {"medium": "url_to_image_c"},
                "my_list_status": {
                    "status": "completed",
                    "score": 7,
                    "finish_date": "2025-11-05",
                },
                "genres": [{"name": "Action"}, {"name": "Drama"}],
            }
        },
        {
            "node": {
                "id": 4,
                "title": "Anime D",
                "main_picture": {"medium": "url_to_image_d"},
                "my_list_status": {
                    "status": "dropped",  # Not "completed"
                    "score": 5,
                    "finish_date": "2025-02-01",
                },
                "genres": [{"name": "Comedy"}],
            }
        },
    ]
}

def test_genre_basic():
    res = filter_genre_data(genre_test_1)
    assert res == {
        "top_10_genres_count": [
            {"genre": "Action", "count": 2},
            {"genre": "Drama", "count": 2},
            {"genre": "Adventure", "count": 1},
            {"genre": "Romance", "count": 1},
        ],
        "top_10_genres_avg": [
            {"genre": "Romance", "average": 9.0, "count": 1},
            {"genre": "Adventure", "average": 8.0, "count": 1},
            {"genre": "Drama", "average": 8.0, "count": 2},
            {"genre": "Action", "average": 7.5, "count": 2},
        ],
        "top_10_least_watched": [
            {"genre": "Action", "count": 2},
            {"genre": "Drama", "count": 2},
            {"genre": "Adventure", "count": 1},
            {"genre": "Romance", "count": 1},
        ],
        "top_10_most_watched_this_year": [
            {"genres": "Action", "count": 2},
            {"genres": "Drama", "count": 2},
            {"genres": "Adventure", "count": 1},
            {"genres": "Romance", "count": 1},
        ],
        "genres_this_year": ['Action',"Adventure", 'Drama',"Romance"],
    }

# Empty
genre_test_2 = {"data": []}

def test_genre_empty():
    res = filter_genre_data(genre_test_2)
    assert res == {}

# Not Completed
genre_test_3 = {
    "data": [
        {
            "node": {
                "id": 1,
                "title": "Anime A",
                "main_picture": {"medium": "url_to_image_a"},
                "my_list_status": {
                    "status": "watching",
                    "score": 0,
                    "finish_date": "2024-01-15",
                },
                "genres": [{"name": "Action"}],
            }
        }
    ]
}

def test_genre_not_completed():
    res = filter_genre_data(genre_test_3)
    assert res == {}

# Multiple genres
genre_test_4 = {
    "data": [
        {
            "node": {
                "id": 1,
                "title": "Anime A",
                "main_picture": {"medium": "url_to_image_a"},
                "my_list_status": {
                    "status": "completed",
                    "score": 10,
                    "finish_date": "2025-03-01",
                },
                "genres": [{"name": "Action"}, {"name": "Fantasy"}, {"name": "Adventure"}],
            }
        }
    ]
}

def test_genre_multi_genre():
    res = filter_genre_data(genre_test_4)
    assert res == {
        "top_10_genres_count": [
            {"genre": "Action", "count": 1},
            {"genre": "Adventure", "count": 1},
            {"genre": "Fantasy", "count": 1},
        ],
        "top_10_genres_avg": [
            {"genre": "Action", "average": 10.0, "count": 1},
            {"genre": "Adventure", "average": 10.0, "count": 1},
            {"genre": "Fantasy", "average": 10.0, "count": 1},
        ],
        "top_10_least_watched": [
            {"genre": "Action", "count": 1},
            {"genre": "Adventure", "count": 1},
            {"genre": "Fantasy", "count": 1},
        ],
        "top_10_most_watched_this_year": [
            {"genres": "Action", "count": 1},
            {"genres": "Fantasy", "count": 1},
            {"genres": "Adventure", "count": 1},
        ],
        "genres_this_year": ["Action", "Adventure", "Fantasy"],
    }

# !!!!!!!!!!!!!!! FILTER PREFERENCE DATA
# basic
pref_test_1 = {
    "data": [
        {
            "node": {
                "id": 1,
                "title": "Anime A",
                "main_picture": {"medium": "https://example.com/imageA.jpg"},
                "my_list_status": {"status": "completed", "score": 8},
                "num_episodes": 24,
                "source": "Manga",
                "media_type": "tv",
                "rating": "PG-13",
                "popularity": 150,
                "start_season": {"year": 2020}
            }
        },
        {
            "node": {
                "id": 2,
                "title": "Anime B",
                "main_picture": {"medium": "https://example.com/imageB.jpg"},
                "my_list_status": {"status": "completed", "score": 9},
                "num_episodes": 12,
                "source": "Light Novel",
                "media_type": "tv",
                "rating": "R",
                "popularity": 300,
                "start_season": {"year": 2019}
            }
        },
        {
            "node": {
                "id": 3,
                "title": "Anime C",
                "main_picture": {"medium": "https://example.com/imageC.jpg"},
                "my_list_status": {"status": "completed", "score": 10},
                "num_episodes": 50,
                "source": "Original",
                "media_type": "tv",
                "rating": "PG",
                "popularity": 100,
                "start_season": {"year": 2018}
            }
        }
    ]
}

def test_pref_basic():
    res = filter_preference_data(pref_test_1)
    assert res == {
        "sources": [
            {"source": "Light Novel", "count": 1},
            {"source": "Manga", "count": 1},
            {"source": "Original", "count": 1}
        ],
        "media_types": [
            {"name": "tv", "value": 3}
        ],
        "ratings": [
            {"name": "PG", "value": 1},
            {"name": "PG-13", "value": 1},
            {"name": "R", "value": 1}
        ],
        "popular_years": [
            {"year": 2018, "count": 1},
            {"year": 2019, "count": 1},
            {"year": 2020, "count": 1}
        ],
        "season_length": [
            {"Category": "Shorter", "Total Count": 1},
            {"Category": "Longer", "Total Count": 2}
        ],
        "popularity": {
            "avg_pop": 183.33,
            "top_200_pop": 2
        }
    }

# No valid
pref_test_2 = {
    "data": [
        {
            "node": {
                "id": 4,
                "title": "Anime D",
                "main_picture": {"medium": "https://example.com/imageD.jpg"},
                "my_list_status": {"status": "watching", "score": 0},
                "num_episodes": 24,
                "source": "Manga",
                "media_type": "tv",
                "rating": "PG-13",
                "popularity": 100,
                "start_season": {"year": 2019}
            }
        }
    ]
}


########################## VIEWING STATS
# Basic
view_test_1 = {
    'data': [
        {
            'node': {
                'id': 1,
                'main_picture': {'medium': 'image1.jpg'},
                'title': 'Anime 1',
                'my_list_status': {
                    'status': 'completed',
                    'start_date': '2025-01-01',
                    'finish_date': '2025-02-01',
                    'num_episodes_watched': 12
                },
                'media_type': 'tv',
                'average_episode_duration': 1440
            }
        },
        {
            'node': {
                'id': 2,
                'main_picture': {'medium': 'image2.jpg'},
                'title': 'Anime 2',
                'my_list_status': {
                    'status': 'completed',
                    'start_date': '2025-05-01',
                    'finish_date': '2025-05-15',
                    'num_episodes_watched': 10
                },
                'media_type': 'movie',
                'average_episode_duration': 7200
            }
        }
    ]
}

def test_view_1():
    res = filter_viewing_data(view_test_1)
    assert res == {
        'this_year' : {
            'shows': 1,
            "eps": 12,
            'duration': 288
        },
        'avg_completion': 22.5,
        'shortest_completion' : [
                {
                'completion_time': 31,
                'img': 'image1.jpg',
                'title': 'Anime 1',
                },
            ],
        'longest_completion' : [
                {
                'completion_time': 31,
                'img': 'image1.jpg',
                'title': 'Anime 1',
                },
            ],
    }

# empty
view_test_2 = {'data': []}


def test_view_2():
    res = filter_viewing_data(view_test_2)
    assert res == {}

# not met condition
view_test_3 = {
    'data': [
        {
            'node': {
                'id': 3,
                'main_picture': {'medium': 'image3.jpg'},
                'title': 'Anime 3',
                'my_list_status': {
                    'status': 'watching',
                    'num_episodes_watched': 5
                },
                'media_type': 'tv',
                'average_episode_duration': 25 * 60
            }
        }
    ]
}

def test_view_3():
    res = filter_viewing_data(view_test_3)
    assert res == {}

# missing fields
view_test_4 = {
    'data': [
        {
            'node': {
                'id': 4,
                'main_picture': {'medium': 'image4.jpg'},
                'title': 'Anime 4',
                'my_list_status': {
                    'status': 'completed',
                    'start_date': '2023-01-01'
                    # Missing 'finish_date' and 'num_episodes_watched'
                },
                'media_type': 'tv',
                'average_episode_duration': 20 * 60
            }
        }
    ]
}

def test_view_4():
    res = filter_viewing_data(view_test_4)
    assert res == {}

############ STUDIO STATS
# no data
studio_test_1 = {
    "data": []
}

def test_studio_1():
    res = filter_studio_data(studio_test_1)
    assert res == {}

# no completed
studio_test_2 = {
    "data": [
        {
            "node": {
                "id": 1,
                "title": "Anime A",
                "my_list_status": {"status": "watching", "score": 8},
                "studios": [{"id": 101, "name": "Studio A"}],
            }
        }
    ]
}

def test_studio_2():
    res = filter_studio_data(studio_test_2)
    assert res == {}

# multiple studios
studio_test_3 = {
    "data": [
        {
            "node": {
                "id": 2,
                "title": "Anime B",
                "my_list_status": {"status": "completed", "score": 9},
                "studios": [{"id": 102, "name": "Studio B"}, {"id": 103, "name": "Studio C"}],
            }
        }
    ]
}

def test_studio_3():
    res = filter_studio_data(studio_test_3)
    assert res == {}

# 1 studio
studio_test_4 = {
    "data": [
        {
            "node": {
                "id": 3,
                "title": "Anime C",
                "my_list_status": {"status": "completed", "score": 7},
                "studios": [{"id": 104, "name": "Studio D"}],
            }
        }
    ]
}

def test_studio_4():
    res = filter_studio_data(studio_test_4)
    assert res == {
        "top_10_studios_count": [{"studio_name": "Studio D", "count": 1}],
        "top_10_studios_avg": [{"studio_name": "Studio D", "average": 7.0, "count": 1}]
    }

# multiple
studio_test_5 = {
    "data": [
        {
            "node": {
                "id": 4,
                "title": "Anime E",
                "my_list_status": {"status": "completed", "score": 10},
                "studios": [{"id": 105, "name": "Studio E"}],
            }
        },
        {
            "node": {
                "id": 5,
                "title": "Anime F",
                "my_list_status": {"status": "completed", "score": 8},
                "studios": [{"id": 105, "name": "Studio E"}],
            }
        }
    ]
}

def test_studio_5():
    res = filter_studio_data(studio_test_5)
    assert res == {
        "top_10_studios_count": [{"studio_name": "Studio E", "count": 2}],
        "top_10_studios_avg": [{"studio_name": "Studio E", "average": 9.0, "count": 2}]
    }

# zero scores
studio_test_6 = {
    "data": [
        {
            "node": {
                "id": 6,
                "title": "Anime G",
                "my_list_status": {"status": "completed", "score": 0},
                "studios": [{"id": 106, "name": "Studio F"}],
            }
        },
        {
            "node": {
                "id": 7,
                "title": "Anime H",
                "my_list_status": {"status": "completed", "score": 6},
                "studios": [{"id": 106, "name": "Studio F"}],
            }
        }
    ]
}

def test_studio_6():
    res = filter_studio_data(studio_test_6)
    assert res == {
        "top_10_studios_count": [{"studio_name": "Studio F", "count": 2}],
        "top_10_studios_avg": [{"studio_name": "Studio F", "average": 6.0, "count": 2}]
    }
