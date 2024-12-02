import pytest
from main import guest_filter_user_anime_for_stats, filter_scoring_data, filter_genre_data

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
        'average_rating_last_year': 0
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
        'average_rating_last_year': 0
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
        'average_rating_last_year': 10.0
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
                    "finish_date": "2024-01-15",
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
                    "finish_date": "2023-12-25",
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
                    "finish_date": "2023-11-05",
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
                    "finish_date": "2024-02-01",
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
            {"genres": "Action", "count": 1},
            {"genres": "Adventure", "count": 1},
            {"genres": "Drama", "count": 1},
            {"genres": "Romance", "count": 1},
        ],
        "genres_this_year": ["Adventure", "Romance"],
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
                    "finish_date": "2024-03-01",
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
