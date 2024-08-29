import pytest
from main import filter_watching_anime

# Test all fields
def test_all():
    data = {
        "data" : [
            {
                "node": {
                    "id": 47194,
                    "title": "Summertime Render",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "start_date": "2022-04-15",
                    "end_date": "2022-09-30",
                    "status": "finished_airing",
                    "num_episodes": 25,
                    "broadcast": {
                        "day_of_the_week": "friday",
                        "start_time": "00:00"
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 11,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            }
        ]
    }

    expected_output = [
        {
            'title': "Summertime Render",
            'id': 47194,
            'start_date': '2022-04-15',
            'img': "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
            'eps_watched': 11,
            'eps': 25,
            'broadcast_time': "00:00",
            'delayed_eps': 0,
            'air_status': "finished_airing",
            "end_date": "2022-09-30",
            'eps_array': []
        }
    ]

    assert filter_watching_anime(data) == expected_output

# Test miss list status
def test_list_status():
    data = {
        "data" : [
            {
                "node": {
                    "id": 47194,
                    "title": "Summertime Render",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "start_date": "2022-04-15",
                    "end_date": "2022-09-30",
                    "status": "finished_airing",
                    "num_episodes": 25,
                    "broadcast": {
                        "day_of_the_week": "friday",
                        "start_time": "00:00"
                    }
                }
            }
        ]
    }

    expected_output = [
    ]

    assert filter_watching_anime(data) == expected_output

# Test missing title
def test_miss_title():
    data = {
        "data" : [
            {
                "node": {
                    "id": 47194,
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "start_date": "2022-04-15",
                    "end_date": "2022-09-30",
                    "status": "finished_airing",
                    "num_episodes": 25,
                    "broadcast": {
                        "day_of_the_week": "friday",
                        "start_time": "00:00"
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 11,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            }
        ]
    }

    expected_output = [
    ]

    assert filter_watching_anime(data) == expected_output

# Test missing id
def test_miss_id():
    data = {
        "data" : [
            {
                "node": {
                    "title": "Summertime Render",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "start_date": "2022-04-15",
                    "end_date": "2022-09-30",
                    "status": "finished_airing",
                    "num_episodes": 25,
                    "broadcast": {
                        "day_of_the_week": "friday",
                        "start_time": "00:00"
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 11,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            }
        ]
    }

    expected_output = [
    ]

    assert filter_watching_anime(data) == expected_output

# Test miss node
def test_miss_node():
    data = {
        "data" : [
            {
                "anime": {
                    "id": 47194,
                    "title": "Summertime Render",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "start_date": "2022-04-15",
                    "end_date": "2022-09-30",
                    "status": "finished_airing",
                    "num_episodes": 25,
                    "broadcast": {
                        "day_of_the_week": "friday",
                        "start_time": "00:00"
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 11,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            }
        ]
    }

    expected_output = [
    ]

    assert filter_watching_anime(data) == expected_output

# Test missing start date
def test_miss_start_date():
    data = {
        "data" : [
            {
                "node": {
                    "id": 47194,
                    "title": "Summertime Render",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "end_date": "2022-09-30",
                    "status": "finished_airing",
                    "num_episodes": 25,
                    "broadcast": {
                        "day_of_the_week": "friday",
                        "start_time": "00:00"
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 11,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            }
        ]
    }

    expected_output = [
        {
            'title': "Summertime Render",
            'id': 47194,
            'start_date': None,
            'img': "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
            'eps_watched': 11,
            'eps': 25,
            'broadcast_time': "00:00",
            'delayed_eps': 0,
            'air_status': "finished_airing",
            "end_date": "2022-09-30",
            'eps_array': []
        }
    ]

    assert filter_watching_anime(data) == expected_output

# Test missing picture
def test_miss_pic():
    data = {
        "data" : [
            {
                "node": {
                    "id": 47194,
                    "title": "Summertime Render",
                    "main_picture": {
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "start_date": "2022-04-15",
                    "end_date": "2022-09-30",
                    "status": "finished_airing",
                    "num_episodes": 25,
                    "broadcast": {
                        "day_of_the_week": "friday",
                        "start_time": "00:00"
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 11,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            }
        ]
    }

    expected_output = [
        {
            'title': "Summertime Render",
            'id': 47194,
            'start_date': '2022-04-15',
            'img': None,
            'eps_watched': 11,
            'eps': 25,
            'broadcast_time': "00:00",
            'delayed_eps': 0,
            'air_status': "finished_airing",
            "end_date": "2022-09-30",
            'eps_array': []
        }
    ]

    assert filter_watching_anime(data) == expected_output

# Test missing picture
def test_miss_pic2():
    data = {
        "data" : [
            {
                "node": {
                    "id": 47194,
                    "title": "Summertime Render",
                    "start_date": "2022-04-15",
                    "end_date": "2022-09-30",
                    "status": "finished_airing",
                    "num_episodes": 25,
                    "broadcast": {
                        "day_of_the_week": "friday",
                        "start_time": "00:00"
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 11,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            }
        ]
    }

    expected_output = [
        {
            'title': "Summertime Render",
            'id': 47194,
            'start_date': '2022-04-15',
            'img': None,
            'eps_watched': 11,
            'eps': 25,
            'broadcast_time': "00:00",
            'delayed_eps': 0,
            'air_status': "finished_airing",
            "end_date": "2022-09-30",
            'eps_array': []
        }
    ]

    assert filter_watching_anime(data) == expected_output

# Test missing num_eps
def test_miss_num_eps():
    data = {
        "data" : [
            {
                "node": {
                    "id": 47194,
                    "title": "Summertime Render",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "start_date": "2022-04-15",
                    "end_date": "2022-09-30",
                    "status": "finished_airing",
                    "broadcast": {
                        "day_of_the_week": "friday",
                        "start_time": "00:00"
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 11,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            }
        ]
    }

    expected_output = [
        {
            'title': "Summertime Render",
            'id': 47194,
            'start_date': '2022-04-15',
            'img': "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
            'eps_watched': 11,
            'eps': 0,
            'broadcast_time': "00:00",
            'delayed_eps': 0,
            'air_status': "finished_airing",
            "end_date": "2022-09-30",
            'eps_array': []
        }
    ]

    assert filter_watching_anime(data) == expected_output

# Test missing eps watched
def test_eps_watched():
    data = {
        "data" : [
            {
                "node": {
                    "id": 47194,
                    "title": "Summertime Render",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "start_date": "2022-04-15",
                    "end_date": "2022-09-30",
                    "status": "finished_airing",
                    "num_episodes": 25,
                    "broadcast": {
                        "day_of_the_week": "friday",
                        "start_time": "00:00"
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            }
        ]
    }

    expected_output = [
    ]

    assert filter_watching_anime(data) == expected_output

# test missing broadcast
def test_miss_broadcast():
    data = {
        "data" : [
            {
                "node": {
                    "id": 47194,
                    "title": "Summertime Render",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "start_date": "2022-04-15",
                    "end_date": "2022-09-30",
                    "status": "finished_airing",
                    "num_episodes": 25,
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 11,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            }
        ]
    }

    expected_output = [
        {
            'title': "Summertime Render",
            'id': 47194,
            'start_date': '2022-04-15',
            'img': "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
            'eps_watched': 11,
            'eps': 25,
            'broadcast_time': None,
            'delayed_eps': 0,
            'air_status': "finished_airing",
            "end_date": "2022-09-30",
            'eps_array': []
        }
    ]

    assert filter_watching_anime(data) == expected_output

# Test missing starttime
def test_miss_start():
    data = {
        "data" : [
            {
                "node": {
                    "id": 47194,
                    "title": "Summertime Render",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "start_date": "2022-04-15",
                    "end_date": "2022-09-30",
                    "status": "finished_airing",
                    "num_episodes": 25,
                    "broadcast": {
                        "day_of_the_week": "friday",
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 11,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            }
        ]
    }

    expected_output = [
        {
            'title': "Summertime Render",
            'id': 47194,
            'start_date': '2022-04-15',
            'img': "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
            'eps_watched': 11,
            'eps': 25,
            'broadcast_time': None,
            'delayed_eps': 0,
            'air_status': "finished_airing",
            "end_date": "2022-09-30",
            'eps_array': []
        }
    ]

    assert filter_watching_anime(data) == expected_output

# Test missing status
def test_miss_status():
    data = {
        "data" : [
            {
                "node": {
                    "id": 47194,
                    "title": "Summertime Render",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "start_date": "2022-04-15",
                    "end_date": "2022-09-30",
                    "num_episodes": 25,
                    "broadcast": {
                        "day_of_the_week": "friday",
                        "start_time": "00:00"
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 11,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            }
        ]
    }

    expected_output = [
    ]

    assert filter_watching_anime(data) == expected_output

# Test missing end date
def test_miss_end_date():
    data = {
        "data" : [
            {
                "node": {
                    "id": 47194,
                    "title": "Summertime Render",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "start_date": "2022-04-15",
                    "status": "finished_airing",
                    "num_episodes": 25,
                    "broadcast": {
                        "day_of_the_week": "friday",
                        "start_time": "00:00"
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 11,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            }
        ]
    }

    expected_output = [
        {
            'title': "Summertime Render",
            'id': 47194,
            'start_date': '2022-04-15',
            'img': "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
            'eps_watched': 11,
            'eps': 25,
            'broadcast_time': "00:00",
            'delayed_eps': 0,
            'air_status': "finished_airing",
            "end_date": None,
            'eps_array': []
        }
    ]

    assert filter_watching_anime(data) == expected_output

# Test missing all
def test_miss_all():
    data = {
        "data" : [
        ]
    }

    expected_output = [
    ]

    assert filter_watching_anime(data) == expected_output

def test_miss_all_2():
    data = {
    }

    expected_output = [
    ]

    assert filter_watching_anime(data) == expected_output

# Test multiple
def test_multiple():
    data = {
        "data" : [
            {
                "node": {
                    "id": 47194,
                    "title": "Summertime Render",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1120/120796l.jpg"
                    },
                    "start_date": "2022-04-15",
                    "end_date": "2022-09-30",
                    "status": "finished_airing",
                    "num_episodes": 25,
                    "broadcast": {
                        "day_of_the_week": "friday",
                        "start_time": "00:00"
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 11,
                    "is_rewatching": False,
                    "updated_at": "2024-08-24T08:38:33+00:00",
                    "start_date": "2024-06-29"
                }
            },
            {
                "node": {
                    "id": 55791,
                    "title": "\"Oshi no Ko\" 2nd Season",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1006/143302.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1006/143302l.jpg"
                    },
                    "start_date": "2024-07-03",
                    "status": "currently_airing",
                    "num_episodes": 13,
                    "broadcast": {
                        "day_of_the_week": "wednesday",
                        "start_time": "23:00"
                    }
                },
                "list_status": {
                    "status": "watching",
                    "score": 0,
                    "num_episodes_watched": 8,
                    "is_rewatching": False,
                    "updated_at": "2024-08-22T10:52:06+00:00",
                    "start_date": "2024-07-04"
                }
            }
        ]
    }

    expected_output = [
        {
            'title': "Summertime Render",
            'id': 47194,
            'start_date': '2022-04-15',
            'img': "https://cdn.myanimelist.net/images/anime/1120/120796.jpg",
            'eps_watched': 11,
            'eps': 25,
            'broadcast_time': "00:00",
            'delayed_eps': 0,
            'air_status': "finished_airing",
            "end_date": "2022-09-30",
            'eps_array': []
        },
        {
            'title': "\"Oshi no Ko\" 2nd Season",
            'id': 55791,
            'start_date': '2024-07-03',
            'img': "https://cdn.myanimelist.net/images/anime/1006/143302.jpg",
            'eps_watched': 8,
            'eps': 13,
            'broadcast_time': "23:00",
            'delayed_eps': 0,
            'air_status': "currently_airing",
            "end_date": None,
            'eps_array': []
        }
    ]

    assert filter_watching_anime(data) == expected_output