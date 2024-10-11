import React, { useState } from 'react';

import '../App.css';

const AdminWorkingHours = () => {


    return (
        <div className='AdminCalendarapp-container'>
            <div className="AdminCalendar-left-panel">
                <h2>Working Hours</h2>
                <div className="AdminCalendar-input-group">
                    <label>Day:</label>
                    <input type="text" placeholder="Day" />
                </div>
                <div className="AdminCalendar-input-group">
                    <label>Starting Hour:</label>
                    <input type="text" placeholder="Starting Hour" />
                </div>
                <div className="AdminCalendar-input-group">
                    <label>Ending Hour:</label>
                    <input type="text" placeholder="Ending Hour" />
                </div>
                <div className="AdminCalendar-button-group">
                    <button>Edit day</button>
                    <button>Save day</button>
                </div>
                <div className="AdminCalendar-add-time">
                    <button className="add-button">+</button>
                    <p>Add new time</p>
                </div>
            </div>
            <div className="AdminCalendar-calendar-container">
                <h2>Calendar Placeholder</h2>
                {/* Aquí es donde iría el calendario */}
            </div>
        </div>
    );
}

export default AdminWorkingHours;