import pytest
from main import filter_user_anime_for_stats, guest_filter_user_anime_for_stats

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


# !!!!!!!!!!! USER STATS

# basic
test_basic_user = {
    "data": [
        {
            "node": {
                "id": 1,
                "title": "Anime A",
                "main_picture": {"medium": "http://example.com/imageA.jpg"},
                "mean": 8.5,
                "my_list_status": {"status": "completed", "score": 9},
                "rank": 200,
                "rating": "PG-13",
                "source": "Manga",
                "start_season": {"year": 2020},
                "genres": [{"name": "Action"}, {"name": "Adventure"}],
                "studios": [{"id": 101, "name": "Studio A"}]
            }
        },
        {
            "node": {
                "id": 2,
                "title": "Anime B",
                "main_picture": {"medium": "http://example.com/imageB.jpg"},
                "mean": 7.0,
                "my_list_status": {"status": "watching", "score": 0},
                "rank": 500,
                "rating": "R",
                "source": "Original",
                "start_season": {"year": 2019},
                "genres": [{"name": "Drama"}],
                "studios": [{"id": 102, "name": "Studio B"}]
            }
        }
    ]
}


def test_user_basic_data():
    res = filter_user_anime_for_stats(test_basic_user)
    assert res == {
        "top_10_genres_count": [{"genre": "Action", "count": 1}, {"genre": "Adventure", "count": 1}],
        "top_10_genres_avg": [{"genre": "Action", "average": 9.0}, {"genre": "Adventure", "average": 9.0}],
        "popular_ratings": [{"name": "PG-13", "value": 1}],
        "sources": [{"source": "Manga", "count": 1}],
        "top_10_studios_count": [{"studio_name": "Studio A", "count": 1}],
        "top_10_studios_avg": [{"studio_name": "Studio A", "average": 9.0, "count": 1}],
        "top_20_anime": [{"title": "Anime A", "your_score": 9, "mal_score": 8.5, "img": "http://example.com/imageA.jpg"}],
        "average_rating": {"your_score": 9.0, "mal_score": 8.5},
        "season_anime": [{"start_year": 2020, "count": 1}]
    }


# all completed
all_complete = {
    "data": [
        {
            "node": {
                "id": 1,
                "title": "Anime A",
                "main_picture": {"medium": "http://example.com/imageA.jpg"},
                "mean": 8.5,
                "my_list_status": {"status": "completed", "score": 9},
                "rank": 200,
                "rating": "PG-13",
                "source": "Manga",
                "start_season": {"year": 2020},
                "genres": [{"name": "Action"}, {"name": "Adventure"}],
                "studios": [{"id": 101, "name": "Studio A"}]
            }
        },
        {
            "node": {
                "id": 2,
                "title": "Anime B",
                "main_picture": {"medium": "http://example.com/imageB.jpg"},
                "mean": 7.0,
                "my_list_status": {"status": "completed", "score": 7},
                "rank": 500,
                "rating": "R",
                "source": "Original",
                "start_season": {"year": 2019},
                "genres": [{"name": "Drama"}],
                "studios": [{"id": 102, "name": "Studio B"}]
            }
        }
    ]
}
def test_all_completed():
    res = filter_user_anime_for_stats(all_complete)
    assert res == {
        "top_10_genres_count": [
            {"genre": "Action", "count": 1},
            {"genre": "Adventure", "count": 1},
            {"genre": "Drama", "count": 1}
        ],
        "top_10_genres_avg": [
            {"genre": "Action", "average": 9.0},
            {"genre": "Adventure", "average": 9.0},
            {"genre": "Drama", "average": 7.0}
        ],
        "popular_ratings": [{"name": "PG-13", "value": 1}, {"name": "R", "value": 1}],
        "sources": [{"source": "Manga", "count": 1}, {"source": "Original", "count": 1}],
        "top_10_studios_count": [
            {"studio_name": "Studio A", "count": 1},
            {"studio_name": "Studio B", "count": 1}
        ],
        "top_10_studios_avg": [
            {"studio_name": "Studio A", "average": 9.0, "count": 1},
            {"studio_name": "Studio B", "average": 7.0, "count": 1}
        ],
        "top_20_anime": [
            {"title": "Anime A", "your_score": 9, "mal_score": 8.5, "img": "http://example.com/imageA.jpg"},
            {"title": "Anime B", "your_score": 7, "mal_score": 7.0, "img": "http://example.com/imageB.jpg"}
        ],
        "average_rating": {"your_score": 8.0, "mal_score": 7.75},
        "season_anime": [
            {"start_year": 2019, "count": 1},
            {"start_year": 2020, "count": 1}
        ]
    }

# no compelted
no_comp = {
    "data": [
        {
            "node": {
                "id": 1,
                "title": "Anime A",
                "main_picture": {"medium": "http://example.com/imageA.jpg"},
                "mean": 8.5,
                "my_list_status": {"status": "watching", "score": 9},
                "rank": 200,
                "rating": "PG-13",
                "source": "Manga",
                "start_season": {"year": 2020},
                "genres": [{"name": "Action"}, {"name": "Adventure"}],
                "studios": [{"id": 101, "name": "Studio A"}]
            }
        }
    ]
}

def test_no_completed():
    res = filter_user_anime_for_stats(no_comp)
    assert res == {}

# genres and studios no score
no_scores = {
    "data": [
        {
            "node": {
                "id": 1,
                "title": "Anime A",
                "my_list_status": {"status": "completed", "score": 0},
                "genres": [{"name": "Action"}],
                "studios": [{"id": 101, "name": "Studio A"}],
                "main_picture": {"medium": "http://example.com/imageA.jpg"},
                "mean": 8.5,
            }
        }
    ]
}

def test_no_scores():
    res = filter_user_anime_for_stats(no_scores)
    assert res == {}

# multiple studios
multi_studios = {
    "data": [
        {
            "node": {
                "id": 1,
                "title": "Anime A",
                "main_picture": {"medium": "http://example.com/imageA.jpg"},
                "mean": 8.5,
                "my_list_status": {"status": "completed", "score": 9},
                "rank": 200,
                "rating": "PG-13",
                "source": "Manga",
                "start_season": {"year": 2020},
                "genres": [{"name": "Action"}, {"name": "Adventure"}],
                "studios": [{"id": 101, "name": "Studio A"}, {"id": 102, "name": "Studio B"}]
            }
        },
        {
            "node": {
                "id": 2,
                "title": "Anime B",
                "main_picture": {"medium": "http://example.com/imageB.jpg"},
                "mean": 7.0,
                "my_list_status": {"status": "watching", "score": 7},
                "rank": 500,
                "rating": "R",
                "source": "Original",
                "start_season": {"year": 2019},
                "genres": [{"name": "Drama"}],
                "studios": [{"id": 102, "name": "Studio B"}]
            }
        }
    ]
}

def test_multi_studios():
    res = filter_user_anime_for_stats(multi_studios)
    assert res == {}