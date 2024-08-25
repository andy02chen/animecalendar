import pytest
from main import filter_plan_to_watch_anime

# Basic test with all fields
def test_filter_plan_to_watch_anime_basic():
    data = {
        'data': [
            {
                'node': {
                    'title': 'Title',
                    'id': 1,
                    'main_picture': {'medium': 'http://example.com/image.jpg'},
                    'status': 'currently_airing',
                    'start_season': {'season': 'summer', 'year': 2024},
                    'start_date': '2024-07-01',
                    'broadcast': {'start_time': '18:00'}
                }
            }
        ]
    }
    expected_output = [
        {
            'title': 'Title',
            'id': 1,
            'img': 'http://example.com/image.jpg',
            'air_status': 'currently_airing',
            'season': ('summer', '2024'),
            'start_date': '2024-07-01',
            'broadcast_time': '18:00'
        }
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Missing Main_picture
def test_no_main_picture():
    data = {
        'data': [
            {
                'node': {
                    'title': 'Title',
                    'id': 1,
                    'status': 'currently_airing',
                    'start_season': {'season': 'summer', 'year': 2024},
                    'start_date': '2024-07-01',
                    'broadcast': {'start_time': '18:00'}
                }
            }
        ]
    }
    expected_output = [
        {
            'title': 'Title',
            'id': 1,
            'img': None,
            'air_status': 'currently_airing',
            'season': ('summer', '2024'),
            'start_date': '2024-07-01',
            'broadcast_time': '18:00'
        }
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Missing start_season
def test_no_start_season():
    data = {
        'data': [
            {
                'node': {
                    'title': 'Title',
                    'id': 1,
                    'main_picture': {'medium': 'http://example.com/image.jpg'},
                    'status': 'currently_airing',
                    'start_date': '2024-07-01',
                    'broadcast': {'start_time': '18:00'}
                }
            }
        ]
    }
    expected_output = [
        {
            'title': 'Title',
            'id': 1,
            'img': 'http://example.com/image.jpg',
            'air_status': 'currently_airing',
            'season': None,
            'start_date': '2024-07-01',
            'broadcast_time': '18:00'
        }
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Missing start_date
def test_no_start_date():
    data = {
        'data': [
            {
                'node': {
                    'title': 'Title',
                    'id': 1,
                    'main_picture': {'medium': 'http://example.com/image.jpg'},
                    'status': 'currently_airing',
                    'start_season': {'season': 'summer', 'year': 2024},
                    'broadcast': {'start_time': '18:00'}
                }
            }
        ]
    }
    expected_output = [
        {
            'title': 'Title',
            'id': 1,
            'img': 'http://example.com/image.jpg',
            'air_status': 'currently_airing',
            'season': ('summer', '2024'),
            'start_date': None,
            'broadcast_time': '18:00'
        }
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Missing broadcast
def test_no_broadcast():
    data = {
        'data': [
            {
                'node': {
                    'title': 'Title',
                    'id': 1,
                    'main_picture': {'medium': 'http://example.com/image.jpg'},
                    'status': 'currently_airing',
                    'start_season': {'season': 'summer', 'year': 2024},
                    'start_date': '2024-07-01'
                }
            }
        ]
    }
    expected_output = [
        {
            'title': 'Title',
            'id': 1,
            'img': 'http://example.com/image.jpg',
            'air_status': 'currently_airing',
            'season': ('summer', '2024'),
            'start_date': '2024-07-01',
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
                'node': {
                    'title': 'Anime One',
                    'id': 1,
                    'status': 'currently_airing',
                    'start_season': {'season': 'winter', 'year': 2023},
                    'start_date': '2023-01-01',
                    'broadcast': {'start_time': '12:00'}
                }
            },
            {
                'node': {
                    'title': 'Anime Two',
                    'id': 2,
                    'main_picture': {'medium': 'http://example.com/image2.jpg'},
                    'status': 'finished_airing',
                    'start_season': {'season': 'spring', 'year': 2022},
                }
            }
        ]
    }
    expected_output = [
        {
            'title': 'Anime One',
            'id': 1,
            'img': None,
            'air_status': 'currently_airing',
            'season': ('winter', '2023'),
            'start_date': '2023-01-01',
            'broadcast_time': '12:00'
        },
        {
            'title': 'Anime Two',
            'id': 2,
            'img': 'http://example.com/image2.jpg',
            'air_status': 'finished_airing',
            'season': ('spring', '2022'),
            'start_date': None,
            'broadcast_time': None
        }
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Missing title (should not be possible)
def test_no_title():
    data = {
        'data': [
            {
                'node': {
                    'id': 1,
                    'main_picture': {'medium': 'http://example.com/image.jpg'},
                    'status': 'currently_airing',
                    'start_season': {'season': 'summer', 'year': 2024},
                    'start_date': '2024-07-01',
                    'broadcast': {'start_time': '18:00'}
                }
            }
        ]
    }
    expected_output = [
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output

# Missing id (should not be possible)
def test_no_title():
    data = {
        'data': [
            {
                'node': {
                    'title': 'Title',
                    'main_picture': {'medium': 'http://example.com/image.jpg'},
                    'status': 'currently_airing',
                    'start_season': {'season': 'summer', 'year': 2024},
                    'start_date': '2024-07-01',
                    'broadcast': {'start_time': '18:00'}
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
                'node': {
                    'title': 'Title',
                    'id': 1,
                    'main_picture': {'medium': 'http://example.com/image.jpg'},
                    'start_season': {'season': 'summer', 'year': 2024},
                    'start_date': '2024-07-01',
                    'broadcast': {'start_time': '18:00'}
                }
            }
        ]
    }
    expected_output = [
    ]
    
    assert filter_plan_to_watch_anime(data) == expected_output