import pytest
from main import filter_plan_to_watch_anime

# Basic test with all fields
def test_filter_plan_to_watch_anime_basic():
    data = {
        'data': [
            {
                "node": {
                    "id": 52701,
                    "title": "Dungeon Meshi",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1711/142478.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1711/142478l.jpg"
                    },
                    "start_date": "2024-01-04",
                    "end_date": "2024-06-13",
                    "status": "finished_airing",
                    "num_episodes": 24,
                    "broadcast": {
                        "day_of_the_week": "thursday",
                        "start_time": "22:30"
                    },
                    "start_season": {
                        "year": 2024,
                        "season": "winter"
                    }
                },
                "list_status": {
                    "status": "plan_to_watch",
                    "score": 0,
                    "num_episodes_watched": 0,
                    "is_rewatching": False,
                    "updated_at": "2024-06-22T01:25:56+00:00"
                }
            }
        ]
    }
    expected_output = [
        {
            'title': 'Dungeon Meshi',
            'id': 52701,
            'img': 'https://cdn.myanimelist.net/images/anime/1711/142478.jpg',
            'air_status': 'finished_airing',
            'season': ('winter', '2024'),
            'start_date': '2024-01-04',
            'broadcast_time': '22:30'
        }
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Missing Main_picture
def test_no_main_picture():
    data = {
        'data': [
            {
            "node": {
                "id": 52701,
                "title": "Dungeon Meshi",
                "start_date": "2024-01-04",
                "end_date": "2024-06-13",
                "status": "finished_airing",
                "num_episodes": 24,
                "broadcast": {
                    "day_of_the_week": "thursday",
                    "start_time": "22:30"
                },
                "start_season": {
                    "year": 2024,
                    "season": "winter"
                }
            },
            "list_status": {
                "status": "plan_to_watch",
                "score": 0,
                "num_episodes_watched": 0,
                "is_rewatching": False,
                "updated_at": "2024-06-22T01:25:56+00:00"
            }
        }
        ]
    }
    expected_output = [
        {
            'title': 'Dungeon Meshi',
            'id': 52701,
            'img': None,
            'air_status': 'finished_airing',
            'season': ('winter', '2024'),
            'start_date': '2024-01-04',
            'broadcast_time': '22:30'
        }
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Missing start_season
def test_no_start_season():
    data = {
        'data': [
            {
            "node": {
                "id": 52701,
                "title": "Dungeon Meshi",
                "main_picture": {
                    "medium": "https://cdn.myanimelist.net/images/anime/1711/142478.jpg",
                    "large": "https://cdn.myanimelist.net/images/anime/1711/142478l.jpg"
                },
                "start_date": "2024-01-04",
                "end_date": "2024-06-13",
                "status": "finished_airing",
                "num_episodes": 24,
                "broadcast": {
                    "day_of_the_week": "thursday",
                    "start_time": "22:30"
                }
            },
            "list_status": {
                "status": "plan_to_watch",
                "score": 0,
                "num_episodes_watched": 0,
                "is_rewatching": False,
                "updated_at": "2024-06-22T01:25:56+00:00"
            }
        }
        ]
    }
    expected_output = [
        {
            'title': 'Dungeon Meshi',
            'id': 52701,
            'img': 'https://cdn.myanimelist.net/images/anime/1711/142478.jpg',
            'air_status': 'finished_airing',
            'season': None,
            'start_date': '2024-01-04',
            'broadcast_time': '22:30'
        }
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Missing start_date
def test_no_start_date():
    data = {
        'data': [
            {
            "node": {
                "id": 52701,
                "title": "Dungeon Meshi",
                "main_picture": {
                    "medium": "https://cdn.myanimelist.net/images/anime/1711/142478.jpg",
                    "large": "https://cdn.myanimelist.net/images/anime/1711/142478l.jpg"
                },
                "end_date": "2024-06-13",
                "status": "finished_airing",
                "num_episodes": 24,
                "broadcast": {
                    "day_of_the_week": "thursday",
                    "start_time": "22:30"
                },
                "start_season": {
                    "year": 2024,
                    "season": "winter"
                }
            },
            "list_status": {
                "status": "plan_to_watch",
                "score": 0,
                "num_episodes_watched": 0,
                "is_rewatching": False,
                "updated_at": "2024-06-22T01:25:56+00:00"
            }
        }
        ]
    }
    expected_output = [
        {
            'title': 'Dungeon Meshi',
            'id': 52701,
            'img': 'https://cdn.myanimelist.net/images/anime/1711/142478.jpg',
            'air_status': 'finished_airing',
            'season': ('winter', '2024'),
            'start_date': None,
            'broadcast_time': '22:30'
        }
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Missing broadcast
def test_no_broadcast():
    data = {
        'data': [
            {
            "node": {
                "id": 52701,
                "title": "Dungeon Meshi",
                "main_picture": {
                    "medium": "https://cdn.myanimelist.net/images/anime/1711/142478.jpg",
                    "large": "https://cdn.myanimelist.net/images/anime/1711/142478l.jpg"
                },
                "start_date": "2024-01-04",
                "end_date": "2024-06-13",
                "status": "finished_airing",
                "num_episodes": 24,
                "start_season": {
                    "year": 2024,
                    "season": "winter"
                }
            },
            "list_status": {
                "status": "plan_to_watch",
                "score": 0,
                "num_episodes_watched": 0,
                "is_rewatching": False,
                "updated_at": "2024-06-22T01:25:56+00:00"
            }
        }
        ]
    }
    expected_output = [
        {
            'title': 'Dungeon Meshi',
            'id': 52701,
            'img': 'https://cdn.myanimelist.net/images/anime/1711/142478.jpg',
            'air_status': 'finished_airing',
            'season': ('winter', '2024'),
            'start_date': '2024-01-04',
            'broadcast_time': None
        }
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Empty Data
def test_empty():
    data = {
        'data': [
        ]
    }
    expected_output = [
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Multiple entries
def test_multiple():
    data = {
        'data': [
            {
                "node": {
                    "id": 52701,
                    "title": "Dungeon Meshi",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1711/142478.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1711/142478l.jpg"
                    },
                    "start_date": "2024-01-04",
                    "end_date": "2024-06-13",
                    "status": "finished_airing",
                    "num_episodes": 24,
                    "broadcast": {
                        "day_of_the_week": "thursday",
                        "start_time": "22:30"
                    },
                    "start_season": {
                        "year": 2024,
                        "season": "winter"
                    }
                },
                "list_status": {
                    "status": "plan_to_watch",
                    "score": 0,
                    "num_episodes_watched": 0,
                    "is_rewatching": False,
                    "updated_at": "2024-06-22T01:25:56+00:00"
                }
            },
            {
                "node": {
                    "id": 5114,
                    "title": "Fullmetal Alchemist: Brotherhood",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1208/94745.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg"
                    },
                    "start_date": "2009-04-05",
                    "end_date": "2010-07-04",
                    "status": "finished_airing",
                    "num_episodes": 64,
                    "broadcast": {
                        "day_of_the_week": "sunday",
                        "start_time": "17:00"
                    },
                    "start_season": {
                        "year": 2009,
                        "season": "spring"
                    }
                },
                "list_status": {
                    "status": "plan_to_watch",
                    "score": 0,
                    "num_episodes_watched": 0,
                    "is_rewatching": False,
                    "updated_at": "2023-08-26T23:08:59+00:00"
                }
            }
        ]
    }
    expected_output = [
        {
            'title': 'Dungeon Meshi',
            'id': 52701,
            'img': 'https://cdn.myanimelist.net/images/anime/1711/142478.jpg',
            'air_status': 'finished_airing',
            'season': ('winter', '2024'),
            'start_date': '2024-01-04',
            'broadcast_time': '22:30'
        },
        {
            'title': 'Fullmetal Alchemist: Brotherhood',
            'id': 5114,
            'img': 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
            'air_status': 'finished_airing',
            'season': ('spring', '2009'),
            'start_date': '2009-04-05',
            'broadcast_time': '17:00'
        }
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Missing title (should not be possible)
def test_no_title():
    data = {
        'data': [
            {
            "node": {
                "id": 52701,
                "main_picture": {
                    "medium": "https://cdn.myanimelist.net/images/anime/1711/142478.jpg",
                    "large": "https://cdn.myanimelist.net/images/anime/1711/142478l.jpg"
                },
                "start_date": "2024-01-04",
                "end_date": "2024-06-13",
                "status": "finished_airing",
                "num_episodes": 24,
                "broadcast": {
                    "day_of_the_week": "thursday",
                    "start_time": "22:30"
                },
                "start_season": {
                    "year": 2024,
                    "season": "winter"
                }
            },
            "list_status": {
                "status": "plan_to_watch",
                "score": 0,
                "num_episodes_watched": 0,
                "is_rewatching": False,
                "updated_at": "2024-06-22T01:25:56+00:00"
            }
        }
        ]
    }
    expected_output = [
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Missing id (should not be possible)
def test_no_id():
    data = {
        'data': [
            {
            "node": {
                "title": "Dungeon Meshi",
                "main_picture": {
                    "medium": "https://cdn.myanimelist.net/images/anime/1711/142478.jpg",
                    "large": "https://cdn.myanimelist.net/images/anime/1711/142478l.jpg"
                },
                "start_date": "2024-01-04",
                "end_date": "2024-06-13",
                "status": "finished_airing",
                "num_episodes": 24,
                "broadcast": {
                    "day_of_the_week": "thursday",
                    "start_time": "22:30"
                },
                "start_season": {
                    "year": 2024,
                    "season": "winter"
                }
            },
            "list_status": {
                "status": "plan_to_watch",
                "score": 0,
                "num_episodes_watched": 0,
                "is_rewatching": False,
                "updated_at": "2024-06-22T01:25:56+00:00"
            }
        }
        ]
    }

    expected_output = [
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Missing air_status (should not be possible)
def test_status():
    data = {
        'data': [
            {
            "node": {
                "id": 52701,
                "title": "Dungeon Meshi",
                "main_picture": {
                    "medium": "https://cdn.myanimelist.net/images/anime/1711/142478.jpg",
                    "large": "https://cdn.myanimelist.net/images/anime/1711/142478l.jpg"
                },
                "start_date": "2024-01-04",
                "end_date": "2024-06-13",
                "num_episodes": 24,
                "broadcast": {
                    "day_of_the_week": "thursday",
                    "start_time": "22:30"
                },
                "start_season": {
                    "year": 2024,
                    "season": "winter"
                }
            },
            "list_status": {
                "status": "plan_to_watch",
                "score": 0,
                "num_episodes_watched": 0,
                "is_rewatching": False,
                "updated_at": "2024-06-22T01:25:56+00:00"
            }
        }
        ]
    }
    expected_output = [
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

def test_no_start_time():
    data = {
        'data': [
            {
                "node": {
                    "id": 52701,
                    "title": "Dungeon Meshi",
                    "main_picture": {
                        "medium": "https://cdn.myanimelist.net/images/anime/1711/142478.jpg",
                        "large": "https://cdn.myanimelist.net/images/anime/1711/142478l.jpg"
                    },
                    "start_date": "2024-01-04",
                    "end_date": "2024-06-13",
                    "status": "finished_airing",
                    "num_episodes": 24,
                    "broadcast": {
                        "day_of_the_week": "thursday"
                    },
                    "start_season": {
                        "year": 2024,
                        "season": "winter"
                    }
                },
                "list_status": {
                    "status": "plan_to_watch",
                    "score": 0,
                    "num_episodes_watched": 0,
                    "is_rewatching": False,
                    "updated_at": "2024-06-22T01:25:56+00:00"
                }
            }
        ]
    }
    expected_output = [
        {
            'title': 'Dungeon Meshi',
            'id': 52701,
            'img': 'https://cdn.myanimelist.net/images/anime/1711/142478.jpg',
            'air_status': 'finished_airing',
            'season': ('winter', '2024'),
            'start_date': '2024-01-04',
            'broadcast_time': None
        }
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output