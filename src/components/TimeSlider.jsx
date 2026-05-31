import React from 'react';

const TimeSlider = ({ value, onChange }) => {
  const parseTime = (val) => {
    if (!val) return 19 * 60;
    const [h, m] = val.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (total) => {
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const totalMinutes = parseTime(value);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const handleChange = (e) => {
    const snapped = Math.round(Number(e.target.value) / 15) * 15;
    onChange(minutesToTime(snapped));
  };

  return (
    <div className="time-slider-container">
      <div className="time-slider-display">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
      </div>
      <input
        type="range"
        min={0}
        max={1425}
        step={15}
        value={totalMinutes}
        onChange={handleChange}
        className="custom-slider"
      />
      <div className="time-slider-range">
        <span>00:00</span>
        <span>12:00</span>
        <span>23:45</span>
      </div>
    </div>
  );
};

export { TimeSlider };
export default TimeSlider;
