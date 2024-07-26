import './Calendar.css'

function Calendar() {
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    return(
        <div className='calendar-main'>
            <div>
                <div className='days-div'>
                    <ul className='days-of-week'>
                        {daysOfWeek.map((day, index) => 
                            <li key={index}>
                                <h1 className='day-title'>{day}</h1>
                            </li>
                        )}
                    </ul>
                </div>
                <div className='dates-div'>
                    <ul>
                        <li className='inactive-date'>28</li>
                        <li className='inactive-date'>29</li>
                        <li className='inactive-date'>30</li>
                        <li className='inactive-date'>31</li>
                        <li>1</li>
                        <li>2</li>
                        <li className='today'>3</li>
                        <li>4</li>
                        <li>5</li>
                        <li>6</li>
                        <li>7</li>
                        <li>8</li>
                        <li>9</li>
                        <li>10</li>
                        <li>11</li>
                        <li>12</li>
                        <li>13</li>
                        <li>14</li>
                        <li>15</li>
                        <li>16</li>
                        <li>17</li>
                        <li>18</li>
                        <li>19</li>
                        <li>20</li>
                        <li>21</li>
                        <li>22</li>
                        <li>23</li>
                        <li>24</li>
                        <li>25</li>
                        <li>26</li>
                        <li>27</li>
                        <li>28</li>
                        <li>29</li>
                        <li>30</li>
                        <li className='inactive-date'>1</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Calendar;